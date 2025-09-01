import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('開始數據庫種子數據生成...');

  // 清理現有數據（按照外鍵依賴順序）
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // 創建測試用戶
  const hashedPassword = await bcrypt.hash('password123', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  // 管理員用戶
  const admin = await prisma.user.create({
    data: {
      email: 'admin@guidee.com',
      passwordHash: adminPassword,
      name: '系統管理員',
      role: 'ADMIN',
      isEmailVerified: true,
      isKycVerified: true,
      permissions: ['admin:full', 'user:manage', 'service:manage', 'booking:manage', 'review:manage'],
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

  // 導遊用戶
  const guide1 = await prisma.user.create({
    data: {
      email: 'guide1@guidee.com',
      passwordHash: hashedPassword,
      name: '張小美',
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

  const guide2 = await prisma.user.create({
    data: {
      email: 'guide2@guidee.com',
      passwordHash: hashedPassword,
      name: '李大明',
      role: 'GUIDE',
      isEmailVerified: true,
      isKycVerified: true,
      permissions: ['user:read', 'guide:manage', 'booking:manage'],
      settings: {
        subscribeNewsletter: true,
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    }
  });

  // 客戶用戶
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@guidee.com',
      passwordHash: hashedPassword,
      name: '王小華',
      role: 'CUSTOMER',
      isEmailVerified: true,
      permissions: ['user:read', 'booking:create'],
      settings: {
        subscribeNewsletter: true,
        notifications: {
          email: true,
          push: false,
          sms: false
        }
      }
    }
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@guidee.com',
      passwordHash: hashedPassword,
      name: '陳雅婷',
      role: 'CUSTOMER',
      isEmailVerified: true,
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

  // 創建導遊檔案
  await prisma.userProfile.create({
    data: {
      userId: guide1.id,
      bio: '資深台北導遊，專精歷史文化導覽，擁有10年豐富經驗。熱愛分享台灣在地故事，讓每位旅客都能深度體驗台灣文化之美。',
      location: '台北市',
      languages: ['中文', '英文', '日文'],
      specialties: ['歷史文化', '美食導覽', '夜市體驗'],
      experienceYears: 10,
      certifications: ['台北市導遊證照', '英語導遊認證'],
      socialLinks: {
        instagram: 'https://instagram.com/guide_xiaomei',
        facebook: 'https://facebook.com/guide.xiaomei'
      }
    }
  });

  await prisma.userProfile.create({
    data: {
      userId: guide2.id,
      bio: '專業自然生態導遊，熟悉台灣山林步道與生態環境。致力於環境保護教育，帶領遊客親近大自然的同時學習生態知識。',
      location: '台中市',
      languages: ['中文', '英文'],
      specialties: ['生態導覽', '登山健行', '攝影指導'],
      experienceYears: 8,
      certifications: ['生態導遊證照', '山域嚮導證'],
      socialLinks: {
        website: 'https://natureguide-taiwan.com',
        instagram: 'https://instagram.com/nature_guide_ming'
      }
    }
  });

  // 創建服務
  const service1 = await prisma.service.create({
    data: {
      title: '台北老城文化深度導覽',
      description: '帶您走進台北的歷史巷弄，探索百年古蹟與傳統文化。從龍山寺到迪化街，深度了解台北的過去與現在。',
      location: '台北市萬華區',
      durationHours: 4,
      price: 1200,
      maxGuests: 8,
      included: ['專業導覽解說', '古蹟門票', '傳統茶點體驗', '文化手冊'],
      notIncluded: ['交通費', '個人消費', '保險'],
      cancellationPolicy: '活動前48小時可免費取消，24-48小時內取消收取50%費用，24小時內取消恕不退費。',
      highlights: ['百年龍山寺參拜體驗', '迪化街古早味小吃', '剝皮寮歷史街區', '艋舺夜市導覽'],
      images: [
        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578398809271-6b36b9d76618?w=800&h=600&fit=crop'
      ],
      guideId: guide1.id,
      status: 'ACTIVE'
    }
  });

  const service2 = await prisma.service.create({
    data: {
      title: '陽明山生態探索之旅',
      description: '深入陽明山國家公園，探索台灣特有的火山地形與豐富生態。專業生態導遊帶您認識台灣原生植物與野生動物。',
      location: '台北市北投區陽明山',
      durationHours: 6,
      price: 1800,
      maxGuests: 12,
      included: ['專業生態導覽', '國家公園導覽費', '生態觀察工具', '健康輕食'],
      notIncluded: ['交通費', '個人裝備', '保險'],
      cancellationPolicy: '因天候因素可彈性調整，活動前24小時可免費改期。',
      highlights: ['火山口地形觀察', '溫泉生態體驗', '台灣特有種植物', '野鳥觀賞'],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      ],
      guideId: guide2.id,
      status: 'ACTIVE'
    }
  });

  const service3 = await prisma.service.create({
    data: {
      title: '台北夜市美食巡禮',
      description: '一晚走遍台北最具代表性的夜市，品嚐道地台灣小吃。從士林夜市到饒河夜市，體驗台灣夜市文化精髓。',
      location: '台北市各大夜市',
      durationHours: 5,
      price: 1500,
      maxGuests: 10,
      included: ['專業美食導覽', '精選小吃品嚐', '夜市文化解說', '美食地圖'],
      notIncluded: ['個人額外消費', '交通費', '飲料費用'],
      cancellationPolicy: '活動當日不可取消，活動前一日可改期一次。',
      highlights: ['士林夜市經典小吃', '饒河夜市特色美食', '在地人推薦隱藏版', '夜市文化體驗'],
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
      ],
      guideId: guide1.id,
      status: 'ACTIVE'
    }
  });

  // 創建預訂
  const booking1 = await prisma.booking.create({
    data: {
      serviceId: service1.id,
      guideId: guide1.id,
      travelerId: customer1.id,
      bookingDate: new Date('2024-02-15'),
      startTime: new Date('1970-01-01T09:00:00Z'),
      endTime: new Date('1970-01-01T13:00:00Z'),
      guests: 2,
      durationHours: 4,
      basePrice: 2400,
      serviceFee: 0,
      totalAmount: 2400,
      specialRequests: '希望能多介紹一些歷史故事，我們對台灣歷史很感興趣。',
      contactInfo: {
        name: '王大華',
        phone: '0912-345-678',
        relationship: '配偶'
      },
      status: 'COMPLETED',
      paymentStatus: 'COMPLETED'
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      serviceId: service2.id,
      guideId: guide2.id,
      travelerId: customer2.id,
      bookingDate: new Date('2024-03-01'),
      startTime: new Date('1970-01-01T08:00:00Z'),
      endTime: new Date('1970-01-01T14:00:00Z'),
      guests: 1,
      durationHours: 6,
      basePrice: 1800,
      serviceFee: 0,
      totalAmount: 1800,
      specialRequests: '第一次參加生態導覽，希望導遊可以詳細解說。',
      contactInfo: {
        name: '陳雅婷',
        phone: '0987-654-321',
        email: 'customer2@guidee.com'
      },
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED'
    }
  });

  // 創建付款記錄
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      userId: customer1.id,
      paymentMethod: 'CREDIT_CARD',
      paymentProvider: 'STRIPE',
      providerPaymentId: 'tx_1234567890',
      amount: 2400,
      currency: 'TWD',
      status: 'COMPLETED',
      processedAt: new Date(),
      metadata: {
        cardLast4: '1234',
        cardBrand: 'visa'
      }
    }
  });

  await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      userId: customer2.id,
      paymentMethod: 'BANK_TRANSFER',
      paymentProvider: 'BANK',
      providerPaymentId: 'bt_0987654321',
      amount: 1800,
      currency: 'TWD',
      status: 'COMPLETED',
      processedAt: new Date(),
      metadata: {
        bankName: '台灣銀行',
        accountLast4: '5678'
      }
    }
  });

  // 創建評價
  const review1 = await prisma.review.create({
    data: {
      bookingId: booking1.id,
      serviceId: service1.id,
      guideId: guide1.id,
      reviewerId: customer1.id,
      rating: 5,
      comment: '非常棒的文化導覽體驗！張導遊非常專業，不僅介紹了豐富的歷史知識，還帶我們品嚐了很多道地小吃。龍山寺的參拜體驗特別印象深刻，學到了很多台灣傳統文化。',
      photos: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662015628-6bcf2fc7c07c?w=400&h=300&fit=crop'
      ],
      pros: ['導遊專業熱情', '行程安排豐富', '學到很多歷史知識', '小吃很道地'],
      cons: ['天氣有點熱', '人潮較多'],
      tags: ['文化體驗', '歷史導覽', '美食'],
      isVerified: true,
      isAnonymous: false,
      helpfulCount: 8,
      reportCount: 0,
      status: 'APPROVED'
    }
  });

  console.log('數據庫種子數據生成完成！');
  console.log('創建的用戶：');
  console.log('- 管理員：admin@guidee.com / admin123');
  console.log('- 導遊1：guide1@guidee.com / password123 (張小美)');
  console.log('- 導遊2：guide2@guidee.com / password123 (李大明)');
  console.log('- 客戶1：customer1@guidee.com / password123 (王小華)');
  console.log('- 客戶2：customer2@guidee.com / password123 (陳雅婷)');
  console.log('創建的服務：3個');
  console.log('創建的預訂：2個');
  console.log('創建的評價：1個');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });