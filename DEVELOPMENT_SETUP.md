# 🚀 Guidee 開發環境設置指南

**讓其他開發者快速加入專案的完整設置文檔**

## 📋 系統需求與版本

### 必要軟體版本

| 軟體 | 最低版本 | 推薦版本 | 目前使用 |
|------|---------|---------|---------|
| **Node.js** | 18.0.0 | 20.x.x | v24.2.0 |
| **npm** | 8.0.0 | 10.x.x | v11.3.0 |
| **PostgreSQL** | 12.0 | 14.x | v14.19 |
| **Git** | 2.20.0 | 最新版 | - |

### 作業系統支援
- ✅ macOS 10.15+
- ✅ Windows 10/11 (with WSL2)
- ✅ Ubuntu 20.04+
- ✅ Docker 環境

## 🛠️ 技術堆疊詳細版本

### 核心框架
```json
{
  "next": "14.0.4",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.3.0"
}
```

### 資料庫 & ORM
```json
{
  "prisma": "^6.14.0",
  "@prisma/client": "^6.14.0",
  "postgresql": "14.19"
}
```

### 認證 & 安全
```json
{
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "jose": "^5.1.3"
}
```

### UI 組件庫
```json
{
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "lucide-react": "^0.294.0"
}
```

### 狀態管理 & 資料獲取
```json
{
  "zustand": "^4.5.7",
  "swr": "^2.2.4",
  "axios": "^1.6.2"
}
```

## 📦 安裝步驟

### 1. 複製專案
```bash
# 使用 SSH (推薦)
git clone git@github.com:your-org/guidee.git

# 或使用 HTTPS
git clone https://github.com/your-org/guidee.git

cd guidee
```

### 2. 安裝 Node.js 依賴
```bash
# 安裝所有依賴包
npm install

# 驗證安裝
npm list --depth=0
```

### 3. PostgreSQL 安裝與設置

#### macOS (使用 Homebrew)
```bash
# 安裝 PostgreSQL
brew install postgresql@14

# 啟動服務
brew services start postgresql@14

# 建立資料庫
createdb guidee_db

# 測試連接
psql guidee_db
```

#### Ubuntu/Debian
```bash
# 安裝 PostgreSQL
sudo apt update
sudo apt install postgresql-14 postgresql-contrib

# 啟動服務
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 建立資料庫使用者和資料庫
sudo -u postgres createuser --interactive
sudo -u postgres createdb guidee_db
```

#### Windows (使用 WSL2)
```bash
# 安裝 PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 啟動服務
sudo service postgresql start

# 建立資料庫
sudo -u postgres createdb guidee_db
```

### 4. 環境變數設定

```bash
# 複製環境變數範本
cp .env.example .env.local

# 編輯環境變數
nano .env.local  # 或使用 code .env.local
```

#### 必須設定的環境變數
```env
# 資料庫連接 (必須修改為您的設定)
DATABASE_URL="postgresql://username:password@localhost:5432/guidee_db?schema=public"

# JWT 密鑰 (產生一個安全的密鑰)
JWT_SECRET="your-super-secure-secret-key-at-least-32-characters-long"

# 應用基本設定
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

#### 產生安全的 JWT 密鑰
```bash
# 使用 Node.js 產生
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 使用 OpenSSL 產生
openssl rand -hex 64
```

### 5. 資料庫初始化

```bash
# 產生 Prisma 客戶端
npm run db:generate

# 執行資料庫遷移
npm run db:migrate

# 檢查遷移狀態
npx prisma migrate status

# 開啟 Prisma Studio (可選)
npm run db:studio
```

### 6. 建立測試資料

```bash
# 建立測試用戶
node scripts/create-test-users.js

# 建立測試服務
node scripts/create-test-services.js

# 驗證資料
npx prisma studio
```

### 7. 啟動開發伺服器

```bash
# 啟動開發伺服器
npm run dev

