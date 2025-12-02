import { NextRequest } from 'next/server';
import { settingsStorage } from '@/lib/mock-settings';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// PUT /api/settings/payment-methods/[id] - 更新付款方式
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;
    const methodId = params.id;

    if (!userId) {
      return errorResponse('缺少用戶ID', 400);
    }

    const updatedMethod = settingsStorage.updatePaymentMethod(userId, methodId, updates);
    
    if (!updatedMethod) {
      return errorResponse('找不到付款方式', 404);
    }

    return successResponse(updatedMethod);

  } catch (error) {
    console.error('Update payment method error:', error);
    return errorResponse('更新付款方式失敗', 500);
  }
}

// DELETE /api/settings/payment-methods/[id] - 刪除付款方式
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const methodId = params.id;

    if (!userId) {
      return errorResponse('缺少用戶ID', 400);
    }

    const success = settingsStorage.deletePaymentMethod(userId, methodId);
    
    if (!success) {
      return errorResponse('無法刪除付款方式', 400);
    }

    return successResponse({ message: '付款方式已刪除' });

  } catch (error) {
    console.error('Delete payment method error:', error);
    return errorResponse('刪除付款方式失敗', 500);
  }
}