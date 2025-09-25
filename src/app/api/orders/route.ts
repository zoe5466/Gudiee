// 訂單 API 端點
// 功能：處理訂單的建立、查詢等操作
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { Order, CreateOrderRequest, OrderListParams, OrderResponse, OrderListResponse, OrderStatus } from '@/types/order';

// 模擬訂單資料（實際應該從資料庫讀取）
let mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'GD240001',
    userId: 'guide-001',
    status: 'CONFIRMED',
    booking: {
      serviceId: 'service-001',
      serviceName: '台北101 & 信義區深度導覽',
      serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideId: 'guide-001',
      guideName: '張小美',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '13:00',
      duration: 4,
      participants: 2,
      location: {
        name: '台北101購物中心正門',
        address: '台北市信義區市府路45號',
        coordinates: {
          lat: 25.0339,
          lng: 121.5645
        }
      },
      specialRequests: '希望能多介紹建築歷史'
    },
    customer: {
      name: '王小明',
      email: 'wang@example.com',
      phone: '0912345678',
      nationality: '台灣',
      emergencyContact: {
        name: '王太太',
        phone: '0987654321',
        relationship: '配偶'
      }
    },
    pricing: {
      basePrice: 800,
      participants: 2,
      subtotal: 1600,
      serviceFee: 160,
      tax: 88,
      total: 1848,
      currency: 'TWD'
    },
    payment: {
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
      transactionId: 'txn_123456789',
      paidAt: '2024-01-20T10:30:00Z',
      paymentDetails: {
        cardLast4: '1234',
        cardBrand: 'VISA'
      }
    },
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    confirmedAt: '2024-01-20T10:30:00Z'
  }
];

// 獲取當前用戶函數（與認證 API 保持一致）
function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const userData = JSON.parse(atob(token));
    
    if (userData.exp && userData.exp < Date.now()) {
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Parse token error:', error);
    return null;
  }
}

// 生成訂單編號
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `GD${year}${month}${randomNum}`;
}

// 計算價格
function calculatePricing(basePrice: number, participants: number, discountCode?: string) {
  const subtotal = basePrice * participants;
  const serviceFeeRate = 0.1; // 10% 服務費
  const taxRate = 0.05; // 5% 稅費
  
  let serviceFee = Math.round(subtotal * serviceFeeRate);
  let tax = Math.round((subtotal + serviceFee) * taxRate);
  
  let discount = undefined;
  let discountAmount = 0;
  
  // 處理優惠碼
  if (discountCode) {
    switch (discountCode.toUpperCase()) {
      case 'WELCOME10':
        discount = {
          type: 'PERCENTAGE' as const,
          value: 10,
          code: discountCode,
          description: '新用戶10%折扣'
        };
        discountAmount = Math.round(subtotal * 0.1);
        break;
      case 'SAVE100':
        discount = {
          type: 'FIXED' as const,
          value: 100,
          code: discountCode,
          description: '滿額減100'
        };
        discountAmount = 100;
        break;
    }
  }
  
  const total = subtotal + serviceFee + tax - discountAmount;
  
  return {
    basePrice,
    participants,
    subtotal,
    serviceFee,
    tax,
    discount,
    total: Math.max(total, 0), // 確保總金額不為負數
    currency: 'TWD'
  };
}

