const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // 創建演示用戶 (客戶)
    const demoPassword = await bcrypt.hash('demo123', 12);
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@guidee.com' },
      update: {},
      create: {
        email: 'demo@guidee.com',
        passwordHash: demoPassword,
        name: '演示用戶',
        role: 'CUSTOMER',
        isEmailVerified: true,
        isKycVerified: true,
        permissions: ['user:read', 'booking:create'],
        settings: {
          subscribeNewsletter: false,
          notifications: {
            email: true,
            push: true,
            sms: false
          }
        }
      }
    });

    // 創建演示導遊
    const guidePassword = await bcrypt.hash('guide123', 12);
    const guideUser = await prisma.user.upsert({
      where: { email: 'guide@guidee.com' },
      update: {},
      create: {
        email: 'guide@guidee.com',
        passwordHash: guidePassword,
        name: '演示導遊',
        role: 'GUIDE',
        isEmailVerified: true,
        isKycVerified: true,
        permissions: ['user:read', 'guide:manage', 'booking:manage'],
        settings: {
          subscribeNewsletter: true,
          notifications: {
            email: true,
            push: true,
            sms: true
          }
        }
      }
    });

    // 為導遊創建用戶檔案
    await prisma.userProfile.upsert({
      where: { userId: guideUser.id },
      update: {},
      create: {
        userId: guideUser.id,
        bio: '專業旅遊導遊，擁有5年豐富導覽經驗，熱愛分享台灣在地文化',
        location: '台北市',
        languages: ['中文', '英文', '日文'],
        specialties: ['文化導覽', '美食體驗', '攝影指導'],
        experienceYears: 5,
        certifications: ['台北市導遊證照', '英語導遊認證'],
        socialLinks: {
          facebook: 'https://facebook.com/demo.guide',
          instagram: 'https://instagram.com/demo_guide'
        }
      }
    });

    console.log('✅ 測試用戶創建成功！');
    console.log('📧 客戶帳戶: demo@guidee.com / demo123');
    console.log('🏃‍♀️ 導遊帳戶: guide@guidee.com / guide123');
    
  } catch (error) {
    console.error('❌ 創建測試用戶失敗:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();