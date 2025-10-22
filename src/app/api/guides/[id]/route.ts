import { NextRequest } from 'next/server';
import { guideStorage } from '@/lib/mock-guides';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/guides/[id] - 取得嚮導詳細資料
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guideId = params.id;

    // 從模擬數據中查詢嚮導資料
    const guide = guideStorage.getById(guideId);

    if (!guide) {
      return errorResponse('找不到嚮導', 404);
    }

    return successResponse(guide);

  } catch (error) {
    console.error('Get guide profile error:', error);
    return errorResponse('取得嚮導資料失敗', 500);
  }
}