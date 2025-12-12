#!/usr/bin/env node
/**
 * 通过 API 创建测试数据（服务和贴文）
 * 运行: node scripts/seed-via-api.js
 */

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. 注册导游账号
async function registerGuide() {
  console.log('📝 注册测试导游账号...');

  const timestamp = Date.now();
  const guideData = {
    name: '測試導遊',
    email: `test-guide-${timestamp}@guidee.com`,
    phone: '0912345678',
    password: 'Test123456',
    userType: 'guide',
    subscribeNewsletter: false
  };

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guideData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ 导游注册成功:', guideData.email);
      return { token: result.data.token, userId: result.data.user.id };
    } else {
      throw new Error(result.error || '注册失败');
    }
  } catch (error) {
    console.error('❌ 导游注册失败:', error.message);
    throw error;
  }
}

// 2. 注册普通用户（用于发帖）
async function registerUser() {
  console.log('📝 注册测试用户账号...');

  const timestamp = Date.now();
  const userData = {
    name: '測試用戶',
    email: `test-user-${timestamp}@guidee.com`,
    phone: '0923456789',
    password: 'Test123456',
    userType: 'customer',
    subscribeNewsletter: false
  };

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ 用户注册成功:', userData.email);
      return { token: result.data.token, userId: result.data.user.id };
    } else {
      throw new Error(result.error || '注册失败');
    }
  } catch (error) {
    console.error('❌ 用户注册失败:', error.message);
    throw error;
  }
}

// 3. 创建服务
async function createService(token, serviceData) {
  try {
    const response = await fetch(`${API_URL}/api/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth-token=${token}`
      },
      body: JSON.stringify(serviceData)
    });

    const result = await response.json();

    if (result.success) {
      console.log(`  ✅ 服务创建成功: ${serviceData.title}`);
      return result.data;
    } else {
      console.error(`  ❌ 服务创建失败: ${serviceData.title}`, result.error);
      return null;
    }
  } catch (error) {
    console.error(`  ❌ 服务创建失败: ${serviceData.title}`, error.message);
    return null;
  }
}

