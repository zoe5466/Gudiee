#!/usr/bin/env tsx
/**
 * 创建测试服务并输出详细页 URL
 * 运行: npx tsx scripts/create-test-service.ts
 */

async function createTestService() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  console.log('🚀 正在创建测试服务...\n');

  // 测试服务数据
  const serviceData = {
    title: '台北 101 观光导览',
    description: '专业导游带您深度游览台北 101，了解建筑特色、观景台体验、周边美食推荐。包含：专业讲解、观景台门票、特色茶点。',
    location: '台北市信义区',
    price: 1500,
    duration: 3,
    maxGuests: 6,
    minGuests: 1,
    category: '观光导览',
    images: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578398809271-6b36b9d76618?w=800&h=600&fit=crop'
    ],
    highlights: [
      '登上台北最高观景台',
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
    excluded: [
      '交通费用',
      '个人消费',
      '其他餐食'
    ],
    cancellationPolicy: '活动前 24 小时可免费取消，24 小时内取消收取 50% 费用'
  };

  console.log('📋 服务信息:');
  console.log(`   标题: ${serviceData.title}`);
  console.log(`   地点: ${serviceData.location}`);
  console.log(`   价格: NT$ ${serviceData.price}`);
  console.log(`   时长: ${serviceData.duration} 小时`);
  console.log(`   人数: ${serviceData.minGuests}-${serviceData.maxGuests} 人\n`);

  try {
    // 提示：你需要先创建一个 GUIDE 用户并获取 token
    console.log('⚠️  注意：此脚本需要你先完成以下步骤:\n');
    console.log('1. 访问网站并注册一个地陪账号:');
    console.log(`   ${baseUrl}/auth/register?type=guide\n`);
    console.log('2. 登录后，打开浏览器开发者工具 (F12)');
    console.log('3. 在 Application > Cookies 中找到 "auth-token"');
    console.log('4. 复制 token 值\n');
    console.log('5. 使用以下命令创建服务:');
    console.log('   (将 YOUR_TOKEN 替换为实际的 token)\n');
    console.log(`curl -X POST ${baseUrl}/api/services \\
  -H "Content-Type: application/json" \\
  -H "Cookie: auth-token=YOUR_TOKEN" \\
  -d '${JSON.stringify(serviceData, null, 2)}'
`);
    console.log('\n✅ 创建成功后，API 会返回服务 ID');
    console.log('   然后访问: ${baseUrl}/services/[返回的ID]');

  } catch (error) {
    console.error('❌ 创建失败:', error);
  }
}

createTestService();
