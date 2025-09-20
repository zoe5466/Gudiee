import { NextRequest } from 'next/server';

interface RouteParams {
  params: { id: string };
}

// 輔助函數：生成可用日期
function generateAvailableDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// 輔助函數：生成模擬評論
function generateMockReviews() {
  return [
    {
      id: 'review-001',
      rating: 5,
      comment: '小美導遊非常專業，帶我們深度了解台北101的歷史和建築特色，還推薦了很多在地美食，非常推薦！',
      createdAt: new Date('2024-01-15').toISOString(),
      isAnonymous: false,
      reviewer: {
        id: 'user-001',
        name: '王小明',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 'review-002',
      rating: 4,
      comment: '行程安排得很好，時間掌控也很棒。101觀景台的景色真的很震撼！',
      createdAt: new Date('2024-01-10').toISOString(),
      isAnonymous: false,
      reviewer: {
        id: 'user-002',
        name: '李小華',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      }
    }
  ];
}

// GET /api/services/[id] - 獲取單個服務詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('Service API called with ID:', params.id);
    
    // 總是返回模擬資料，避免數據庫相關問題
    const mockService = {
      id: params.id,
      title: '台北101 & 信義區深度導覽',
      description: '專業地陪帶您探索台北最精華的商業區，包含101觀景台、信義商圈購物與在地美食體驗。這是一個完整的半日遊行程，讓您深度了解台北的現代面貌與商業發展歷史。',
      shortDescription: '探索台北最精華的商業區，包含101觀景台、信義商圈購物與美食',
      price: 1200,
      location: '台北市信義區',
      duration: 4,
      maxGuests: 6,
      minGuests: 1,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
      ],
      highlights: [
        '專業導遊帶領，深度了解台北商業發展',
        '登上台北101觀景台，俯瞰台北全景',
        '品嚐信義區特色美食與小吃',
        '參觀四四南村，了解眷村文化',
        '漫步信義商圈，體驗購物樂趣'
      ],
      included: ['專業導遊服務', '台北101觀景台門票', '美食品嚐', '交通接送'],
      excluded: ['個人消費', '額外餐費', '紀念品'],
      cancellationPolicy: '24小時前免費取消',
      category: { name: '城市導覽' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        averageRating: 4.9,
        totalReviews: 127,
        totalBookings: 89,
        ratingDistribution: { 1: 0, 2: 1, 3: 5, 4: 26, 5: 95 }
      },
      availability: {
        availableDates: generateAvailableDates(),
        bookedDates: []
      },
      guide: {
        id: 'guide-001',
        name: '小美',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        bio: '專業台北導遊，擁有5年導覽經驗，熱愛分享台北的歷史與文化',
        location: '台北市',
        languages: ['中文', '英文'],
        specialties: ['歷史文化', '美食導覽', '攝影指導'],
        experienceYears: 5
      },
      reviews: generateMockReviews()
    };

    return Response.json({ 
      success: true, 
      data: mockService, 
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