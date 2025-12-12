# 浏览器中创建测试数据

由于数据库直连限制，请在浏览器中运行以下脚本来创建测试服务和贴文。

## 使用步骤

1. **打开你的 Vercel 应用**: https://gudiee-p2yxhwrav-zoe5466s-projects.vercel.app
2. **打开浏览器开发者工具**: 按 F12 或右键 -> 检查
3. **切换到 Console（控制台）标签**
4. **复制粘贴以下完整代码并回车**

## 完整脚本代码

```javascript
// ========================================
// 创建测试数据脚本
// ========================================

const API_URL = window.location.origin;

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 注册导游账号
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
      console.log('   Password:', guideData.password);
      return {
        token: result.data.token,
        userId: result.data.user.id,
        email: guideData.email
      };
    } else {
      throw new Error(result.error || '注册失败');
    }
  } catch (error) {
    console.error('❌ 导游注册失败:', error.message);
    throw error;
  }
}

// 注册普通用户
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
      console.log('   Password:', userData.password);
      return {
        token: result.data.token,
        userId: result.data.user.id,
        email: userData.email
      };
    } else {
      throw new Error(result.error || '注册失败');
    }
  } catch (error) {
    console.error('❌ 用户注册失败:', error.message);
    throw error;
  }
}

// 创建服务
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
      console.log(`  ✅ 服务: ${serviceData.title}`);
      return result.data;
    } else {
      console.error(`  ❌ 失败: ${serviceData.title}`, result.error);
      return null;
    }
  } catch (error) {
    console.error(`  ❌ 失败: ${serviceData.title}`, error.message);
    return null;
  }
}

// 创建贴文
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
      console.log(`  ✅ 贴文: ${postData.title}`);
      return result.data;
    } else {
      console.error(`  ❌ 失败: ${postData.title}`, result.error);
      return null;
    }
  } catch (error) {
    console.error(`  ❌ 失败: ${postData.title}`, error.message);
    return null;
  }
}

// 主函数
async function createTestData() {
  console.log('🚀 开始创建测试数据...\\n');

  try {
    // 1. 注册账号
    const guide = await registerGuide();
    await delay(500);

    const user = await registerUser();
    await delay(500);

    console.log('\\n🎯 创建测试服务...\\n');

    // 2. 创建服务
    const services = [
      {
        title: '台北 101 观光导览',
        description: '专业导游带您深度游览台北 101，了解建筑特色、观景台体验、周边美食推荐。',
        location: '台北市信义区',
        price: 1500,
        duration: 3,
        maxGuests: 6,
        minGuests: 1,
        images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop'],
        highlights: ['登上89楼观景台', '360度环景欣赏台北市'],
        included: ['专业导览', '观景台门票'],
        excluded: ['交通费用'],
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
        highlights: ['士林夜市小吃', '饶河夜市美食'],
        included: ['专业导览', '15种小吃'],
        excluded: ['交通费'],
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
        highlights: ['翠玉白菜解说', '青铜器导览'],
        included: ['专业导览', '博物馆门票'],
        excluded: ['交通费'],
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
        highlights: ['火山地形', '温泉生态'],
        included: ['生态导览', '导览费'],
        excluded: ['交通费'],
        cancellationPolicy: '因天候可调整'
      }
    ];

    const createdServices = [];
    for (const service of services) {
      const created = await createService(guide.token, service);
      if (created) createdServices.push(created);
      await delay(500);
    }

    console.log('\\n📝 创建测试贴文...\\n');

    // 3. 创建贴文
    const posts = [
      {
        title: '台北三日游攻略 - 新手必看！',
        content: '分享我在台北三天的行程安排，包含必去景点、美食推荐和省钱小技巧。第一天去了台北 101 和象山步道，景色超美！第二天逛了故宫博物院和士林夜市，文化与美食兼得。第三天到阳明山健行，呼吸新鲜空气。',
        images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop'],
        tags: ['台北', '旅游攻略', '三日游'],
        authorType: 'customer'
      },
      {
        title: '导游经验分享：如何成为优秀的地陪',
        content: '从事导游工作五年的经验分享。最重要的是要有耐心和热情，了解当地文化历史，能够用生动的方式讲解。记得随时保持微笑，这是最好的服务态度！',
        images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'],
        tags: ['导游', '经验分享', '职业发展'],
        authorType: 'guide'
      },
      {
        title: '夜市美食大搜罗！10 个必吃小吃推荐',
        content: '台湾夜市是一定要体验的！这里整理了我最爱的 10 种小吃：大肠包小肠、蚵仔煎、臭豆腐、珍珠奶茶、盐酥鸡、卤肉饭、刈包、鸡排、车轮饼、芒果冰。每一样都超好吃！',
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
    console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\\n🎉 创建完成！\\n`);
    console.log(`✅ 服务: ${createdServices.length} 个`);
    console.log(`✅ 贴文: ${createdPosts.length} 个\\n`);

    console.log('📧 测试账号:\\n');
    console.log(`导游: ${guide.email} / Test123456`);
    console.log(`用户: ${user.email} / Test123456\\n`);

    if (createdServices.length > 0) {
      console.log('📋 服务链接:');
      createdServices.forEach((s, i) => {
        console.log(`${i + 1}. ${API_URL}/services/${s.id}`);
      });
    }

    console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n');

    return { guide, user, services: createdServices, posts: createdPosts };

  } catch (error) {
    console.error('\\n❌ 错误:', error.message);
    throw error;
  }
}

// 运行
createTestData().then(result => {
  console.log('✅ 全部完成！可以在首页查看新创建的服务和贴文');
}).catch(error => {
  console.error('❌ 创建失败:', error);
});
```

## 执行后你会看到：

1. 创建了 1 个导游账号和 1 个用户账号
2. 创建了 4 个服务（台北 101、夜市美食、故宫、阳明山）
3. 创建了 4 个贴文
4. 显示所有服务的详细页链接

## 验证数据是否创建成功

执行完脚本后，访问：

- **首页**: https://gudiee-p2yxhwrav-zoe5466s-projects.vercel.app/
  - 应该能看到新创建的服务卡片

- **社区页**: https://gudiee-p2yxhwrav-zoe5466s-projects.vercel.app/community
  - 应该能看到新创建的贴文

- **服务详细页**: 点击控制台中显示的服务链接

## 如果遇到错误

### "fetch failed" 或 CORS 错误
- 确保你在应用的同一域名下执行脚本（不是 localhost）

### "註冊失敗"
- 可能是数据库连接问题，需要检查 Vercel 环境变量
- 或者邮箱已被使用，刷新页面重新运行脚本会生成新的时间戳邮箱

### "只有導遊可以建立服務"
- 确保使用导游账号的 token 创建服务

## 快速重新创建

如果需要重新创建数据，只需：
1. 刷新页面
2. 重新粘贴并运行脚本
3. 每次运行都会创建新的账号（带时间戳）

---

💡 **提示**: 脚本会自动保存账号信息到控制台，复制保存以便后续登录测试。
