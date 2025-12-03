# API Routes Maintenance Guide

## 重要规则：所有使用 Prisma 的 API 路由必须有 `export const dynamic = 'force-dynamic'`

### 为什么需要这个？

Next.js 14+ 默认尝试在构建时静态生成所有路由。但是，与数据库交互的 API 路由需要在请求时动态执行。

如果 API 路由使用 Prisma 但没有 `export const dynamic = 'force-dynamic'`：
- ❌ 构建时会失败：`Can't reach database server at host:5432`
- ❌ 无法进行静态生成
- ❌ Vercel 部署出错

**解决方案：** 在所有使用数据库的 API 路由顶部添加：
```typescript
export const dynamic = 'force-dynamic'
```

---

## API 路由分类

### 1. 认证路由 ✅
**位置：** `/src/app/api/auth/*`

需要 `export const dynamic = 'force-dynamic'` 的文件：
- `login/route.ts` - 用户登入
- `register/route.ts` - 用户注册
- `admin/login/route.ts` - 管理员登入
- `refresh/route.ts` - 刷新令牌
- `logout/route.ts` - 用户登出
- `me/route.ts` - 当前用户信息

**不需要的文件：**
- `logout/route.ts` - 如果只清除 cookies，不查询数据库

---

### 2. 帖子相关 ✅
**位置：** `/src/app/api/posts/*`

**父路由** (`posts/route.ts`)
```typescript
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // 获取帖子列表
  const posts = await prisma.post.findMany(...)
}

export async function POST(request: NextRequest) {
  // 创建新帖子
  const post = await prisma.post.create(...)
}
```

**详情路由** (`[id]/route.ts`)
- GET：获取单个帖子
- PUT/PATCH：更新帖子
- DELETE：删除帖子

**评论路由** (`[id]/comments/route.ts`)
- GET：获取评论列表
- POST：添加新评论

**点赞路由** (`[id]/likes/route.ts`)
- POST：点赞或取消点赞

**嵌入商品路由** (`[id]/embed-service/route.ts`)
- GET：获取嵌入的商品
- POST：添加嵌入的商品
- DELETE：删除嵌入的商品

---

### 3. 管理员路由 ✅
**位置：** `/src/app/api/admin/*`

所有管理员 API 都需要数据库访问，必须有 `export const dynamic = 'force-dynamic'`

#### 仪表板
- `dashboard/route.ts` - 获取统计数据

#### 用户管理
- `users/route.ts` - 列出所有用户
- `users/[id]/route.ts` - 用户详情和更新

#### 导遊管理
- `guides/route.ts` - 列出导遊
- `services/route.ts` - 管理服务
- `services/[id]/route.ts` - 服务详情

#### 内容审核
- `bookings/route.ts` - 预订列表
- `bookings/[id]/route.ts` - 预订详情
- `notifications/route.ts` - 通知管理
- `activity/route.ts` - 活动日志

#### KYC 审核
- `kyc/submissions/route.ts` - KYC 申请列表
- `kyc/submissions/[id]/review/route.ts` - 审核 KYC

#### 聊天管理
- `chat/route.ts` - 聊天管理
- `chat/[id]/route.ts` - 聊天详情
- `chat/seed/route.ts` - 测试数据生成

---

### 4. 预订相关 ✅
**位置：** `/src/app/api/bookings/*`

```typescript
export const dynamic = 'force-dynamic'

// 列表
GET /api/bookings
POST /api/bookings

// 详情
GET /api/bookings/[id]
PATCH /api/bookings/[id]

// 操作
POST /api/bookings/[id]/confirm
POST /api/bookings/[id]/cancel
POST /api/bookings/[id]/review

// 支付
POST /api/bookings/payment
```

---

### 5. 服务相关 ✅
**位置：** `/src/app/api/services/*`

```typescript
export const dynamic = 'force-dynamic'

// 列表和搜索
GET /api/services
GET /api/services/search?q=keyword
GET /api/services/suggestions

// 详情
GET /api/services/[id]
POST /api/services/[id]

// 列表操作
POST /api/services
```

---

### 6. 用户资料 ✅
**位置：** `/src/app/api/user/*` 和 `/api/users/*`

```typescript
export const dynamic = 'force-dynamic'

GET /api/user/profile
PUT /api/user/profile

GET /api/users/profile/[id]
```

---