# 伺服器將運行在 http://localhost:3000
```

## 🧪 驗證安裝

### 1. 檢查依賴版本
```bash
# 檢查 Node.js 版本
node --version  # 應該 >= 18.0.0

# 檢查 npm 版本
npm --version   # 應該 >= 8.0.0

# 檢查 PostgreSQL 版本
psql --version  # 應該 >= 12.0
```

### 2. 測試資料庫連接
```bash
# 測試 Prisma 連接
npx prisma db pull

# 檢查資料表
npx prisma studio
```

### 3. 測試 API 端點
```bash
# 測試伺服器狀態
curl http://localhost:3000/api/health

# 測試認證 API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@guidee.com","password":"demo123"}'
```

### 4. 測試前端功能
- 開啟 `http://localhost:3000`
- 點擊「成為地陪」按鈕
- 嘗試登入測試帳號
- 瀏覽服務詳情頁面

## 🎯 測試帳號

| 角色 | 帳號 | 密碼 | 用途 |
|------|------|------|------|
| 旅客 | demo@guidee.com | demo123 | 一般用戶測試 |
| 導遊 | guide@guidee.com | guide123 | 導遊功能測試 |

## 🔧 開發工具設定

### VS Code 推薦擴充功能
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code 設定檔 (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 📝 開發流程

### 1. 日常開發
```bash
# 啟動開發伺服器
npm run dev

# 另開終端執行代碼檢查
npm run lint

# 類型檢查
npm run type-check

# 運行測試
npm test
```

### 2. 資料庫開發
```bash
# 修改 schema 後重新生成
npm run db:generate

# 建立新的遷移
npx prisma migrate dev --name describe-your-changes

# 重置資料庫 (開發環境)
npm run db:reset
```

### 3. 代碼品質
```bash
# 檢查代碼風格
npm run lint

# 自動修復
npm run lint:fix

# 檢查 TypeScript 類型
npm run type-check

# 運行測試
npm test

# 測試覆蓋率
npm run test:coverage
```

## 🐛 常見問題排解

### 1. 資料庫連接失敗
```bash
# 檢查 PostgreSQL 服務狀態
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# 檢查資料庫是否存在
psql -l | grep guidee_db

# 測試連接
psql "postgresql://username:password@localhost:5432/guidee_db"
```

### 2. 端口被占用
```bash
# 檢查端口 3000 使用狀況
lsof -i :3000

# 殺死占用端口的進程
kill -9 <PID>

# 使用不同端口
npm run dev -- --port 3001
```

### 3. 依賴安裝問題
```bash
# 清除快取
npm cache clean --force

# 刪除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install

# 檢查 Node.js 版本
nvm use 20  # 如果使用 nvm
```

### 4. Prisma 相關問題
```bash
# 重新生成 Prisma 客戶端
npx prisma generate

# 檢查 schema 語法
npx prisma validate

# 重置資料庫
npx prisma migrate reset --force
```

## 🚀 進階設定

### Docker 開發環境 (可選)
```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: guidee_db
      POSTGRES_USER: guidee
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# 使用 Docker 啟動資料庫
docker-compose up -d db

# 停止服務
docker-compose down
```

## 📚 學習資源

### 官方文檔
- [Next.js 文檔](https://nextjs.org/docs)
- [Prisma 文檔](https://www.prisma.io/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [TypeScript 文檔](https://www.typescriptlang.org/docs)

### 專案相關
- [API 文檔](./docs/API.md)
- [資料庫 Schema](./docs/DATABASE.md)
- [部署指南](./docs/DEPLOYMENT.md)

## 🤝 取得協助

如果遇到任何問題，請透過以下方式尋求協助：

1. **檢查文檔**: 先查看相關文檔
2. **搜尋 Issues**: 查看是否有類似問題
3. **建立 Issue**: 詳細描述問題與環境
4. **聯絡團隊**: 透過 Slack 或 Email 聯絡

---

**準備好開始開發了嗎？運行 `npm run dev` 開始您的 Guidee 開發之旅！ 🚀**