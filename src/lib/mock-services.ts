// 服務模擬數據存儲
// 功能：為開發階段提供服務相關的模擬數據

export interface MockService {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  location: string;
  duration: number;
  maxGuests: number;
  minGuests?: number;
  images: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  cancellationPolicy?: string;
  category?: { id: string; name: string; };
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  stats: {
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    ratingDistribution: Record<number, number>;
  };
  availability: {
    availableDates: string[];
    bookedDates: string[];
  };
  guide: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    location?: string;
    languages: string[];
    specialties: string[];
    experienceYears?: number;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    isAnonymous: boolean;
    reviewer?: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

// 生成可用日期
function generateAvailableDates(): string[] {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// 生成模擬評論
function generateMockReviews(serviceId: string) {
  const reviewTemplates = [
    {
      rating: 5,
      comment: '導遊非常專業，帶我們深度了解當地歷史和文化，還推薦了很多在地美食，非常推薦！',
      reviewer: { name: '王小明', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
    },
    {
      rating: 4,
      comment: '行程安排得很好，時間掌控也很棒。景色真的很震撼！',
      reviewer: { name: '李小華', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }
    },
    {
      rating: 5,
      comment: '超棒的體驗！導遊很風趣，讓整個行程很有趣。下次還會再參加。',
      reviewer: { name: '張美麗', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
    }
  ];

  return reviewTemplates.map((template, index) => ({
    id: `review-${serviceId}-${index + 1}`,
    rating: template.rating,
    comment: template.comment,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    isAnonymous: false,
    reviewer: {
      id: `user-${index + 1}`,
      name: template.reviewer.name,
      avatar: template.reviewer.avatar
    }
  }));
}

// 模擬服務數據
const mockServices: MockService[] = [
  {
    id: 'c1234567-1234-4567-8901-123456789001',
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
    category: { id: 'city-tour', name: '城市導覽' },
    status: 'ACTIVE',
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
    reviews: generateMockReviews('c1234567-1234-4567-8901-123456789001'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c1234567-1234-4567-8901-123456789002',
    title: '九份老街 & 金瓜石文化之旅',
    description: '體驗台灣最美山城，品嚐道地小吃，了解採礦歷史文化，欣賞絕美海景。深度探索九份的歷史故事與金瓜石的採礦遺址。',
    shortDescription: '體驗台灣最美山城，品嚐道地小吃，了解採礦歷史文化',
    price: 2800,
    location: '新北市瑞芳區',
    duration: 8,
    maxGuests: 4,
    minGuests: 1,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop'
    ],
    highlights: [
      '漫步九份老街，品嚐傳統小吃',
      '參觀金瓜石採礦博物館',
      '欣賞山海絕美景色',
      '了解台灣採礦歷史',
      '體驗山城慢活文化'
    ],
    included: ['專業導遊服務', '交通接送', '博物館門票', '小吃品嚐'],
    excluded: ['個人消費', '額外餐費', '紀念品購買'],
    cancellationPolicy: '48小時前免費取消',
    category: { id: 'culture-tour', name: '文化導覽' },
    status: 'ACTIVE',
    stats: {
      averageRating: 4.8,
      totalReviews: 89,
      totalBookings: 67,
      ratingDistribution: { 1: 0, 2: 0, 3: 8, 4: 25, 5: 56 }
    },
    availability: {
      availableDates: generateAvailableDates(),
      bookedDates: []
    },
    guide: {
      id: 'guide-002',
      name: '阿明',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: '在地九份導遊，熟悉山城歷史與文化，專精採礦歷史解說',
      location: '新北市瑞芳區',
      languages: ['中文', '台語'],
      specialties: ['歷史文化', '山城導覽', '攝影景點'],
      experienceYears: 8
    },
    reviews: generateMockReviews('c1234567-1234-4567-8901-123456789002'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c1234567-1234-4567-8901-123456789003',
    title: '台南古城文化巡禮',
    description: '深度探索府城台南，走訪古蹟廟宇，品嚐正宗台南小吃，感受濃厚的歷史氛圍。從赤崁樓到安平古堡，體驗台南400年的歷史文化。',
    shortDescription: '深度探索府城台南，走訪古蹟廟宇，品嚐正宗台南小吃',
    price: 1500,
    location: '台南市中西區',
    duration: 6,
    maxGuests: 8,
    minGuests: 1,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1580500550469-ffacbf98c4bf?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'
    ],
    highlights: [
      '參觀赤崁樓等歷史古蹟',
      '品嚐道地台南小吃',
      '漫步安平老街',
      '了解台南歷史文化',
      '體驗府城生活步調'
    ],
    included: ['專業導遊服務', '古蹟門票', '小吃導覽', '文化解說'],
    excluded: ['交通費用', '個人消費', '額外餐費'],
    cancellationPolicy: '24小時前免費取消',
    category: { id: 'heritage-tour', name: '古蹟巡禮' },
    status: 'ACTIVE',
    stats: {
      averageRating: 4.9,
      totalReviews: 156,
      totalBookings: 123,
      ratingDistribution: { 1: 0, 2: 1, 3: 7, 4: 38, 5: 110 }
    },
    availability: {
      availableDates: generateAvailableDates(),
      bookedDates: []
    },
    guide: {
      id: 'guide-003',
      name: '小花',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: '台南在地人，深愛府城文化，專精古蹟歷史與美食導覽',
      location: '台南市',
      languages: ['中文', '台語', '英文'],
      specialties: ['古蹟導覽', '美食探索', '歷史解說'],
      experienceYears: 6
    },
    reviews: generateMockReviews('c1234567-1234-4567-8901-123456789003'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c1234567-1234-4567-8901-123456789004',
    title: '花蓮太魯閣秘境探索',
    description: '專業登山嚮導帶領，探索太魯閣國家公園絕美峽谷，體驗原住民文化。深入峽谷秘境，感受大自然的震撼力量。',
    shortDescription: '探索太魯閣國家公園絕美峽谷，體驗原住民文化',
    price: 3500,
    location: '花蓮縣秀林鄉',
    duration: 10,
    maxGuests: 6,
    minGuests: 2,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'
    ],
    highlights: [
      '太魯閣峽谷深度探索',
      '原住民文化體驗',
      '專業登山嚮導帶領',
      '絕美自然景觀',
      '戶外冒險體驗'
    ],
    included: ['專業嚮導服務', '安全裝備', '國家公園門票', '原住民文化體驗', '午餐'],
    excluded: ['住宿費用', '個人保險', '額外消費'],
    cancellationPolicy: '72小時前免費取消',
    category: { id: 'adventure-tour', name: '冒險體驗' },
    status: 'ACTIVE',
    stats: {
      averageRating: 4.7,
      totalReviews: 73,
      totalBookings: 45,
      ratingDistribution: { 1: 0, 2: 2, 3: 5, 4: 22, 5: 44 }
    },
    availability: {
      availableDates: generateAvailableDates(),
      bookedDates: []
    },
    guide: {
      id: 'guide-004',
      name: '原住民嚮導 阿勇',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: '太魯閣族原住民，專業登山嚮導，熟悉當地地形與文化',
      location: '花蓮縣',
      languages: ['中文', '太魯閣語', '英文'],
      specialties: ['登山健行', '原住民文化', '自然生態'],
      experienceYears: 12
    },
    reviews: generateMockReviews('c1234567-1234-4567-8901-123456789004'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 服務存儲類
class ServiceStorage {
  private services: MockService[] = [...mockServices];

  // 獲取所有服務
  getAll(): MockService[] {
    return this.services.filter(service => service.status === 'ACTIVE');
  }

  // 根據ID獲取服務
  getById(id: string): MockService | null {
    return this.services.find(service => service.id === id) || null;
  }

  // 搜尋服務
  search(filters: {
    query?: string;
    location?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    minRating?: number;
    sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
  }): MockService[] {
    let results = this.getAll();

    // 關鍵字搜尋
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(service => 
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.location.toLowerCase().includes(query) ||
        service.guide.name.toLowerCase().includes(query)
      );
    }

    // 地點篩選
    if (filters.location) {
      results = results.filter(service => 
        service.location.includes(filters.location!)
      );
    }

    // 分類篩選
    if (filters.category) {
      results = results.filter(service => 
        service.category?.name === filters.category
      );
    }

    // 價格範圍
    if (filters.priceMin !== undefined) {
      results = results.filter(service => service.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      results = results.filter(service => service.price <= filters.priceMax!);
    }

    // 評分篩選
    if (filters.minRating !== undefined) {
      results = results.filter(service => service.stats.averageRating >= filters.minRating!);
    }

    // 排序
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          case 'rating':
            return b.stats.averageRating - a.stats.averageRating;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
    }

    return results;
  }

  // 添加服務
  add(service: Omit<MockService, 'id' | 'createdAt' | 'updatedAt'>): MockService {
    const newService: MockService = {
      ...service,
      id: `service-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.services.push(newService);
    return newService;
  }

  // 更新服務
  update(id: string, updates: Partial<MockService>): MockService | null {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) return null;

    this.services[index] = {
      ...this.services[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.services[index];
  }

  // 刪除服務
  delete(id: string): boolean {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) return false;

    this.services.splice(index, 1);
    return true;
  }
}

// 導出單例實例
export const serviceStorage = new ServiceStorage();