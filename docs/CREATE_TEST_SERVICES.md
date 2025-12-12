# 创建测试服务指南

由于数据库连接限制，这里提供几种创建测试服务的方法：

## 🚀 方法 1：通过 UI 创建（最简单推荐）

### 步骤：

1. **访问你的网站并注册地陪账号**
   ```
   https://your-domain.vercel.app/auth/register?type=guide
   ```

   填写信息：
   - 姓名：测试导游
   - Email: test-guide@example.com
   - 手机：0912345678
   - 密码：Test123456
   - 选择：**成为地陪** 🗺️

2. **登录后访问服务创建页面**
   ```
   https://your-domain.vercel.app/guide/services/create
   ```

3. **填写服务信息**（可以复制下面的示例）：

#### 示例服务 1：台北 101 观光导览

```
标题：台北 101 观光导览
描述：专业导游带您深度游览台北 101，了解建筑特色、观景台体验、周边美食推荐。包含专业讲解、观景台门票、特色茶点。
地点：台北市信义区
价格：1500
时长：3（小时）
最大人数：6
最小人数：1

亮点（Highlights）：
- 登上89楼观景台
- 360度环景欣赏台北市
- 专业导游讲解建筑特色
- 品尝台湾特色茶点

包含项目（Included）：
- 专业中英文导览
- 观景台门票
- 台湾特色茶点
- 旅游保险

不包含项目（Excluded）：
- 交通费用
- 个人消费
- 其他餐食

取消政策：活动前 24 小时可免费取消，24 小时内取消收取 50% 费用

图片URL（可选）：
https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop
```

#### 示例服务 2：台北夜市美食巡礼

```
标题：台北夜市美食巡礼
描述：一晚走遍台北最具代表性的夜市，品尝道地台湾小吃。从士林夜市到饶河夜市，体验台湾夜市文化精髓。
地点：台北市各大夜市
价格：800
时长：4
最大人数：10
最小人数：1

亮点：
- 士林夜市经典小吃
- 饶河夜市特色美食
- 在地人推荐隐藏版美食
- 夜市文化深度体验

包含项目：
- 专业美食导览
- 15种精选小吃品尝
- 夜市文化解说
- 美食地图

不包含项目：
- 个人额外消费
- 交通费
- 饮料费用

取消政策：活动当日不可取消，活动前一日可改期一次

图片URL：
https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop
```

4. **点击"发布服务"**

5. **获取服务详细页 URL**
   - 创建成功后会跳转到导游服务列表页
   - 点击任一服务的"预览"按钮
   - 复制浏览器地址栏的 URL
   - URL 格式：`https://your-domain.vercel.app/services/[服务ID]`

---

## 📱 方法 2：使用浏览器控制台创建

如果你已经在 Vercel 部署了网站，可以使用这个方法快速创建多个测试服务。

### 步骤：

1. **先注册并登录地陪账号**（参考方法 1 的步骤 1）

2. **打开浏览器开发者工具** (F12 或右键 -> 检查)

3. **切换到 Console（控制台）标签**

4. **复制粘贴以下代码并回车**：

```javascript
// 创建测试服务的函数
async function createTestServices() {
  const services = [
    {
      title: "台北 101 观光导览",
      description: "专业导游带您深度游览台北 101，了解建筑特色、观景台体验、周边美食推荐。",
      location: "台北市信义区",
      price: 1500,
      duration: 3,
      maxGuests: 6,
      minGuests: 1,
      images: ["https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop"],
      highlights: ["登上89楼观景台", "360度环景欣赏台北市", "专业导游讲解建筑特色"],
      included: ["专业中英文导览", "观景台门票", "台湾特色茶点"],
      excluded: ["交通费用", "个人消费"],
      cancellationPolicy: "活动前 24 小时可免费取消"
    },
    {
      title: "台北夜市美食巡礼",
      description: "一晚走遍台北最具代表性的夜市，品尝道地台湾小吃。",
      location: "台北市各大夜市",
      price: 800,
      duration: 4,
      maxGuests: 10,
      minGuests: 1,
      images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"],
      highlights: ["士林夜市经典小吃", "饶河夜市特色美食"],
      included: ["专业美食导览", "15种精选小吃品尝"],
      excluded: ["个人额外消费", "交通费"],
      cancellationPolicy: "活动当日不可取消"
    },
    {
      title: "故宫博物院文化深度游",
      description: "由资深文史导游带领，深入了解故宫珍藏的中华文化瑰宝。",
      location: "台北市士林区",
      price: 1200,
      duration: 4,
      maxGuests: 8,
      minGuests: 2,
      images: ["https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop"],
      highlights: ["翠玉白菜深度解说", "肉形石欣赏", "青铜器馆导览"],
      included: ["专业文史导览", "博物馆门票"],
      excluded: ["交通费", "餐饮"],
      cancellationPolicy: "活动前 48 小时可免费取消"
    }
  ];

  console.log('🚀 开始创建测试服务...\n');
  const createdServices = [];

  for (const service of services) {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });

      const result = await response.json();

      if (result.success) {
        createdServices.push(result.data);
        console.log(`✅ 创建成功: ${service.title}`);
        console.log(`   URL: ${window.location.origin}/services/${result.data.id}\n`);
      } else {
        console.error(`❌ 创建失败: ${service.title}`, result.error);
      }
    } catch (error) {
      console.error(`❌ 创建失败: ${service.title}`, error);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n🎉 完成！共创建 ${createdServices.length} 个服务\n`);
  console.log('📋 服务详细页链接：');
  createdServices.forEach((service, i) => {
    console.log(`${i + 1}. ${service.title}`);
    console.log(`   ${window.location.origin}/services/${service.id}\n`);
  });

  return createdServices;
}

// 运行创建函数
createTestServices();
```

5. **等待执行完成**，控制台会显示所有创建的服务 URL

---

## 🔧 方法 3：使用 curl 命令（需要本地运行）

如果你的应用在本地运行（`npm run dev`），可以使用这个脚本：

```bash
# 给脚本添加执行权限
chmod +x scripts/create-services-via-api.sh

# 运行脚本
bash scripts/create-services-via-api.sh
```

---

## ✅ 验证服务是否创建成功

创建服务后，你可以通过以下方式验证：

1. **访问首页**
   ```
   https://your-domain.vercel.app/
   ```
   应该能看到服务卡片

2. **访问导游服务管理页**
   ```
   https://your-domain.vercel.app/guide/services
   ```
   能看到你创建的所有服务

3. **直接访问服务详细页**
   ```
   https://your-domain.vercel.app/services/[服务ID]
   ```

4. **在搜索页查找**
   ```
   https://your-domain.vercel.app/search
   ```

---

## 📝 常见问题

### Q: 创建服务时提示"只有导游可以建立服务"？
A: 确保你注册的是地陪账号（userType: 'guide'），不是普通用户账号。

### Q: 无法访问服务详细页？
A: 检查：
1. 服务是否创建成功（状态为 ACTIVE）
2. URL 中的服务 ID 是否正确
3. 浏览器控制台是否有错误信息

### Q: 服务列表为空？
A: 可能原因：
1. 服务尚未创建
2. 服务状态不是 ACTIVE
3. API 返回了错误（查看浏览器控制台）

---

## 🎯 推荐流程

1. 使用**方法 1（UI 创建）**创建第一个服务，熟悉流程
2. 如果需要批量创建，使用**方法 2（浏览器控制台）**
3. 验证服务详细页是否正常显示
4. 测试预订流程

---

需要帮助？查看项目文档或联系开发团队。
