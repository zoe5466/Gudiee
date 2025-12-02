import { NextRequest } from 'next/server';
import { guideStorage } from '@/lib/mock-guides';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/guides - 取得嚮導列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 搜尋和篩選參數
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const language = searchParams.get('language') || '';
    const specialty = searchParams.get('specialty') || '';
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 建立篩選條件
    const filters: {
      query?: string;
      location?: string;
      languages?: string[];
      specialties?: string[];
      minRating?: number;
      sortBy?: 'newest' | 'rating' | 'experience' | 'price';
    } = {};

    if (query) filters.query = query;
    if (location) filters.location = location;
    if (language) filters.languages = [language];
    if (specialty) filters.specialties = [specialty];
    if (minRating) filters.minRating = parseFloat(minRating);
    if (sortBy) filters.sortBy = sortBy as any;

    // 從模擬資料中搜尋導遊
    const allGuides = guideStorage.search(filters);
    
    // 轉換為 GuidesList 組件期待的格式
    const transformedGuides = allGuides.map(guide => ({
      id: guide.id,
      name: guide.name,
      avatar: guide.avatar,
      userProfile: {
        bio: guide.bio,
        location: guide.location,
        languages: guide.languages,
        specialties: guide.specialties,
        experienceYears: guide.experienceYears
      },
      stats: guide.stats,
      guidedServices: guide.services.map(service => ({
        id: service.id,
        title: service.title,
        price: service.price,
        location: service.location,
        images: service.images
      }))
    }));
    
    // 分頁處理
    const skip = (page - 1) * limit;
    const paginatedGuides = transformedGuides.slice(skip, skip + limit);
    const total = transformedGuides.length;

    // 生成篩選統計（基於所有導遊數據）
    const allGuidesData = guideStorage.getAll();
    
    // 地點統計
    const locationStats = allGuidesData.reduce((acc, guide) => {
      const location = guide.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const locationStatsArray = Object.entries(locationStats)
      .map(([location, count]) => ({ location, _count: { location: count } }))
      .sort((a, b) => b._count.location - a._count.location)
      .slice(0, 10);

    // 語言統計
    const languageStats = allGuidesData.reduce((acc, guide) => {
      guide.languages.forEach(lang => {
        acc[lang] = (acc[lang] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const languageStatsArray = Object.entries(languageStats)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 專業領域統計
    const specialtyStats = allGuidesData.reduce((acc, guide) => {
      guide.specialties.forEach(specialty => {
        acc[specialty] = (acc[specialty] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const specialtyStatsArray = Object.entries(specialtyStats)
      .map(([specialty, count]) => ({ specialty, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return successResponse({
      guides: paginatedGuides,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        locations: locationStatsArray,
        languages: languageStatsArray.map(item => item.language),
        specialties: specialtyStatsArray.map(item => item.specialty)
      },
      searchParams: {
        query,
        location,
        language,
        specialty,
        minRating,
        sortBy
      }
    });

  } catch (error) {
    console.error('Get guides error:', error);
    return errorResponse('取得嚮導列表失敗', 500);
  }
}