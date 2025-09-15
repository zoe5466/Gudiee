import { NextRequest, NextResponse } from 'next/server';

// 模擬搜尋建議數據
const mockSuggestions = [
  {
    type: 'service',
    title: '台北101 & 信義區深度導覽',
    subtitle: '台北市信義區 - NT$ 1200',
    url: '/services/1',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
  },
  {
    type: 'service',
    title: '九份老街文化巡禮',
    subtitle: '新北市瑞芳區 - NT$ 2800',
    url: '/services/2',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
  },
  {
    type: 'location',
    title: '台北市',
    subtitle: '25+ 個活動',
    url: '/search?location=taipei',
    count: 25
  },
  {
    type: 'location',
    title: '台南市',
    subtitle: '18+ 個活動',
    url: '/search?location=tainan',
    count: 18
  },
  {
    type: 'category',
    title: '文化導覽',
    subtitle: '歷史古蹟巡禮',
    url: '/search?category=culture',
    count: 12
  },
  {
    type: 'category',
    title: '美食體驗',
    subtitle: '在地小吃探索',
    url: '/search?category=food',
    count: 20
  },
  {
    type: 'guide',
    title: '小美導遊',
    subtitle: '台北文化專家 - 4.9★',
    url: '/guides/xiaomei',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    type: 'guide',
    title: '阿明導遊',
    subtitle: '山城嚮導 - 4.8★',
    url: '/guides/aming',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];

const popularSuggestions = [
  {
    type: 'service',
    title: '台北101觀景台',
    subtitle: '熱門景點',
    url: '/search?q=台北101',
    count: 156
  },
  {
    type: 'service',
    title: '九份老街',
    subtitle: '經典路線',
    url: '/search?q=九份',
    count: 89
  },
  {
    type: 'category',
    title: '夜市美食',
    subtitle: '台灣特色',
    url: '/search?category=night-market',
    count: 45
  }
];

// GET /api/services/suggestions - 搜尋建議和自動完成
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          suggestions: [],
          popular: popularSuggestions.slice(0, limit)
        }
      });
    }

    // 過濾建議
    let filteredSuggestions = mockSuggestions.filter(suggestion => {
      const matchesQuery = suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
                          (suggestion.subtitle && suggestion.subtitle.toLowerCase().includes(query.toLowerCase()));
      
      if (type === 'all') return matchesQuery;
      return matchesQuery && suggestion.type === type;
    });

    // 限制數量
    filteredSuggestions = filteredSuggestions.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        suggestions: filteredSuggestions,
        popular: query.length < 3 ? popularSuggestions.slice(0, 3) : []
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({
      success: false,
      error: '搜尋建議獲取失敗'
    }, { status: 500 });
  }
}