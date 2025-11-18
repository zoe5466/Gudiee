# ⚡ Guidee 快速啟動指南

**5分鐘快速設置並運行 Guidee 地陪媒合平台**

## 🎯 最簡單的啟動方式

### 1️⃣ 克隆專案
```bash
git clone https://github.com/your-org/guidee.git
cd guidee
```

### 2️⃣ 安裝依賴
```bash
npm install
```

### 3️⃣ 設置資料庫
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14
createdb guidee_db

# Ubuntu/Linux
sudo apt install postgresql-14
sudo systemctl start postgresql
sudo -u postgres createdb guidee_db
```

### 4️⃣ 設定環境變數
```bash
cp .env.example .env.local
```

編輯 `.env.local` 檔案：
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/guidee_db?schema=public"
JWT_SECRET="your-64-character-random-secret-key-here"
NODE_ENV="development"
```

### 5️⃣ 初始化資料庫
```bash
npm run db:generate
npm run db:migrate
node scripts/create-test-users.js
node scripts/create-test-services.js
```

### 6️⃣ 啟動應用
```bash
npm run dev
```

🎉 **完成！** 開啟 http://localhost:3000

## 🧪 測試功能

### 登入測試帳號
- **旅客**: demo@guidee.com / demo123
- **導遊**: guide@guidee.com / guide123

### 測試功能
1. 點擊「成為地陪」按鈕
2. 瀏覽服務詳情頁面
3. 測試預訂流程
4. 查看用戶資料

## 🔧 版本要求

- **Node.js**: >= 18.0.0 (目前使用 v24.2.0)
- **npm**: >= 8.0.0 (目前使用 v11.3.0)  
- **PostgreSQL**: >= 12.0 (目前使用 v14.19)

## 🆘 常見問題

### 端口被占用
```bash
# 查看誰在使用 3000 端口
lsof -i :3000

# 使用其他端口
npm run dev -- --port 3001
```

### 資料庫連接失敗
```bash
# 檢查 PostgreSQL 是否運行
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux
```

### 需要完整設置？
查看 [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) 了解詳細設置步驟

---

**遇到問題？** 查看 [Issues](https://github.com/your-org/guidee/issues) 或聯絡開發團隊 📞