// 4. 创建贴文
async function createPost(token, postData) {
  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth-token=${token}`
      },
      body: JSON.stringify(postData)
    });

    const result = await response.json();

    if (result.success) {
      console.log(`  ✅ 贴文创建成功: ${postData.title}`);
      return result.data;
    } else {
      console.error(`  ❌ 贴文创建失败: ${postData.title}`, result.error);
      return null;
    }
  } catch (error) {
    console.error(`  ❌ 贴文创建失败: ${postData.title}`, error.message);
    return null;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始创建测试数据...\n');
  console.log(`API URL: ${API_URL}\n`);

  try {
    // 1. 注册导游
    const guide = await registerGuide();
    await delay(500);

    // 2. 注册用户
    const user = await registerUser();
    await delay(500);

    console.log('\n🎯 创建测试服务...\n');

    // 3. 创建服务
    const services = [
      {
        title: '台北 101 观光导览',
        description: '专业导游带您深度游览台北 101，了解建筑特色、观景台体验、周边美食推荐。包含专业讲解、观景台门票、特色茶点。',
        location: '台北市信义区',
        price: 1500,
        duration: 3,
        maxGuests: 6,
        minGuests: 1,
        images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop'],
        highlights: ['登上89楼观景台', '360度环景欣赏台北市', '专业导游讲解建筑特色'],
        included: ['专业中英文导览', '观景台门票', '台湾特色茶点'],
        excluded: ['交通费用', '个人消费'],
        cancellationPolicy: '活动前 24 小时可免费取消'
      },
      {
        title: '台北夜市美食巡礼',
        description: '一晚走遍台北最具代表性的夜市，品尝道地台湾小吃。',
        location: '台北市各大夜市',
        price: 800,
        duration: 4,
        maxGuests: 10,
        minGuests: 1,
        images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
        highlights: ['士林夜市经典小吃', '饶河夜市特色美食'],
        included: ['专业美食导览', '15种精选小吃品尝'],
        excluded: ['个人额外消费', '交通费'],
        cancellationPolicy: '活动当日不可取消'
      },
      {
        title: '故宫博物院文化深度游',
        description: '由资深文史导游带领，深入了解故宫珍藏的中华文化瑰宝。',
        location: '台北市士林区',
        price: 1200,
        duration: 4,
        maxGuests: 8,
        minGuests: 2,
        images: ['https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop'],
        highlights: ['翠玉白菜深度解说', '肉形石欣赏', '青铜器馆导览'],
        included: ['专业文史导览', '博物馆门票'],
        excluded: ['交通费', '餐饮'],
        cancellationPolicy: '活动前 48 小时可免费取消'
      },
      {
        title: '阳明山生态健行之旅',
        description: '深入阳明山国家公园，探索台湾特有的火山地形与丰富生态。',
        location: '台北市北投区阳明山',
        price: 1000,
        duration: 5,
        maxGuests: 12,
        minGuests: 2,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
        highlights: ['火山口地形观察', '温泉生态体验', '台湾特有种植物'],
        included: ['专业生态导览', '国家公园导览费'],
        excluded: ['交通费', '个人装备'],
        cancellationPolicy: '因天候因素可弹性调整'
      }
    ];

    const createdServices = [];
    for (const service of services) {
      const created = await createService(guide.token, service);
      if (created) createdServices.push(created);
      await delay(500);
    }

    console.log('\n📝 创建测试贴文...\n');

    // 4. 创建贴文
    const posts = [
      {
        title: '台北三日游攻略 - 新手必看！',
        content: '分享我在台北三天的行程安排，包含必去景点、美食推荐和省钱小技巧。第一天去了台北 101 和象山步道，景色超美！第二天逛了故宫博物院和士林夜市，文化与美食兼得。第三天到阳明山健行，呼吸新鲜空气。强烈推荐大家也这样安排！',
        images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop'],
        tags: ['台北', '旅游攻略', '三日游'],
        authorType: 'customer'
      },
      {
        title: '导游经验分享：如何成为优秀的地陪',
        content: '从事导游工作五年的经验分享。最重要的是要有耐心和热情，了解当地文化历史，能够用生动的方式讲解。此外，还要注意游客的需求，灵活调整行程。记得随时保持微笑，这是最好的服务态度！',
        images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'],
        tags: ['导游', '经验分享', '职业发展'],
        authorType: 'guide'
      },
      {
        title: '夜市美食大搜罗！10 个必吃小吃推荐',
        content: '台湾夜市是一定要体验的！这里整理了我最爱的 10 种小吃：1. 大肠包小肠 2. 蚵仔煎 3. 臭豆腐 4. 珍珠奶茶 5. 盐酥鸡 6. 卤肉饭 7. 刈包 8. 鸡排 9. 车轮饼 10. 芒果冰。每一样都超好吃，来台湾一定要试试！',
        images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
        tags: ['美食', '夜市', '小吃'],
        authorType: 'customer'
      },
      {
        title: '淡水老街一日游心得',
        content: '周末去了淡水老街，真的很美！沿着河边散步，看着夕阳西下，非常浪漫。推荐大家可以租自行车骑到渔人码头，路上风景很好。晚上在老街吃阿给和鱼丸汤，超满足！',
        images: ['https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop'],
        tags: ['淡水', '老街', '一日游'],
        authorType: 'customer'
      },
      {
        title: '雨天台北也精彩 - 室内景点推荐',
        content: '台北下雨天不用担心！有很多室内景点可以去：故宫博物院、诚品书店、各大百货公司、台北当代艺术馆、猫空缆车（有遮蔽）。我最喜欢在雨天去诚品喝咖啡看书，超放松的！',
        images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop'],
        tags: ['台北', '雨天', '室内景点'],
        authorType: 'customer'
      }
    ];

    const createdPosts = [];
    for (const post of posts) {
      const token = post.authorType === 'guide' ? guide.token : user.token;
      const created = await createPost(token, post);
      if (created) createdPosts.push(created);
      await delay(500);
    }

    // 总结
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n🎉 创建完成！\n`);
    console.log(`✅ 服务数量: ${createdServices.length} 个`);
    console.log(`✅ 贴文数量: ${createdPosts.length} 个\n`);

    if (createdServices.length > 0) {
      console.log('📋 服务列表:');
      createdServices.forEach((service, i) => {
        console.log(`${i + 1}. ${service.title}`);
        console.log(`   💰 NT$ ${service.price} | ⏱️  ${service.duration || service.durationHours} 小时`);
        console.log(`   🔗 ${API_URL}/services/${service.id}`);
      });
    }

    if (createdPosts.length > 0) {
      console.log('\n📝 贴文列表:');
      createdPosts.forEach((post, i) => {
        console.log(`${i + 1}. ${post.title}`);
        console.log(`   👤 作者: ${post.authorType === 'guide' ? '导游' : '用户'}`);
        console.log(`   🔗 ${API_URL}/community/${post.id}`);
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📧 测试账号信息:\n');
    console.log('导游账号:');
    console.log(`  Email: ${guide.email || 'test-guide-xxx@guidee.com'}`);
    console.log(`  Password: Test123456\n`);
    console.log('用户账号:');
    console.log(`  Email: ${user.email || 'test-user-xxx@guidee.com'}`);
    console.log(`  Password: Test123456\n`);

  } catch (error) {
    console.error('\n❌ 创建失败:', error.message);
    process.exit(1);
  }
}

main();
