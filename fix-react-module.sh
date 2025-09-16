#!/bin/bash

# Guidee 專案 React 模組修復腳本
# 使用方法：bash fix-react-module.sh

echo "🚀 開始修復 Guidee 專案的 React 模組問題..."

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 檢查 Node.js 版本
echo -e "${BLUE}檢查 Node.js 版本...${NC}"
NODE_VERSION=$(node --version)
echo "當前 Node.js 版本: $NODE_VERSION"

if [[ $NODE_VERSION < "v18.0.0" ]]; then
    echo -e "${RED}❌ Node.js 版本過低，需要 >= 18.0.0${NC}"
    echo "請升級 Node.js: https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✅ Node.js 版本符合要求${NC}"
fi

# 檢查 npm 版本
echo -e "${BLUE}檢查 npm 版本...${NC}"
NPM_VERSION=$(npm --version)
echo "當前 npm 版本: $NPM_VERSION"

# 步驟 1: 停止可能運行的開發伺服器
echo -e "${YELLOW}步驟 1: 停止可能運行的開發伺服器...${NC}"
pkill -f "next dev" 2>/dev/null || echo "沒有運行的開發伺服器"

# 步驟 2: 刪除 node_modules 和鎖定文件
echo -e "${YELLOW}步驟 2: 清理舊的依賴文件...${NC}"
if [ -d "node_modules" ]; then
    echo "刪除 node_modules..."
    rm -rf node_modules
else
    echo "node_modules 不存在，跳過"
fi

if [ -f "package-lock.json" ]; then
    echo "刪除 package-lock.json..."
    rm -f package-lock.json
else
    echo "package-lock.json 不存在，跳過"
fi

# 步驟 3: 清理 npm 快取
echo -e "${YELLOW}步驟 3: 清理 npm 快取...${NC}"
npm cache clean --force

# 步驟 4: 重新安裝依賴
echo -e "${YELLOW}步驟 4: 重新安裝所有依賴...${NC}"
npm install

# 檢查安裝是否成功
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 依賴安裝成功${NC}"
else
    echo -e "${RED}❌ 依賴安裝失敗${NC}"
    exit 1
fi

# 步驟 5: 驗證 React 模組
echo -e "${YELLOW}步驟 5: 驗證 React 和相關模組...${NC}"
echo "檢查 React 模組..."
npm list react react-dom next typescript

# 步驟 6: 檢查環境變數文件
echo -e "${YELLOW}步驟 6: 檢查環境變數設定...${NC}"
if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
    echo "複製 .env.example 到 .env.local..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  請編輯 .env.local 文件，設置正確的環境變數${NC}"
fi

# 步驟 7: 生成 Prisma 客戶端
echo -e "${YELLOW}步驟 7: 生成 Prisma 客戶端...${NC}"
if [ -f "prisma/schema.prisma" ]; then
    npx prisma generate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Prisma 客戶端生成成功${NC}"
    else
        echo -e "${YELLOW}⚠️  Prisma 客戶端生成失敗，但不影響主要功能${NC}"
    fi
else
    echo "沒有找到 Prisma schema，跳過"
fi

# 步驟 8: 執行類型檢查
echo -e "${YELLOW}步驟 8: 執行 TypeScript 類型檢查...${NC}"
npm run type-check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TypeScript 類型檢查通過${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript 類型檢查有警告，但可能不影響運行${NC}"
fi

# 完成
echo -e "${GREEN}🎉 修復完成！${NC}"
echo ""
echo "接下來的步驟："
echo "1. 啟動開發伺服器: npm run dev"
echo "2. 開啟瀏覽器訪問: http://localhost:3000"
echo ""
echo "如果還有問題，請檢查："
echo "- .env.local 環境變數是否正確設置"
echo "- PostgreSQL 資料庫是否正在運行"
echo "- 端口 3000 是否被佔用"
echo ""
echo "需要幫助請參考 SETUP.md 文件或聯繫專案維護者"