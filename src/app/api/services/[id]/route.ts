import { NextRequest } from 'next/server';
import { serviceStorage } from '@/lib/mock-services';

interface RouteParams {
  params: { id: string };
}

// GET /api/services/[id] - 獲取單個服務詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('Service API called with ID:', params.id);
    
    // 從 mock 服務存儲中獲取服務
    const service = serviceStorage.getById(params.id);
    
    if (!service) {
      return Response.json({ 
        success: false, 
        error: 'Service not found',
        message: '找不到指定的服務' 
      }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      data: service, 
      message: '服務詳情獲取成功' 
    });
  } catch (error) {
    console.error('Service API error:', error);
    return Response.json({ 
      success: false, 
      error: 'Internal server error',
      message: '服務載入失敗' 
    }, { status: 500 });
  }
}