### 7. 对话和消息 ✅
**位置：** `/src/app/api/conversations/*`

```typescript
export const dynamic = 'force-dynamic'

GET /api/conversations
POST /api/conversations

GET /api/conversations/[id]
POST /api/conversations/[id]/messages

GET /api/conversations/[id]/messages
```

---

### 8. 评论和评价 ✅
**位置：** `/src/app/api/reviews/*`

```typescript
export const dynamic = 'force-dynamic'

GET /api/reviews
POST /api/reviews

GET /api/reviews/[id]
PUT /api/reviews/[id]
DELETE /api/reviews/[id]

POST /api/reviews/[id]/helpful
POST /api/reviews/[id]/responses
```

---

### 9. 订单相关 ✅
**位置：** `/src/app/api/orders/*`

```typescript
export const dynamic = 'force-dynamic'

GET /api/orders
POST /api/orders

GET /api/orders/[id]
POST /api/orders/[id]/payment
```

---

### 10. KYC 相关 ✅
**位置：** `/src/app/api/kyc/*`

```typescript
export const dynamic = 'force-dynamic'

POST /api/kyc/submit
```

---

### 11. 设置相关 ✅
**位置：** `/src/app/api/settings/*`

```typescript
export const dynamic = 'force-dynamic'

GET /api/settings
PUT /api/settings

GET /api/settings/payment-methods
POST /api/settings/payment-methods

GET /api/settings/transactions
```

---

### 12. 任务相关 ✅
**位置：** `/src/app/api/tasks/*`

```typescript
export const dynamic = 'force-dynamic'

GET /api/tasks
POST /api/tasks

GET /api/tasks/[id]

POST /api/tasks/[id]/apply
POST /api/tasks/[id]/assign
```

---

### 13. 通知相关 ✅
**位置：** `/src/app/api/notifications/*`

```typescript
export const dynamic = 'force-dynamic'

POST /api/notifications/subscribe
POST /api/notifications/unsubscribe
POST /api/notifications/send
```

---

## 不需要 `export const dynamic = 'force-dynamic'` 的路由

❌ **静态内容路由** (不使用数据库)
```typescript
// 如：/api/health/route.ts
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
```

❌ **仅操作 Cookies/Headers 的路由** (不查询数据库)
```typescript
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set('auth', 'token')
  return response
}
```

❌ **调用外部 API 的路由** (如果不查询本地数据库)
```typescript
export async function GET() {
  const response = await fetch('https://api.example.com/...')
  return response
}
```

---

## 检查清单：添加新 API 路由

当你创建新的 API 路由时，遵循这个检查清单：

- [ ] 路由是否使用 `prisma` 查询数据库？
  - ✅ **是** → 添加 `export const dynamic = 'force-dynamic'`
  - ❌ **否** → 不需要

- [ ] 路由是否在 `src/app/api/` 目录下？
  - ✅ **是** → 继续
  - ❌ **否** → 不适用

- [ ] 你有正确的错误处理吗？
  ```typescript
  try {
    const data = await prisma.table.findMany(...)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
  ```

- [ ] 你的路由是否需要认证检查？
  ```typescript
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  ```

---

## 完整例子：标准 CRUD 路由

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 强制动态渲染 - 这是必须的！
export const dynamic = 'force-dynamic'

// 获取列表
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.table.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// 创建项目
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const item = await prisma.table.create({
      data: {
        ...body,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## 常见问题

### Q: 如果我忘记添加 `export const dynamic = 'force-dynamic'` 会怎样？
**A:** 构建时会失败，错误信息为：`Can't reach database server at host:5432`

### Q: 为什么 Vercel 部署失败？
**A:** Vercel 在构建时尝试预生成所有路由。如果 API 路由没有 `export const dynamic = 'force-dynamic'`，它会尝试在构建服务器上执行，而该服务器无法访问你的数据库。

### Q: 这个设置会影响性能吗？
**A:** 不会。这只是告诉 Next.js 如何渲染路由，不会影响运行时性能。

### Q: 我可以对所有 API 路由都使用 `export const dynamic = 'force-dynamic'` 吗？
**A:** 可以，这是安全的。但对于不使用数据库的简单路由（如健康检查），不是必需的。

---

## 相关文档

- [Next.js Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/dynamic-rendering)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma ORM Documentation](https://www.prisma.io/docs/)

---

**最后更新：** 2024-12-03
**维护者：** Guidee Team
