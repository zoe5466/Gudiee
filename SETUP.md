# Guidee 專案設置指南

## 專案簡介
Guidee 是一個地陪媒合平台，使用 Next.js 14 和 TypeScript 開發。

## 開發環境需求
- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL 14.19+

## 快速開始

### 1. 克隆專案
```bash
git clone https://github.com/your-org/guidee.git
cd guidee
```

### 2. 安裝依賴
```bash
# 清理可能存在的問題
rm -rf node_modules package-lock.json

# 重新安裝所有依賴
npm install
```

### 3. 環境變數設置
複製環境變數文件並根據需要修改：
```bash
cp .env.example .env.local
```

### 4. 資料庫設置
```bash
# 生成 Prisma 客戶端
npm run db:generate

# 執行資料庫遷移
npm run db:migrate

# (可選) 填入測試資料
npm run db:seed
```

### 5. 啟動開發伺服器
```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 常見問題解決

### Cannot find module 'react' 錯誤
這通常是因為依賴安裝不完整，請按以下步驟解決：

1. **刪除現有的 node_modules 和鎖定文件**
```bash
rm -rf node_modules
rm -f package-lock.json
```

2. **清理 npm 快取**
```bash
npm cache clean --force
```

3. **重新安裝依賴**
```bash
npm install
```

4. **驗證 React 是否正確安裝**
```bash
npm list react react-dom
```

### TypeScript 類型檢查錯誤
```bash
# 執行類型檢查
npm run type-check

# 如果有錯誤，請確保所有依賴都已安裝
npm install @types/react @types/react-dom @types/node
```

### 開發伺服器無法啟動
1. 確認 Node.js 版本：`node --version` (需要 >= 18.0.0)
2. 確認端口 3000 沒有被佔用：`lsof -i :3000`
3. 如果端口被佔用，可以使用其他端口：`npm run dev -- -p 3001`

### 資料庫連接問題
1. 確認 PostgreSQL 正在運行
2. 檢查 `.env.local` 中的 `DATABASE_URL` 配置
3. 執行資料庫連接測試：`npm run db:studio`

## 開發工具推薦

### VSCode 擴充套件
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Prisma

### 有用的指令
```bash
# 程式碼格式化
npm run lint:fix

# 類型檢查
npm run type-check

# 資料庫管理介面
npm run db:studio

# 執行測試
npm run test
```

## 專案結構
```
src/
├── app/                 # Next.js App Router 頁面和 API 路由
├── components/         # React 組件
├── lib/               # 工具函數和配置
├── store/             # Zustand 狀態管理
├── styles/            # 全域樣式
└── types/             # TypeScript 類型定義
```

## 支援
如果遇到問題，請：
1. 檢查這個設置指南
2. 查看專案的 GitHub Issues
3. 聯繫專案維護者

## 貢獻指南
1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request