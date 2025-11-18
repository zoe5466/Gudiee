# 資料庫設置快速指南

## 1. 配置本地開發環境

### 步驟 1: 獲取資料庫連接信息

如果你在 Vercel 上有 PostgreSQL：
1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇 Guidee 專案
3. 進入 **Settings** → **Integrations** 或 **Storage**
4. 找到 PostgreSQL 的連接字符串

### 步驟 2: 更新 .env.local

```bash
cd /Users/zoechang/zoechang/projects/Guidee

# 編輯 .env.local，找到這一行：
# DATABASE_URL="postgresql://username:password@host:5432/guidee_db?schema=public"

# 替換為你的真實連接字符串，例如：
# DATABASE_URL="postgresql://user:MyPassword123@db.example.com:5432/guidee_db?schema=public"
```

### 步驟 3: 驗證連接

```bash
# 安裝依賴（如果還沒有）
npm install

# 驗證資料庫連接
npx prisma db execute --stdin
# 輸入：SELECT version();
# 應該返回 PostgreSQL 版本信息

# 或者運行遷移
npx prisma migrate deploy
```

### 步驟 4: 生成 Prisma 客戶端

```bash
npx prisma generate
```

### 步驟 5: 啟動開發服務器

```bash
npm run dev
```

## 2. 測試 API 端點

### 測試服務列表 API

```bash
# 無認證 (GET 服務不需要登入)
curl "http://localhost:3000/api/services"

# 帶搜尋參數
curl "http://localhost:3000/api/services?location=taipei&priceMin=500&priceMax=2000"

# 帶分頁
curl "http://localhost:3000/api/services?page=1&limit=10"
```

### 測試預訂 API (需要認證)

```bash
# 首先需要登入獲取 JWT token
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 使用 token 調用預訂 API
curl "http://localhost:3000/api/bookings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 建立新預訂
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "serviceId": "service-uuid",
    "bookingDate": "2025-12-25",
    "numberOfGuests": 2,
    "specialRequests": "需要中文導遊"
  }'
```

## 3. 常見問題排查

### 連接拒絕錯誤
```
Error: connect ECONNREFUSED
```

**解決方案**：
- 檢查 .env.local 中的 DATABASE_URL 是否正確
- 檢查資料庫是否在線
- 檢查防火牆設置

### 認證失敗
```
Error: password authentication failed for user "username"
```

**解決方案**：
- 檢查用戶名和密碼是否正確
- 檢查是否有特殊字符需要 URL 編碼

### Prisma 遷移失敗
```
Error: Migration cannot proceed
```

**解決方案**：
```bash
# 檢查遷移狀態
npx prisma migrate status

# 重置資料庫 (注意: 會清空所有數據)
npx prisma migrate reset

# 或手動執行遷移
npx prisma migrate resolve --rolled-back
```

## 4. 性能驗證

### 檢查索引是否建立

```sql
-- 連接到資料庫後執行
\d+ bookings
\d+ services
\d+ messages
\d+ reviews

-- 應該看到多個 idx_* 索引
```

### 監控查詢效率

啟用 Prisma 查詢日誌：
```bash
# 在 .env.local 中設置
DEBUG="prisma:*"
npm run dev
```

### 驗證 N+1 查詢修復

```bash
# 檢查控制台輸出中獲取對話的查詢數
# 修復後應該只有 3 次查詢，無論有多少對話

curl "http://localhost:3000/api/conversations?limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 5. 部署到生產環境

### 在 Vercel 中設置

1. **進入 Vercel Dashboard**
   - 選擇 Guidee 專案
   - Settings → Environment Variables

2. **添加環境變數**
   ```
   DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/guidee_db
   NODE_ENV=production
   PRISMA_QUERY_TIMEOUT=10000
   ```

3. **執行遷移**
   ```bash
   # 在部署前本地執行
   npx prisma migrate deploy --environment production

   # 或在部署後通過 Vercel CLI
   vercel env pull
   npx prisma migrate deploy
   ```

4. **驗證生產環境連接**
   ```bash
   # 檢查日誌
   vercel logs --tail
   ```

## 6. 備份和恢復

### 備份資料庫

```bash
# PostgreSQL 備份命令
pg_dump -U username -h host -d guidee_db > backup.sql

# 或使用 Vercel 提供的備份功能
# 登入 Vercel → Storage → PostgreSQL → Backups
```

### 恢復資料庫

```bash
# 從備份恢復
psql -U username -h host -d guidee_db < backup.sql
```

## 7. 監控和維護

### 定期檢查

- [ ] 每週檢查查詢日誌，尋找慢查詢
- [ ] 每月運行 VACUUM 優化資料庫
- [ ] 檢查磁盤空間使用情況
- [ ] 驗證備份是否成功

### 性能優化命令

```sql
-- 優化資料庫
VACUUM ANALYZE;

-- 查看表大小
SELECT table_name, pg_size_pretty(pg_total_relation_size(table_name))
FROM information_schema.tables
WHERE table_schema='public';

-- 查看索引使用情況
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## 8. 快速參考

| 命令 | 功能 |
|------|------|
| `npx prisma db push` | 推送 schema 到資料庫 |
| `npx prisma migrate dev --name add_field` | 建立新遷移 |
| `npx prisma migrate deploy` | 執行遷移 |
| `npx prisma db seed` | 執行種子文件 |
| `npx prisma studio` | 打開 Prisma Studio GUI |
| `npx prisma generate` | 生成 Prisma 客戶端 |

## 9. 獲取幫助

- **Prisma 文件**：https://www.prisma.io/docs/
- **PostgreSQL 文件**：https://www.postgresql.org/docs/
- **Vercel 支持**：https://vercel.com/support

---

**最後更新**：2025-11-18
