import { NextRequest } from 'next/server';
import { settingsStorage } from '@/lib/mock-settings';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/settings - 獲取用戶設定
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('缺少用戶ID', 400);
    }

    const settings = settingsStorage.getUserSettings(userId);
    return successResponse(settings);

  } catch (error) {
    console.error('Get settings error:', error);
    return errorResponse('獲取設定失敗', 500);
  }
}

// PUT /api/settings - 更新用戶設定
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, category, updates } = body;

    if (!userId || !category || !updates) {
      return errorResponse('缺少必要參數', 400);
    }

    const validCategories = ['notifications', 'privacy', 'language', 'payment'];
    if (!validCategories.includes(category)) {
      return errorResponse('無效的設定類別', 400);
    }

    const updatedSettings = settingsStorage.updateSettings(userId, category, updates);
    return successResponse(updatedSettings);

  } catch (error) {
    console.error('Update settings error:', error);
    return errorResponse('更新設定失敗', 500);
  }
}

// DELETE /api/settings - 重置用戶設定
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('缺少用戶ID', 400);
    }

    const resetSettings = settingsStorage.resetUserSettings(userId);
    return successResponse(resetSettings);

  } catch (error) {
    console.error('Reset settings error:', error);
    return errorResponse('重置設定失敗', 500);
  }
}