#!/usr/bin/env tsx
/**
 * 快速创建测试服务数据
 * 运行: npx tsx scripts/seed-services.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 开始创建测试服务...\n');

  try {
    // 1. 创建或获取测试地陪用户
    console.log('📝 创建测试地陪用户...');

    const hashedPassword = await bcrypt.hash('Test123456', 12);

    let guide = await prisma.user.findUnique({
      where: { email: 'test-guide@guidee.com' }
    });

    if (!guide) {
      guide = await prisma.user.create({
        data: {
          email: 'test-guide@guidee.com',
          passwordHash: hashedPassword,
          name: '測試導遊',
          phone: '0912345678',
          role: 'GUIDE',
          isEmailVerified: true,
          isKycVerified: true,
          isCriminalRecordVerified: true,
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
      console.log('✅ 创建测试导游:', guide.email);
    } else {
      console.log('✅ 使用现有导游:', guide.email);
    }

    // 创建导游档案
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: guide.id }
    });

    if (!existingProfile) {
      await prisma.userProfile.create({
        data: {
          userId: guide.id,
          bio: '专业台北导游，10年经验，热爱分享台湾文化。',
          location: '台北市',
          languages: ['中文', '英文', '日文'],
          specialties: ['历史文化', '美食导览', '自然生态'],
          experienceYears: 10,
          certifications: ['台北市导游证照', '英语导游认证']
        }
      });
      console.log('✅ 创建导游档案');
    }

    // 2. 获取或创建服务分类
    console.log('\n📂 检查服务分类...');
    let category = await prisma.serviceCategory.findFirst({
      where: { slug: 'cultural-tour' }
    });

    if (!category) {
      category = await prisma.serviceCategory.create({
        data: {
          name: '文化导览',
          slug: 'cultural-tour',
          description: '深度文化体验导览服务',
          isActive: true
        }
      });
      console.log('✅ 创建服务分类:', category.name);
    } else {
      console.log('✅ 使用现有分类:', category.name);
    }

    // 3. 创建测试服务
    console.log('\n🎯 创建测试服务...');

    const services = [
      {
        title: '台北 101 观光导览',
        description: '专业导游带您深度游览台北 101，了解建筑特色、观景台体验、周边美食推荐。包含专业讲解、观景台门票、特色茶点。适合首次来台北的游客，带您从不同角度认识这座城市地标。',
        shortDescription: '登上台北最高地标，360度欣赏城市美景',
        location: '台北市信义区',
        price: 1500,
        durationHours: 3,
        maxGuests: 6,
        minGuests: 1,
        images: [
          'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578398809271-6b36b9d76618?w=800&h=600&fit=crop'
        ],
        highlights: [
          '登上89楼观景台',
          '360度环景欣赏台北市',
          '专业导游讲解建筑特色',
          '品尝台湾特色茶点'
        ],
        included: [
          '专业中英文导览',
          '观景台门票',
          '台湾特色茶点',
          '旅游保险'
        ],
        notIncluded: [
          '交通费用',
          '个人消费',
          '其他餐食'
        ],
        cancellationPolicy: '活动前 24 小时可免费取消，24 小时内取消收取 50% 费用'
      },
      {
        title: '故宫博物院文化深度游',
        description: '由资深文史导游带领，深入了解故宫珍藏的中华文化瑰宝。精选必看展品，讲解历史背景与文物故事，让您不只是走马看花，更能深入理解每件文物背后的文化意涵。',
        shortDescription: '探索世界四大博物馆之一，了解中华文化精髓',
        location: '台北市士林区',
        price: 1200,
        durationHours: 4,
        maxGuests: 8,
        minGuests: 2,
        images: [
          'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop'
        ],
        highlights: [
          '翠玉白菜深度解说',
          '肉形石欣赏',
          '青铜器馆导览',
          '书画精品赏析'
        ],
        included: [
          '专业文史导览',
          '博物馆门票',
          '无线讲解耳机',
          '文化手册'
        ],
        notIncluded: [
          '交通费',
          '餐饮',
          '纪念品'
        ],
        cancellationPolicy: '活动前 48 小时可免费取消'
      },
      {
        title: '台北夜市美食巡礼',
        description: '一晚走遍台北最具代表性的夜市，品尝道地台湾小吃。从士林夜市到饶河夜市，体验台湾夜市文化精髓。导游精选15种必吃美食，让您一次尝遍台湾经典小吃。',
        shortDescription: '品尝道地台湾美食，体验热闹夜市文化',
        location: '台北市各大夜市',
        price: 800,
        durationHours: 4,
        maxGuests: 10,
        minGuests: 1,
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
        ],
        highlights: [
          '士林夜市经典小吃',
          '饶河夜市特色美食',
          '在地人推荐隐藏版',
          '夜市文化深度体验'
        ],
        included: [
          '专业美食导览',
          '15种精选小吃品尝',
          '夜市文化解说',
          '美食地图'
        ],
        notIncluded: [
          '个人额外消费',
          '交通费',
          '饮料费用'
        ],
        cancellationPolicy: '活动当日不可取消，活动前一日可改期一次'
      },
      {
        title: '阳明山生态健行之旅',
        description: '深入阳明山国家公园，探索台湾特有的火山地形与丰富生态。专业生态导游带您认识台湾原生植物与野生动物，观察火山地质景观，享受山林芬多精。',
        shortDescription: '亲近大自然，探索火山地形与生态奥秘',
        location: '台北市北投区阳明山',
        price: 1000,
        durationHours: 5,
        maxGuests: 12,
        minGuests: 2,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
        ],
        highlights: [
          '火山口地形观察',
          '温泉生态体验',
          '台湾特有种植物',
          '野鸟观赏'
        ],
        included: [
          '专业生态导览',
          '国家公园导览费',
          '生态观察工具',
          '健康轻食'
        ],
        notIncluded: [
          '交通费',
          '个人装备',
          '保险'
        ],
        cancellationPolicy: '因天候因素可弹性调整，活动前24小时可免费改期'
      }
    ];

    const createdServices = [];

    for (const serviceData of services) {
      const service = await prisma.service.create({
        data: {
          ...serviceData,
          guideId: guide.id,
          categoryId: category.id,
          status: 'ACTIVE'
        }
      });
      createdServices.push(service);
      console.log(`✅ 创建服务: ${service.title} (ID: ${service.id})`);
    }

    console.log('\n🎉 测试服务创建完成！\n');
    console.log('📋 创建的服务：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    createdServices.forEach((service, index) => {
      console.log(`\n${index + 1}. ${service.title}`);
      console.log(`   💰 价格: NT$ ${service.price}`);
      console.log(`   ⏱️  时长: ${service.durationHours} 小时`);
      console.log(`   📍 URL: http://localhost:3000/services/${service.id}`);
      console.log(`   🌐 生产环境: https://your-domain.vercel.app/services/${service.id}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n📧 测试账号信息：');
    console.log('   Email: test-guide@guidee.com');
    console.log('   Password: Test123456');
    console.log('   Role: GUIDE\n');

  } catch (error) {
    console.error('❌ 创建失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
