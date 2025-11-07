import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('建立待審核的 KYC 申請...');

  // 建立一些待審核的導遊用戶
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash('password123', saltRounds);

  // 建立待審核的導遊用戶
  const pendingGuide1 = await prisma.user.create({
    data: {
      email: 'pending_guide1@guidee.com',
      passwordHash: hashedPassword,
      name: '陳小華',
      phone: '0923456789',
      role: 'GUIDE',
      isEmailVerified: true,
      isKycVerified: false,
      isCriminalRecordVerified: false,
      permissions: ['user:read', 'guide:manage']
    }
  });

  const pendingGuide2 = await prisma.user.create({
    data: {
      email: 'pending_guide2@guidee.com',
      passwordHash: hashedPassword,
      name: '林美玲',
      phone: '0934567890',
      role: 'GUIDE',
      isEmailVerified: true,
      isKycVerified: false,
      isCriminalRecordVerified: false,
      permissions: ['user:read', 'guide:manage']
    }
  });

  const pendingGuide3 = await prisma.user.create({
    data: {
      email: 'pending_guide3@guidee.com',
      passwordHash: hashedPassword,
      name: '黃志明',
      phone: '0945678901',
      role: 'GUIDE',
      isEmailVerified: true,
      isKycVerified: false,
      isCriminalRecordVerified: false,
      permissions: ['user:read', 'guide:manage']
    }
  });

  // 建立對應的 KYC 申請（待審核）
  await prisma.kycSubmission.createMany({
    data: [
      {
        userId: pendingGuide1.id,
        idNumber: 'C123456789',
        birthDate: new Date('1992-03-15'),
        address: '台北市大安區敦化南路一段100號',
        emergencyContact: '陳太太: 0987654321',
        idFrontImageUrl: 'https://example.com/id-front-pending-1.jpg',
        idBackImageUrl: 'https://example.com/id-back-pending-1.jpg',
        selfieImageUrl: 'https://example.com/selfie-pending-1.jpg',
        criminalRecordUrl: 'https://example.com/criminal-record-pending-1.pdf',
        status: 'pending'
      },
      {
        userId: pendingGuide2.id,
        idNumber: 'D987654321',
        birthDate: new Date('1988-07-22'),
        address: '台中市西屯區台灣大道三段200號',
        emergencyContact: '林先生: 0912345678',
        idFrontImageUrl: 'https://example.com/id-front-pending-2.jpg',
        idBackImageUrl: 'https://example.com/id-back-pending-2.jpg',
        selfieImageUrl: 'https://example.com/selfie-pending-2.jpg',
        criminalRecordUrl: 'https://example.com/criminal-record-pending-2.pdf',
        status: 'pending'
      },
      {
        userId: pendingGuide3.id,
        idNumber: 'E555666777',
        birthDate: new Date('1995-11-08'),
        address: '高雄市前鎮區中華五路300號',
        emergencyContact: '黃媽媽: 0998877665',
        idFrontImageUrl: 'https://example.com/id-front-pending-3.jpg',
        idBackImageUrl: 'https://example.com/id-back-pending-3.jpg',
        selfieImageUrl: 'https://example.com/selfie-pending-3.jpg',
        // 這個申請沒有良民證
        status: 'pending'
      }
    ]
  });

  console.log('待審核 KYC 申請建立完成！');
  console.log('已建立待審核導遊：');
  console.log('- 陳小華: pending_guide1@guidee.com (有良民證)');
  console.log('- 林美玲: pending_guide2@guidee.com (有良民證)');
  console.log('- 黃志明: pending_guide3@guidee.com (無良民證)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });