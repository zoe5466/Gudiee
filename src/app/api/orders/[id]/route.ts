// 單一訂單操作 API
// 功能：處理特定訂單的查詢、更新、取消等操作
import { NextRequest } from 'next/server';

// GET - 查詢特定訂單
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return Response.json({
    success: false,
    error: 'API 暫時維護中 - 正在轉換為資料庫儲存'
  }, { status: 503 });
}

// PUT - 更新訂單狀態
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return Response.json({
    success: false,
    error: 'API 暫時維護中 - 正在轉換為資料庫儲存'
  }, { status: 503 });
}

// DELETE - 取消訂單
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return Response.json({
    success: false,
    error: 'API 暫時維護中 - 正在轉換為資料庫儲存'
  }, { status: 503 });
}