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
      phone: '0912345678'
    },
    {
      email: 'guide2@test.com',
      password: '123456',
      name: '李大明',
      role: 'GUIDE',
      phone: '0923456789'
    },
    {
      email: 'customer@test.com',
      password: '123456',
      name: '測試客戶',
      role: 'CUSTOMER',
      phone: '0934567890'
    },
    {
      email: 'admin@test.com',
      password: '123456',
      name: '管理員',
      role: 'ADMIN',
      phone: '0945678901'
    }
  ];

  for (const userData of testUsers) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          name: userData.name,
          role: userData.role as any,
          phone: userData.phone,
          isEmailVerified: true,
          isKycVerified: false,
          permissions:
            userData.role === 'GUIDE'
              ? ['user:read', 'guide:manage', 'booking:manage']
              : userData.role === 'ADMIN'
              ? ['admin:full', 'user:manage', 'service:manage', 'booking:manage']
              : ['user:read'],
          profile: {}
        }
      });

      console.log(`✓ 創建成功: ${userData.email} (密碼: ${userData.password})`);
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
