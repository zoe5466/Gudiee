import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('開始創建測試帳號...\n');

  const testUsers = [
    {
      email: 'guide1@test.com',
      password: '123456',
      name: '張小美',
      role: 'GUIDE',
      phone: '0912345678',
      skipKyc: false
    },
    {
      email: 'guide2@test.com',
      password: '123456',
      name: '李大明',
      role: 'GUIDE',
      phone: '0923456789',
      skipKyc: false
    },
    {
      email: 'customer@test.com',
      password: '123456',
      name: '測試客戶',
      role: 'CUSTOMER',
      phone: '0934567890',
      skipKyc: false
    },
    {
      email: 'admin@test.com',
      password: '123456',
      name: '管理員',
      role: 'ADMIN',
      phone: '0945678901',
      skipKyc: false
    },
    // 不需要 KYC 驗證的快速測試帳號
    {
      email: 'guide-quick@test.com',
      password: '123456',
      name: '快速測試導遊',
      role: 'GUIDE',
      phone: '0956789012',
      skipKyc: true
    },
    {
      email: 'customer-quick@test.com',
      password: '123456',
      name: '快速測試客戶',
      role: 'CUSTOMER',
      phone: '0967890123',
      skipKyc: true
    },
    {
      email: 'admin-quick@test.com',
      password: '123456',
      name: '快速管理員',
      role: 'ADMIN',
      phone: '0978901234',
      skipKyc: true
    }
  ];

  for (const userData of testUsers) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // 為快速測試帳號預填個人資料
      const profileData = userData.skipKyc ? {
        firstName: userData.name.slice(0, 2),
        lastName: userData.name.slice(2),
        bio: `快速測試帳號 - ${userData.role === 'GUIDE' ? '導遊' : userData.role === 'CUSTOMER' ? '客戶' : '管理員'}`,
        avatar: null,
        idNumber: '123456789',
        address: '台北市信義區',
        birthDate: '1990-01-01'
      } : {};

      await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          name: userData.name,
          role: userData.role as any,
          phone: userData.phone,
          isEmailVerified: true,
          isKycVerified: userData.skipKyc ? true : false,
          permissions:
            userData.role === 'GUIDE'
              ? ['user:read', 'guide:manage', 'booking:manage']
              : userData.role === 'ADMIN'
              ? ['admin:full', 'user:manage', 'service:manage', 'booking:manage']
              : ['user:read'],
          profile: profileData
        }
      });

      const kycStatus = userData.skipKyc ? '✓ (已驗證)' : '✗ (待驗證)';
      console.log(`✓ 創建成功: ${userData.email} (密碼: ${userData.password}) - KYC: ${kycStatus}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠ 帳號已存在: ${userData.email}`);
      } else {
        console.error(`✗ 錯誤 [${userData.email}]:`, error.message);
      }
    }
  }

  console.log('\n✓ 測試帳號設置完成！');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('腳本執行失敗:', error);
  process.exit(1);
});
