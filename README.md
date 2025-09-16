# Guidee - 地陪媒合平台

> **Guidee = Guide + ee**  
> 旅遊界的 Uber - 連接在地地陪與旅客的雙邊媒合平台

[![Status](https://img.shields.io/badge/status-規劃階段-yellow)](https://guidee.online)
[![Version](https://img.shields.io/badge/version-MVP-blue)](https://guidee.online)
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Platform](https://img.shields.io/badge/platform-Web-lightgrey)]()

## 🎯 專案概述

**Guidee** 是一個地陪媒合平台，就像旅遊版的 Uber 或導遊版的 Airbnb。我們連接有在地導覽需求的**旅客**與專業的**地陪服務提供者**，建立一個可信、安全、好用的雙邊市場。

**平台使命**：讓旅客輕鬆找到可信賴的在地嚮導，讓地陪穩定接案並獲得合理收入。

**網站**: [guidee.online](https://guidee.online)

### 🌟 核心價值

- **信任機制**: 完整的身分驗證與評價系統
- **安全保障**: 金流託管與爭議處理機制  
- **用戶體驗**: 簡潔直觀的操作流程
- **多元服務**: 多語言與多幣別支援

## 🚀 平台核心功能

### 🧳 對旅客 (需要地陪的人)
- 🔍 **搜尋地陪**: 依城市、日期、語言、價位篩選在地導遊
- 👤 **查看檔案**: 瀏覽地陪個人介紹、專長領域、客戶評價
- 💬 **私訊溝通**: 站內安全訊息系統，詢問行程細節
- 📅 **預約服務**: 選擇日期時段，填寫具體需求
- 💳 **安全付款**: 信用卡付款，平台代為託管保障雙方
- ⭐ **服務評價**: 完成服務後給予評分和心得分享

### 🗺️ 對地陪 (在地服務提供者)
- 📝 **建立檔案**: 上傳身分證明、個人介紹、服務照片
- 🏷️ **設定服務**: 自訂每小時價格、可服務時段、專長區域
- 📞 **接收詢問**: 查看旅客需求，透過訊息溝通細節
- ✅ **確認接案**: 24小時內決定接受或婉拒預約
- 🎯 **提供服務**: 按約定時間地點提供專業地陪導覽
- 💰 **收取費用**: 服務完成後 T+7 天收到款項（扣除平台抽成）

### 管理功能
- 👤 **用戶管理**: KYC 身分驗證與帳戶管理
- 🛡️ **內容審核**: AI + 人工雙重內容審核
- ⚖️ **爭議處理**: 48小時內回應，5天內解決
- 📊 **數據分析**: 完整的營運數據儀表板

## 🏗️ 技術架構

### 前端技術棧
```
Framework:      Next.js 14 + React 18
Styling:        Tailwind CSS + Shadcn/ui  
State:          Zustand
Internationalization: next-i18next
Maps:           Mapbox GL JS
```

### 後端技術棧
```
Framework:      NestJS (TypeScript)
API:            RESTful + GraphQL
Authentication: JWT + Refresh Token
File Processing: Multer + Sharp
```

### 資料庫與服務
```
Database:       PostgreSQL 15
Cache:          Redis 7
Search:         Elasticsearch
Storage:        AWS S3 / Google Cloud Storage
Payment:        Stripe (國際) + 藍新金流 (台灣)
Notifications:  Twilio (SMS) + SendGrid (Email)
```

## 📋 安裝與設定

### 系統需求
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (推薦)

### 專案狀態

⚠️ **注意**: 此專案目前處於**規劃階段**，尚未開始實際開發。

**現有資源**:
- ✅ 完整的產品規劃文檔
- ✅ 詳細的技術架構設計  
- ✅ 14週開發時程規劃
- ❌ 實際程式碼實作 (待開發)

**下一步行動**:
1. 確認專案預算與團隊配置
2. 開始第一階段：需求分析與設計 (Week 1-2)
3. 建立開發環境與技術架構 (Week 3)
4. 開始後端 API 開發 (Week 4-6)

## 🔧 開發指南

### 規劃中的專案結構
```
├── apps/
│   ├── web/              # Next.js 前端應用 (待開發)
│   └── api/              # NestJS 後端 API (待開發)
├── packages/
│   ├── ui/               # 共用 UI 組件 (待開發)
│   ├── database/         # 資料庫模型與遷移 (待開發)
│   └── shared/           # 共用工具與類型 (待開發)
├── docs/                 # 專案文檔 ✅
│   ├── README.md         # 專案總覽
│   ├── DEVELOPMENT_PLAN.md  # 開發計劃
│   └── travel_guide_platform_complete.md  # 完整規劃
└── deploy/               # 部署配置 (待開發)
```

### 開發流程

1. **功能開發**
```bash
git checkout -b feature/新功能名稱
# 開發功能...
npm run test
npm run build
```

2. **程式碼品質**
```bash
npm run lint          # ESLint 檢查
npm run type-check    # TypeScript 類型檢查
npm run test:coverage # 測試覆蓋率
```

3. **提交程式碼**
```bash
git add .
git commit -m "feat: 新增功能描述"
git push origin feature/新功能名稱
```

## 🧪 測試

```bash
# 執行所有測試
npm run test

# 單元測試
npm run test:unit

# 整合測試  
npm run test:integration

# E2E 測試
npm run test:e2e

# 測試覆蓋率
npm run test:coverage
```

## 🚀 部署

### 生產環境部署

1. **Docker 部署**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. **Kubernetes 部署**
```bash
kubectl apply -f deploy/k8s/
```

3. **環境變數設定**
- 資料庫連線字串
- Redis 連線設定
- 第三方服務 API 金鑰
- JWT 密鑰設定

## 💰 商業模式與收費

### 平台收費結構
```
旅客支付: 地陪費用 + 5% 平台服務費
地陪收入: 服務費用 - 15% 平台抽成
金流成本: 2-3.5% (平台吸收)
```

### 交易流程與金流
1. **旅客付款** → 平台託管款項
2. **服務完成** → 雙方確認與評價
3. **T+7 撥款** → 扣除抽成後撥款給地陪
4. **爭議處理** → 款項暫停，平台仲裁後決定

### 範例計算
```
地陪服務費: NT$ 2,000 (4小時 × NT$ 500/小時)
旅客實付: NT$ 2,100 (含5%平台費)
地陪實收: NT$ 1,700 (扣除15%抽成)
平台收入: NT$ 400 (5% + 15%)
```

## 🛡️ 安全性

### 資料保護
- 傳輸層 TLS 1.3 加密
- 敏感資料 AES-256 加密儲存
- RBAC 權限管理系統
- 完整的稽核日誌追蹤

### 隱私合規
- GDPR 歐盟資料保護法規遵循
- 台灣個人資料保護法遵循
- 資料攜行權與刪除權支援

## 📈 監控與分析

### 效能指標
- API 回應時間: P95 < 300ms
- 首屏載入時間: < 2.5s
- 系統可用性: 99.5% SLA
- 搜尋響應時間: < 500ms

### 關鍵業務指標
- **供需比例**: 地陪與旅客註冊比例
- **媒合成功率**: 詢問到成交的轉換率
- **交易完成率**: 預約到服務完成的比例
- **重複使用率**: 用戶再次使用平台的比例
- **平均評分**: 服務品質滿意度
- **GMV 成長**: 月交易總額與成長率

## 🤝 貢獻指南

我們歡迎社群貢獻！請遵循以下流程：

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 編碼規範
- 使用 TypeScript 進行開發
- 遵循 ESLint 與 Prettier 設定
- 撰寫單元測試
- 提供清楚的提交訊息

## 📞 支援與聯繫

- **問題回報**: [GitHub Issues](https://github.com/your-org/guidee/issues)
- **功能建議**: [GitHub Discussions](https://github.com/your-org/guidee/discussions)
- **技術文檔**: [docs/](./docs/)
- **Email**: support@guidee.online

## 📝 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 🗺️ 發展藍圖

### Phase 1: MVP 驗證 (上線後3個月)
- 🎯 **台北市場驗證**: 100+ 地陪，500+ 旅客註冊
- 📊 **核心指標達成**: 交易成功率 >80%，平均評分 >4.0
- 🔧 **功能優化**: 根據用戶反饋持續改進

### Phase 2: 市場擴展 (3-12個月)
- 🌏 **多城市布局**: 拓展至高雄、台中、花蓮等熱門旅遊城市
- 📱 **App 開發**: iOS/Android 原生應用
- 🤝 **策略合作**: 與飯店、旅行社、航空公司合作

### Phase 3: 規模化營運 (1-3年)
- 🤖 **AI 智能推薦**: 基於偏好的個人化推薦系統
- 🌍 **國際化擴展**: 進軍東南亞及日韓市場
- 💼 **企業服務**: B2B 商務旅行地陪服務
- 🎪 **多元服務**: 擴展至攝影、翻譯、活動策劃等服務

---

**Guidee Team** - 讓每一次旅程都有專屬的在地嚮導 🌟# Force redeploy trigger
