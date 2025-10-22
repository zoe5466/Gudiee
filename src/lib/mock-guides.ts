// 導遊模擬數據存儲
// 功能：為開發階段提供導遊相關的模擬數據

export interface MockGuide {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location: string;
  languages: string[];
  specialties: string[];
  experienceYears: number;
  certifications: string[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  memberSince: string;
  verifications: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    profile: boolean;
  };
  stats: {
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    totalEarnings: number;
    monthlyBookings: number;
    monthlyEarnings: number;
    activeServices: number;
    responseRate: number;
    responseTime: number; // 小時
  };
  ratingDistribution: Record<number, number>;
  services: MockGuideService[];
  recentReviews: MockReview[];
}

export interface MockGuideService {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // 小時
  maxParticipants: number;
  category: {
    id: string;
    name: string;
  };
  location: string;
  highlights: string[];
  includes: string[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface MockReview {
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
  service: {
    id: string;
    title: string;
  };
}

// 生成模擬導遊數據
const mockGuides: MockGuide[] = [
  {
    id: 'guide-001',
    name: '王小美',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bio: '我是一位專業的台北在地導遊，擁有5年豐富的導覽經驗。精通中、英、日三種語言，特別擅長文化交流和歷史解說。我熱愛分享台北的美食、文化和隱藏景點，讓每位旅客都能深度體驗台北的魅力。',
    location: '台北市',
    languages: ['中文', '英文', '日文'],
    specialties: ['文化導覽', '美食體驗', '歷史解說', '攝影指導'],
    experienceYears: 5,
    certifications: ['專業導遊證照', '急救證照', '日語檢定N1'],
    socialLinks: {
      instagram: 'https://instagram.com/taipei_guide_amy',
      facebook: 'https://facebook.com/amytaipeiguide'
    },
    memberSince: '2019-03-15T10:00:00Z',
    verifications: {
      email: true,
      phone: true,
      identity: true,
      profile: true
    },
    stats: {
      averageRating: 4.9,
      totalReviews: 156,
      totalBookings: 203,
      totalEarnings: 580000,
      monthlyBookings: 18,
      monthlyEarnings: 42000,
      activeServices: 6,
      responseRate: 98,
      responseTime: 1
    },
    ratingDistribution: {
      5: 142,
      4: 12,
      3: 2,
      2: 0,
      1: 0
    },
    services: [
      {
        id: 'service-001',
        title: '台北101 & 信義商圈深度導覽',
        description: '專業導遊帶您深度探索台北101和信義商圈，體驗現代台北的繁華魅力。',
        price: 2800,
        duration: 4,
        maxParticipants: 8,
        category: {
          id: 'sightseeing',
          name: '觀光導覽'
        },
        location: '台北市信義區',
        highlights: [
          '登上台北101觀景台',
          '信義商圈購物指南',
          '在地美食推薦',
          '最佳拍照景點'
        ],
        includes: [
          '專業導遊服務',
          '台北101門票',
          '交通安排',
          '小點心'
        ],
        averageRating: 4.8,
        totalReviews: 45,
        totalBookings: 67,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600'
        ],
        status: 'ACTIVE',
        createdAt: '2023-01-15T09:00:00Z'
      },
      {
        id: 'service-002',
        title: '夜市美食文化體驗',
        description: '跟隨在地導遊探索台北最道地的夜市文化，品嚐經典小吃。',
        price: 1800,
        duration: 3,
        maxParticipants: 6,
        category: {
          id: 'food',
          name: '美食體驗'
        },
        location: '台北市各大夜市',
        highlights: [
          '經典夜市小吃',
          '在地人推薦美食',
          '夜市文化解說',
          '拍照留念'
        ],
        includes: [
          '專業導遊服務',
          '美食品嚐費用',
          '文化解說',
          '夜市地圖'
        ],
        averageRating: 4.9,
        totalReviews: 78,
        totalBookings: 92,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600'
        ],
        status: 'ACTIVE',
        createdAt: '2023-02-20T14:00:00Z'
      }
    ],
    recentReviews: [
      {
        id: 'review-001',
        rating: 5,
        comment: '王導遊非常專業，日語很流利，帶我們體驗了很多道地的台北文化。強烈推薦！',
        createdAt: '2024-01-15T16:30:00Z',
        isAnonymous: false,
        reviewer: {
          id: 'user-001',
          name: '田中太郎',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        service: {
          id: 'service-001',
          title: '台北101 & 信義商圈深度導覽'
        }
      },
      {
        id: 'review-002',
        rating: 5,
        comment: 'Amazing experience! Amy is so knowledgeable and friendly. The food tour was incredible!',
        createdAt: '2024-01-10T20:15:00Z',
        isAnonymous: false,
        reviewer: {
          id: 'user-002',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        service: {
          id: 'service-002',
          title: '夜市美食文化體驗'
        }
      }
    ]
  },
  {
    id: 'guide-002',
    name: '李大明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: '高雄在地導遊，專精於港區文化和藝術導覽。擁有8年導遊經驗，熟悉高雄的歷史變遷和現代發展。特別擅長韓語交流，曾接待過眾多韓國旅客，獲得一致好評。',
    location: '高雄市',
    languages: ['中文', '韓文', '英文'],
    specialties: ['港區導覽', '藝術文化', '歷史解說', '韓語交流'],
    experienceYears: 8,
    certifications: ['專業導遊證照', '韓語檢定TOPIK 6級', '藝術導覽認證'],
    socialLinks: {
      instagram: 'https://instagram.com/kaohsiung_guide_ming',
      website: 'https://kaohsiungguide.com'
    },
    memberSince: '2016-08-20T12:00:00Z',
    verifications: {
      email: true,
      phone: true,
      identity: true,
      profile: true
    },
    stats: {
      averageRating: 4.8,
      totalReviews: 134,
      totalBookings: 187,
      totalEarnings: 450000,
      monthlyBookings: 15,
      monthlyEarnings: 35000,
      activeServices: 4,
      responseRate: 96,
      responseTime: 2
    },
    ratingDistribution: {
      5: 118,
      4: 14,
      3: 2,
      2: 0,
      1: 0
    },
    services: [
      {
        id: 'service-003',
        title: '高雄港區文化巡禮',
        description: '深度探索高雄港區的歷史變遷，從傳統漁港到現代都市的精彩轉變。',
        price: 3200,
        duration: 6,
        maxParticipants: 10,
        category: {
          id: 'culture',
          name: '文化體驗'
        },
        location: '高雄市鹽埕區',
        highlights: [
          '駁二藝術特區',
          '高雄港歷史',
          '在地文化故事',
          '藝術作品欣賞'
        ],
        includes: [
          '專業導遊服務',
          '交通安排',
          '文化解說',
          '紀念品'
        ],
        averageRating: 4.9,
        totalReviews: 67,
        totalBookings: 89,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600'
        ],
        status: 'ACTIVE',
        createdAt: '2023-05-10T11:00:00Z'
      }
    ],
    recentReviews: [
      {
        id: 'review-003',
        rating: 5,
        comment: '이대명 가이드님 정말 친절하시고 한국어도 완벽해요! 가오슝의 역사를 자세히 알 수 있었습니다.',
        createdAt: '2024-01-12T14:20:00Z',
        isAnonymous: false,
        reviewer: {
          id: 'user-003',
          name: '김민수',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        service: {
          id: 'service-003',
          title: '高雄港區文化巡禮'
        }
      }
    ]
  },
  {
    id: 'guide-003',
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: '台中專業英語導遊，曾在國外居住多年，擁有豐富的國際交流經驗。專精於客製化行程規劃，特別擅長為外國旅客介紹台灣的自然美景和人文風情。',
    location: '台中市',
    languages: ['中文', '英文', '西班牙文'],
    specialties: ['自然導覽', '客製行程', '國際交流', '攝影指導'],
    experienceYears: 6,
    certifications: ['專業導遊證照', 'TESOL英語教學證照', '自然生態解說員'],
    socialLinks: {
      instagram: 'https://instagram.com/emily_taiwan_guide',
      facebook: 'https://facebook.com/emilytaichungguide'
    },
    memberSince: '2018-11-05T15:30:00Z',
    verifications: {
      email: true,
      phone: true,
      identity: true,
      profile: true
    },
    stats: {
      averageRating: 4.7,
      totalReviews: 89,
      totalBookings: 124,
      totalEarnings: 320000,
      monthlyBookings: 12,
      monthlyEarnings: 28000,
      activeServices: 3,
      responseRate: 94,
      responseTime: 3
    },
    ratingDistribution: {
      5: 76,
      4: 11,
      3: 2,
      2: 0,
      1: 0
    },
    services: [],
    recentReviews: []
  }
];

// 導遊存儲類別
class GuideStorage {
  private storageKey = 'guidee-mock-guides';
  private guides: MockGuide[] = [];

  constructor() {
    this.loadGuides();
  }

  // 從 localStorage 載入導遊數據
  private loadGuides(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.guides = JSON.parse(stored);
        } else {
          // 如果沒有存儲數據，使用預設數據
          this.guides = mockGuides;
          this.saveGuides();
        }
      } catch (error) {
        console.error('Failed to load guides from localStorage:', error);
        this.guides = mockGuides;
      }
    } else {
      // SSR 環境使用預設數據
      this.guides = mockGuides;
    }
  }

  // 保存導遊數據到 localStorage
  private saveGuides(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.guides));
      } catch (error) {
        console.error('Failed to save guides to localStorage:', error);
      }
    }
  }

  // 獲取所有導遊
  getAll(): MockGuide[] {
    return this.guides;
  }

  // 根據ID獲取導遊
  getById(id: string): MockGuide | null {
    return this.guides.find(guide => guide.id === id) || null;
  }

  // 搜尋導遊
  search(filters: {
    query?: string;
    location?: string;
    languages?: string[];
    specialties?: string[];
    minRating?: number;
    sortBy?: 'newest' | 'rating' | 'experience' | 'price';
  }): MockGuide[] {
    let results = this.guides;

    // 關鍵字搜尋
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(guide => 
        guide.name.toLowerCase().includes(query) ||
        guide.bio?.toLowerCase().includes(query) ||
        guide.specialties.some(specialty => specialty.toLowerCase().includes(query))
      );
    }

    // 地點篩選
    if (filters.location) {
      results = results.filter(guide => 
        guide.location.includes(filters.location!)
      );
    }

    // 語言篩選
    if (filters.languages && filters.languages.length > 0) {
      results = results.filter(guide => 
        filters.languages!.some(lang => 
          guide.languages.some(guideLang => 
            guideLang.toLowerCase().includes(lang.toLowerCase())
          )
        )
      );
    }

    // 專業領域篩選
    if (filters.specialties && filters.specialties.length > 0) {
      results = results.filter(guide => 
        filters.specialties!.some(specialty => 
          guide.specialties.some(guideSpecialty => 
            guideSpecialty.toLowerCase().includes(specialty.toLowerCase())
          )
        )
      );
    }

    // 評分篩選
    if (filters.minRating) {
      results = results.filter(guide => guide.stats.averageRating >= filters.minRating!);
    }

    // 排序
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime();
          case 'rating':
            return b.stats.averageRating - a.stats.averageRating;
          case 'experience':
            return b.experienceYears - a.experienceYears;
          case 'price':
            const aMinPrice = Math.min(...a.services.map(s => s.price));
            const bMinPrice = Math.min(...b.services.map(s => s.price));
            return aMinPrice - bMinPrice;
          default:
            return 0;
        }
      });
    }

    return results;
  }

  // 添加導遊
  add(guide: Omit<MockGuide, 'id' | 'memberSince'>): MockGuide {
    const newGuide: MockGuide = {
      ...guide,
      id: `guide-${Date.now()}`,
      memberSince: new Date().toISOString()
    };
    this.guides.push(newGuide);
    this.saveGuides();
    return newGuide;
  }

  // 更新導遊
  update(id: string, updates: Partial<Omit<MockGuide, 'id'>>): MockGuide | null {
    const index = this.guides.findIndex(guide => guide.id === id);
    if (index === -1) return null;

    this.guides[index] = { ...this.guides[index], ...updates };
    this.saveGuides();
    return this.guides[index];
  }

  // 刪除導遊
  delete(id: string): boolean {
    const index = this.guides.findIndex(guide => guide.id === id);
    if (index === -1) return false;

    this.guides.splice(index, 1);
    this.saveGuides();
    return true;
  }
}

// 導出全局實例
export const guideStorage = new GuideStorage();