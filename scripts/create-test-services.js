const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestServices() {
  try {
    // 获取测试导游
    const guideUser = await prisma.user.findUnique({
      where: { email: 'guide@guidee.com' }
    });

    if (!guideUser) {
      console.error('❌ 请先运行 create-test-users.js 创建测试用户');
      return;
    }

    // 创建服务分类
    const categories = [
      { name: '文化导览', slug: 'culture-tour' },
      { name: '美食体验', slug: 'food-experience' },
      { name: '自然风光', slug: 'nature-tour' },
      { name: '购物指南', slug: 'shopping-guide' }
    ];

    const createdCategories = {};
    for (const category of categories) {
      const created = await prisma.serviceCategory.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
      createdCategories[category.slug] = created.id;
    }

    // 创建测试服务
    const services = [
      {
        title: '台北101 & 信义区深度导览',
        description: '带您深度探索台北最精华的信义区，从台北101观景台俯瞰整个台北盆地，漫步信义商圈感受现代都市魅力，并深入了解台湾的经济发展历程。专业导览员将为您介绍台北的历史变迁，并带您品尝道地美食。这是一趟融合文化、历史、美食与现代都市风光的完美体验之旅。',
        shortDescription: '专业地陪带您探索台北最精华的商业区，包含101观景台、信义商圈购物与在地美食体验。',
        price: 800,
        currency: 'TWD',
        durationHours: 4,
        maxGuests: 6,
        minGuests: 1,
        location: '台北市信义区',
        coordinates: '25.0330,121.5654',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1519832064-53bbda4fb58f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop'
        ],
        highlights: [
          '台北101观景台门票包含',
          '专业摄影指导服务',
          '精选在地美食推荐',
          '深度文化历史解说',
          '交通便利，捷运直达',
          '小班制精致导览'
        ],
        included: ['专业导览服务', '台北101门票', '美食推荐', '摄影指导', '交通指引'],
        notIncluded: ['个人餐食费用', '交通费', '购物费用', '小费'],
        cancellationPolicy: '免费取消，24小时前可全额退款',
        guideId: guideUser.id,
        categoryId: createdCategories['culture-tour'],
        status: 'ACTIVE'
      },
      {
        title: '夜市美食探险之旅',
        description: '跟随在地美食专家深入台北最著名的夜市，品尝道地小吃，了解台湾饮食文化的精髓。从士林夜市到饶河街夜市，我们将带您体验最正宗的台湾夜市文化，品尝臭豆腐、珍珠奶茶、小笼包等经典美食。',
        shortDescription: '跟随在地美食专家探索台北夜市，品尝道地小吃，体验台湾饮食文化。',
        price: 600,
        currency: 'TWD',
        durationHours: 3,
        maxGuests: 8,
        minGuests: 2,
        location: '台北市士林区',
        coordinates: '25.0881,121.5246',
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'
        ],
        highlights: [
          '在地美食专家带路',
          '品尝8-10种经典小吃',
          '了解台湾饮食文化',
          '夜市购物指南',
          '摄影留念服务',
          '素食选择可安排'
        ],
        included: ['专业美食导览', '小吃试吃费用', '饮品一杯', '购物建议'],
        notIncluded: ['额外餐食费用', '个人购物费用', '交通费'],
        cancellationPolicy: '12小时前免费取消',
        guideId: guideUser.id,
        categoryId: createdCategories['food-experience'],
        status: 'ACTIVE'
      },
      {
        title: '阳明山温泉秘境一日游',
        description: '远离都市喧嚣，前往阳明山国家公园探索天然温泉秘境。我们将带您走访硫磺谷、小油坑等地质奇观，体验野溪温泉的天然疗愈，并在山中享用温泉料理。这是一趟结合自然生态、温泉养生与文化体验的深度旅程。',
        shortDescription: '探索阳明山国家公园，体验天然温泉秘境，享受山中温泉料理。',
        price: 1200,
        currency: 'TWD',
        durationHours: 6,
        maxGuests: 4,
        minGuests: 2,
        location: '台北市北投区',
        coordinates: '25.1371,121.5598',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop'
        ],
        highlights: [
          '阳明山国家公园导览',
          '天然温泉体验',
          '硫磺谷地质奇观',
          '山中温泉料理',
          '生态解说服务',
          '接送服务包含'
        ],
        included: ['交通接送', '温泉入场费', '午餐', '专业生态导览', '毛巾租借'],
        notIncluded: ['个人消费', '温泉用品', '保险费用'],
        cancellationPolicy: '48小时前免费取消',
        guideId: guideUser.id,
        categoryId: createdCategories['nature-tour'],
        status: 'ACTIVE'
      }
    ];

    const createdServices = [];
    for (const service of services) {
      const created = await prisma.service.create({
        data: service
      });
      createdServices.push(created);
    }

    // TODO: 创建测试预订和评价需要更复杂的设置，暂时跳过

    console.log('✅ 测试服务创建成功！');
    console.log('🎯 已创建的服务：');
    createdServices.forEach((service, index) => {
      console.log(`  - ${service.title} (ID: ${service.id})`);
    });
    
  } catch (error) {
    console.error('❌ 创建测试服务失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestServices();