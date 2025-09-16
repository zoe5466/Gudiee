# Guidee 部署指南

## 重要提醒
❌ **請勿使用 GitHub Pages** - Guidee 是 Next.js 全端應用，需要伺服器環境
✅ **推薦使用以下平台** - 支援 Node.js 和資料庫連接

---

## 推薦部署平台

### 1. **Vercel** (最推薦)
🎯 **Next.js 官方平台，零配置部署**

#### 快速部署步驟：
```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 在專案根目錄執行
vercel

# 3. 按照提示操作：
# - 選擇帳戶
# - 確認專案名稱
# - 選擇框架 (Next.js)
# - 確認設定
```

#### Vercel 環境變數設定：
1. 前往 Vercel Dashboard
2. 選擇你的專案
3. 進入 Settings > Environment Variables
4. 添加以下變數：

```bash
# 必要變數
DATABASE_URL=postgresql://username:password@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app

# 第三方服務 (選填)
STRIPE_SECRET_KEY=sk_...
GOOGLE_MAPS_API_KEY=AIza...
```

---

### 2. **Railway** (簡單易用)
🚂 **自動檢測框架，內建資料庫**

#### 部署步驟：
1. 前往 [railway.app](https://railway.app)
2. 點擊 "Start a New Project"
3. 選擇 "Deploy from GitHub repo"
4. 授權並選擇 `Guidee` repository
5. Railway 自動檢測 Next.js 並開始部署

#### Railway 資料庫設定：
```bash
# Railway 提供免費 PostgreSQL
# 1. 在 Railway 專案中點 "Add Plugin"
# 2. 選擇 "PostgreSQL"
# 3. 複製 DATABASE_URL 到環境變數
```

---

### 3. **Render** (免費方案友好)
🌟 **免費 SSL，自動擴展**

#### 部署步驟：
1. 前往 [render.com](https://render.com)
2. 點擊 "New +" > "Web Service"
3. 連接 GitHub 並選擇 Guidee repository
4. 配置設定：
   - **Name**: guidee-app
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

---

## 環境變數完整清單

### 必要變數 (所有平台都需要)
```bash
# 資料庫連接
DATABASE_URL="postgresql://user:pass@host:5432/guidee_db"

# JWT 認證
JWT_SECRET="your-super-long-secret-key-here"
NEXTAUTH_SECRET="another-secret-for-nextauth"
NEXTAUTH_URL="https://your-domain.com"

# 應用程式設定
NODE_ENV="production"
APP_URL="https://your-domain.com"
```

### 選填變數 (依需求添加)
```bash
# 支付系統
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# 地圖服務
GOOGLE_MAPS_API_KEY="AIza..."

# 郵件服務
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# 檔案存儲
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="guidee-storage"
AWS_REGION="ap-northeast-1"

# 快取服務 (選填)
REDIS_URL="redis://localhost:6379"
```

---

## 資料庫部署選項

### 1. **Railway PostgreSQL** (推薦 - 新手)
- 免費 500MB
- 自動備份
- 一鍵設置

### 2. **PlanetScale** (推薦 - MySQL)
- 免費 5GB
- 分支功能
- 無伺服器架構

### 3. **Supabase** (推薦 - PostgreSQL)
- 免費 500MB
- 內建認證
- 即時功能

### 4. **Neon** (PostgreSQL)
- 免費 3GB
- 分支功能
- 自動擴展

---

## 部署後檢查清單

### ✅ 基本功能測試
- [ ] 網站可以正常訪問
- [ ] 健康檢查：`https://your-domain.com/api/health`
- [ ] 首頁載入正常
- [ ] 靜態資源 (圖片、CSS) 正常載入

### ✅ API 功能測試
- [ ] 用戶註冊/登入
- [ ] 服務搜尋
- [ ] 預訂功能
- [ ] 管理員面板 (如果適用)

### ✅ 性能檢查
- [ ] 首次載入時間 < 3秒
- [ ] Lighthouse 分數 > 80
- [ ] 手機版響應正常

---

## 常見部署問題

### 問題 1: "Module not found" 錯誤
```bash
# 解決方案：確保所有依賴都在 package.json 中
npm install
npm run build  # 本地測試構建
```

### 問題 2: 資料庫連接失敗
```bash
# 檢查 DATABASE_URL 格式
postgresql://username:password@host:5432/database_name?sslmode=require
```

### 問題 3: 環境變數未生效
- 確保在部署平台正確設置環境變數
- 重新部署讓變數生效
- 檢查變數名稱是否正確

### 問題 4: Static 檔案 404
```javascript
// next.config.js 添加
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 用於 Docker 部署
  images: {
    domains: ['your-domain.com'],
  },
}

module.exports = nextConfig
```

---

## 自定義域名設定

### Vercel
1. 前往專案 Settings > Domains
2. 添加你的域名
3. 按照提示設定 DNS 記錄

### Railway
1. 前往專案 Settings > Domains
2. 添加 Custom Domain
3. 更新 DNS CNAME 記錄

### Render
1. 前往專案 Settings > Custom Domains
2. 添加域名並驗證
3. 設定 DNS 記錄

---

## 監控和維護

### 建議監控工具
- **Vercel Analytics** - 免費使用分析
- **Sentry** - 錯誤追蹤
- **LogRocket** - 用戶行為記錄

### 定期維護
- 每月檢查依賴更新
- 監控資料庫使用量
- 檢查 SSL 憑證有效期
- 備份重要資料

---

## 需要幫助？

如果遇到部署問題：
1. 檢查這份指南的常見問題
2. 查看平台官方文檔
3. 聯繫專案維護者

**記住：選擇適合你需求和預算的部署平台！**