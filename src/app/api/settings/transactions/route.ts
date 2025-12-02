import { NextRequest } from 'next/server';
import { settingsStorage } from '@/lib/mock-settings';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/settings/transactions - 獲取交易記錄
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');

    if (!userId) {
      return errorResponse('缺少用戶ID', 400);
    }

    const transactions = settingsStorage.getTransactions(
      userId, 
      limit ? parseInt(limit) : undefined
    );

    return successResponse(transactions);

  } catch (error) {
    console.error('Get transactions error:', error);
    return errorResponse('獲取交易記錄失敗', 500);
  }
}

// POST /api/settings/transactions - 新增交易記錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, amount, currency, status, description, paymentMethodId } = body;

    if (!userId || !type || !amount || !currency || !status || !description) {
      return errorResponse('缺少必要參數', 400);
    }

    const newTransaction = settingsStorage.addTransaction({
      userId,
      type,
      amount: parseFloat(amount),
      currency,
      status,
      description,
      paymentMethodId
    });

    return successResponse(newTransaction);

  } catch (error) {
    console.error('Add transaction error:', error);
    return errorResponse('新增交易記錄失敗', 500);
  }
}