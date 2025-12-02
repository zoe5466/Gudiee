import { NextRequest } from 'next/server';
import { settingsStorage } from '@/lib/mock-settings';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/settings/payment-methods - 獲取付款方式
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('缺少用戶ID', 400);
    }

    const paymentMethods = settingsStorage.getPaymentMethods(userId);
    return successResponse(paymentMethods);

  } catch (error) {
    console.error('Get payment methods error:', error);
    return errorResponse('獲取付款方式失敗', 500);
  }
}

// POST /api/settings/payment-methods - 新增付款方式
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, last4, brand, expiryMonth, expiryYear, holderName, isDefault } = body;

    if (!userId || !type || !last4 || !brand || !expiryMonth || !expiryYear || !holderName) {
      return errorResponse('缺少必要參數', 400);
    }

    const newPaymentMethod = settingsStorage.addPaymentMethod({
      userId,
      type,
      last4,
      brand,
      expiryMonth: parseInt(expiryMonth),
      expiryYear: parseInt(expiryYear),
      holderName,
      isDefault: isDefault || false
    });

    return successResponse(newPaymentMethod);

  } catch (error) {
    console.error('Add payment method error:', error);
    return errorResponse('新增付款方式失敗', 500);
  }
}