// GET - 查詢訂單列表
export async function GET(request: NextRequest) {
  try {
    console.log('Get orders API called');
    
    const user = getCurrentUser();
    if (!user) {
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params: OrderListParams = {
      status: searchParams.get('status')?.split(',') as OrderStatus[],
      userId: searchParams.get('userId') || undefined,
      guideId: searchParams.get('guideId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc'
    };

    let filteredOrders = mockOrders;

    // 根據用戶角色篩選
    if (user.role !== 'admin') {
      filteredOrders = filteredOrders.filter(order => 
        order.userId === user.id || order.booking.guideId === user.id
      );
    }

    // 狀態篩選
    if (params.status && params.status.length > 0) {
      filteredOrders = filteredOrders.filter(order => 
        params.status!.includes(order.status)
      );
    }

    // 用戶篩選
    if (params.userId) {
      filteredOrders = filteredOrders.filter(order => order.userId === params.userId);
    }

    // 導遊篩選
    if (params.guideId) {
      filteredOrders = filteredOrders.filter(order => order.booking.guideId === params.guideId);
    }

    // 日期篩選
    if (params.startDate) {
      filteredOrders = filteredOrders.filter(order => 
        order.booking.date >= params.startDate!
      );
    }
    
    if (params.endDate) {
      filteredOrders = filteredOrders.filter(order => 
        order.booking.date <= params.endDate!
      );
    }

    // 排序
    filteredOrders.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (params.sortBy) {
        case 'date':
          aVal = new Date(a.booking.date);
          bVal = new Date(b.booking.date);
          break;
        case 'total':
          aVal = a.pricing.total;
          bVal = b.pricing.total;
          break;
        default:
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
      }
      
      if (params.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // 分頁
    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / params.limit!);
    const startIndex = (params.page! - 1) * params.limit!;
    const endIndex = startIndex + params.limit!;
    const orders = filteredOrders.slice(startIndex, endIndex);

    const response: OrderListResponse = {
      success: true,
      data: {
        orders,
        total,
        page: params.page!,
        limit: params.limit!,
        totalPages
      }
    };

    return Response.json(response);

  } catch (error) {
    console.error('Get orders error:', error);
    return Response.json({
      success: false,
      error: '查詢訂單失敗'
    }, { status: 500 });
  }
}

// POST - 建立新訂單
export async function POST(request: NextRequest) {
  try {
    console.log('Create order API called');
    
    const user = getCurrentUser();
    if (!user) {
      return Response.json({
        success: false,
        error: '未認證'
      }, { status: 401 });
    }

    const body: CreateOrderRequest = await request.json();
    const { serviceId, date, startTime, participants, customer, specialRequests } = body;

    // 驗證必填欄位
    if (!serviceId || !date || !startTime || !participants || !customer) {
      return Response.json({
        success: false,
        error: '缺少必填欄位'
      }, { status: 400 });
    }

    // 驗證參與人數
    if (participants < 1 || participants > 20) {
      return Response.json({
        success: false,
        error: '參與人數必須在 1-20 人之間'
      }, { status: 400 });
    }

    // 模擬服務資料查詢（實際應該從資料庫查詢）
    const mockService = {
      id: serviceId,
      name: '台北101 & 信義區深度導覽',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      basePrice: 800,
      duration: 4,
      guideId: 'guide-001',
      guideName: '張小美',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      location: {
        name: '台北101購物中心正門',
        address: '台北市信義區市府路45號',
        coordinates: { lat: 25.0339, lng: 121.5645 }
      }
    };

    // 計算結束時間
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (mockService.duration * 60 * 60 * 1000));
    const endTime = endDateTime.toTimeString().slice(0, 5);

    // 計算價格
    const pricing = calculatePricing(mockService.basePrice, participants);

    // 建立訂單
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      userId: user.id,
      status: 'DRAFT',
      booking: {
        serviceId,
        serviceName: mockService.name,
        serviceImage: mockService.image,
        guideId: mockService.guideId,
        guideName: mockService.guideName,
        guideAvatar: mockService.guideAvatar,
        date,
        startTime,
        endTime,
        duration: mockService.duration,
        participants,
        location: mockService.location,
        specialRequests
      },
      customer,
      pricing,
      payment: {
        method: 'CREDIT_CARD',
        status: 'PENDING'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 儲存訂單（實際應該存入資料庫）
    mockOrders.push(newOrder);

    console.log('Order created successfully:', newOrder.orderNumber);

    const response: OrderResponse = {
      success: true,
      data: newOrder,
      message: '訂單建立成功'
    };

    return Response.json(response);

  } catch (error) {
    console.error('Create order error:', error);
    return Response.json({
      success: false,
      error: '建立訂單失敗'
    }, { status: 500 });
  }
}