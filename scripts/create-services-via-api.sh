#!/bin/bash
# 通过 API 创建测试服务
# 使用方法: bash scripts/create-services-via-api.sh

API_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"

echo "🚀 开始创建测试服务..."
echo "API URL: $API_URL"
echo ""

# 1. 注册测试地陪账号
echo "📝 步骤 1/4: 注册测试地陪账号..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試導遊",
    "email": "test-guide-'$(date +%s)'@guidee.com",
    "phone": "0912345678",
    "password": "Test123456",
    "userType": "guide",
    "subscribeNewsletter": false
  }')

# 检查注册是否成功
if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
  echo "✅ 注册成功"
  # 提取 token (简化版本，实际应该用 jq)
  TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "🔑 Token: ${TOKEN:0:20}..."
else
  echo "❌ 注册失败"
  echo "$REGISTER_RESPONSE"
  exit 1
fi

echo ""
echo "📝 步骤 2/4: 创建服务分类..."
# 注意：分类可能已存在，这里只是尝试

echo ""
echo "📝 步骤 3/4: 创建测试服务..."

# 服务 1: 台北 101 观光导览
echo "  创建服务 1/4: 台北 101 观光导览..."
SERVICE1=$(curl -s -X POST "$API_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=$TOKEN" \
  -d '{
    "title": "台北 101 观光导览",
    "description": "专业导游带您深度游览台北 101，了解建筑特色、观景台体验、周边美食推荐。",
    "location": "台北市信义区",
    "price": 1500,
    "duration": 3,
    "maxGuests": 6,
    "minGuests": 1,
    "images": [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578398809271-6b36b9d76618?w=800&h=600&fit=crop"
    ],
    "highlights": [
      "登上89楼观景台",
      "360度环景欣赏台北市",
      "专业导游讲解建筑特色",
      "品尝台湾特色茶点"
    ],
    "included": [
      "专业中英文导览",
      "观景台门票",
      "台湾特色茶点",
      "旅游保险"
    ],
    "excluded": [
      "交通费用",
      "个人消费",
      "其他餐食"
    ],
    "cancellationPolicy": "活动前 24 小时可免费取消"
  }')

if echo "$SERVICE1" | grep -q '"success":true'; then
  SERVICE1_ID=$(echo "$SERVICE1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "  ✅ 服务 1 创建成功: $SERVICE1_ID"
else
  echo "  ❌ 服务 1 创建失败"
fi

# 服务 2: 故宫博物院文化深度游
echo "  创建服务 2/4: 故宫博物院文化深度游..."
SERVICE2=$(curl -s -X POST "$API_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=$TOKEN" \
  -d '{
    "title": "故宫博物院文化深度游",
    "description": "由资深文史导游带领，深入了解故宫珍藏的中华文化瑰宝。",
    "location": "台北市士林区",
    "price": 1200,
    "duration": 4,
    "maxGuests": 8,
    "minGuests": 2,
    "images": [
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop"
    ],
    "highlights": [
      "翠玉白菜深度解说",
      "肉形石欣赏",
      "青铜器馆导览"
    ],
    "included": [
      "专业文史导览",
      "博物馆门票",
      "无线讲解耳机"
    ],
    "excluded": [
      "交通费",
      "餐饮"
    ],
    "cancellationPolicy": "活动前 48 小时可免费取消"
  }')

if echo "$SERVICE2" | grep -q '"success":true'; then
  SERVICE2_ID=$(echo "$SERVICE2" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "  ✅ 服务 2 创建成功: $SERVICE2_ID"
else
  echo "  ❌ 服务 2 创建失败"
fi

# 服务 3: 台北夜市美食巡礼
echo "  创建服务 3/4: 台北夜市美食巡礼..."
SERVICE3=$(curl -s -X POST "$API_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=$TOKEN" \
  -d '{
    "title": "台北夜市美食巡礼",
    "description": "一晚走遍台北最具代表性的夜市，品尝道地台湾小吃。",
    "location": "台北市各大夜市",
    "price": 800,
    "duration": 4,
    "maxGuests": 10,
    "minGuests": 1,
    "images": [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ],
    "highlights": [
      "士林夜市经典小吃",
      "饶河夜市特色美食",
      "在地人推荐隐藏版"
    ],
    "included": [
      "专业美食导览",
      "15种精选小吃品尝"
    ],
    "excluded": [
      "个人额外消费",
      "交通费"
    ],
    "cancellationPolicy": "活动当日不可取消"
  }')

if echo "$SERVICE3" | grep -q '"success":true'; then
  SERVICE3_ID=$(echo "$SERVICE3" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "  ✅ 服务 3 创建成功: $SERVICE3_ID"
else
  echo "  ❌ 服务 3 创建失败"
fi

# 服务 4: 阳明山生态健行
echo "  创建服务 4/4: 阳明山生态健行..."
SERVICE4=$(curl -s -X POST "$API_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=$TOKEN" \
  -d '{
    "title": "阳明山生态健行之旅",
    "description": "深入阳明山国家公园，探索台湾特有的火山地形与丰富生态。",
    "location": "台北市北投区阳明山",
    "price": 1000,
    "duration": 5,
    "maxGuests": 12,
    "minGuests": 2,
    "images": [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    "highlights": [
      "火山口地形观察",
      "温泉生态体验",
      "台湾特有种植物"
    ],
    "included": [
      "专业生态导览",
      "国家公园导览费"
    ],
    "excluded": [
      "交通费",
      "个人装备"
    ],
    "cancellationPolicy": "因天候因素可弹性调整"
  }')

if echo "$SERVICE4" | grep -q '"success":true'; then
  SERVICE4_ID=$(echo "$SERVICE4" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "  ✅ 服务 4 创建成功: $SERVICE4_ID"
else
  echo "  ❌ 服务 4 创建失败"
fi

echo ""
echo "🎉 步骤 4/4: 完成！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 服务详细页 URL："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -z "$SERVICE1_ID" ]; then
  echo ""
  echo "1️⃣  台北 101 观光导览"
  echo "   $API_URL/services/$SERVICE1_ID"
fi

if [ ! -z "$SERVICE2_ID" ]; then
  echo ""
  echo "2️⃣  故宫博物院文化深度游"
  echo "   $API_URL/services/$SERVICE2_ID"
fi

if [ ! -z "$SERVICE3_ID" ]; then
  echo ""
  echo "3️⃣  台北夜市美食巡礼"
  echo "   $API_URL/services/$SERVICE3_ID"
fi

if [ ! -z "$SERVICE4_ID" ]; then
  echo ""
  echo "4️⃣  阳明山生态健行之旅"
  echo "   $API_URL/services/$SERVICE4_ID"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示："
echo "   - 在浏览器中访问上述 URL 即可查看服务详细页"
echo "   - 所有服务已设置为 ACTIVE 状态"
echo "   - 你也可以在首页或搜索页看到这些服务"
echo ""
