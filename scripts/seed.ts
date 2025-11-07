import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('開始種子資料...');

  // 清理現有資料（注意順序，先刪除有外鍵關聯的資料）
  await prisma.kycSubmission.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.serviceAvailability.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.user.deleteMany({});

  // 建立測試用戶
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash('password123', saltRounds);

  // 建立導遊用戶
  const guide1 = await prisma.user.create({
    data: {
      email: 'guide1@guidee.com',
      passwordHash: hashedPassword,
      name: '張小美',
      phone: '0912345678',
      role: 'GUIDE',
      isEmailVerified: true,
      isKycVerified: true,
      isCriminalRecordVerified: true,
      permissions: ['user:read', 'guide:manage', 'booking:manage'],
      profile: {
        bio: '專業台北導遊，擁有5年導覽經驗',
        location: '台北市',
        languages: ['中文', '英文'],
        specialties: ['歷史文化', '美食導覽']
      }
    }
  });

  const guide2 = await prisma.user.create({
    data: {
      email: 'guide2@guidee.com',
      passwordHash: hashedPassword,
      name: '李大明',
      phone: '0987654321',
      role: 'GUIDE',
      isEmailVerified: true,
      isKycVerified: true,
      isCriminalRecordVerified: true,
      permissions: ['user:read', 'guide:manage', 'booking:manage'],
      profile: {
        bio: '資深地陪導遊，專精自然生態導覽',
        location: '台中市',
        languages: ['中文', '英文', '日文'],
        specialties: ['自然生態', '攝影指導']
      }
    }
  });

  // 建立管理員用戶
  const admin = await prisma.user.create({
    data: {
      email: 'admin@guidee.com',
      passwordHash: hashedPassword,
      name: '系統管理員',
      role: 'ADMIN',
      isEmailVerified: true,
      isKycVerified: true,
      permissions: ['admin:full', 'user:manage', 'service:manage', 'booking:manage']
    }
  });

  // 建立客戶用戶
  const customer = await prisma.user.create({
    data: {
      email: 'customer@guidee.com',
      passwordHash: hashedPassword,
      name: '王小明',
      phone: '0912345678',
      role: 'CUSTOMER',
      isEmailVerified: true,
      isKycVerified: false,
      permissions: ['user:read']
    }
  });

  // 建立用戶檔案
  await prisma.userProfile.createMany({
    data: [
      {
        userId: guide1.id,
        bio: '專業台北導遊，擁有5年導覽經驗',
        location: '台北市',
        languages: ['中文', '英文'],
        specialties: ['歷史文化', '美食導覽'],
        experienceYears: 5
      },
      {
        userId: guide2.id,
        bio: '資深地陪導遊，專精自然生態導覽',
        location: '台中市',
        languages: ['中文', '英文', '日文'],
        specialties: ['自然生態', '攝影指導'],
        experienceYears: 8
      }
    ]
  });

  // 建立 KYC 提交記錄
  await prisma.kycSubmission.createMany({
    data: [
      {
        userId: guide1.id,
        idNumber: 'A123456789',
        birthDate: new Date('1990-01-01'),
        address: '台北市中正區重慶南路一段122號',
        emergencyContact: '張太太: 0987654321',
        idFrontImageUrl: 'https://example.com/id-front-1.jpg',
        idBackImageUrl: 'https://example.com/id-back-1.jpg',
        selfieImageUrl: 'https://example.com/selfie-1.jpg',
        criminalRecordUrl: 'https://example.com/criminal-record-1.pdf',
        status: 'approved',
        reviewedBy: admin.id,
        reviewedAt: new Date()
      },
      {
        userId: guide2.id,
        idNumber: 'B987654321',
        birthDate: new Date('1985-05-15'),
        address: '台中市西區公益路二段51號',
        emergencyContact: '李先生: 0912345678',
        idFrontImageUrl: 'https://example.com/id-front-2.jpg',
        idBackImageUrl: 'https://example.com/id-back-2.jpg',
        selfieImageUrl: 'https://example.com/selfie-2.jpg',
        criminalRecordUrl: 'https://example.com/criminal-record-2.pdf',
        status: 'approved',
        reviewedBy: admin.id,
        reviewedAt: new Date()
      }
    ]
  });

  console.log('種子資料建立完成！');
  console.log('已建立用戶：');
  console.log('- 導遊1: guide1@guidee.com (password: password123)');
  console.log('- 導遊2: guide2@guidee.com (password: password123)');
  console.log('- 管理員: admin@guidee.com (password: password123)');
  console.log('- 客戶: customer@guidee.com (password: password123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });