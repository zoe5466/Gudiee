import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/services/suggestions - 搜尋建議和自動完成
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, services, locations, categories
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return successResponse({
        suggestions: [],
        popular: await getPopularSuggestions()
      });
    }

    const suggestions: any[] = [];

    // 服務建議
    if (type === 'all' || type === 'services') {
      const services = await prisma.service.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
          images: true,
          guide: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      });

      suggestions.push(...services.map(service => ({
        id: service.id,
        type: 'service',
        title: service.title,
        subtitle: `${service.location} • ${service.guide.name}`,
        price: service.price,
        image: service.images[0] || null,
        reviewCount: service._count.reviews,
        url: `/services/${service.id}`
      })));
    }

    // 地點建議
    if (type === 'all' || type === 'locations') {
      const locations = await prisma.service.groupBy({
        by: ['location'],
        where: {
          status: 'ACTIVE',
          location: { contains: query, mode: 'insensitive' }
        },
        _count: {
          location: true
        },
        orderBy: {
          _count: {
            location: 'desc'
          }
        },
        take: Math.min(limit, 5)
      });

      suggestions.push(...locations.map(location => ({
        type: 'location',
        title: location.location,
        subtitle: `${location._count.location} 個服務`,
        count: location._count.location,
        url: `/search?location=${encodeURIComponent(location.location)}`
      })));
    }

    // 分類建議
    if (type === 'all' || type === 'categories') {
      const categories = await prisma.serviceCategory.findMany({
        where: {
          isActive: true,
          name: { contains: query, mode: 'insensitive' }
        },
        include: {
          _count: {
            select: {
              services: true
            }
          }
        },
        take: Math.min(limit, 5),
        orderBy: {
          services: {
            _count: 'desc'
          }
        }
      });

      suggestions.push(...categories.map(category => ({
        type: 'category',
        title: category.name,
        subtitle: `${category._count.services} 個服務`,
        count: category._count.services,
        url: `/search?category=${category.slug}`
      })));
    }

    // 嚮導建議
    if (type === 'all' || type === 'guides') {
      const guides = await prisma.user.findMany({
        where: {
          role: 'GUIDE',
          name: { contains: query, mode: 'insensitive' }
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          userProfile: {
            select: {
              location: true,
              languages: true,
              specialties: true
            }
          },
          _count: {
            select: {
              guidedServices: true,
              reviewsAsGuide: true
            }
          }
        },
        take: Math.min(limit, 5),
        orderBy: {
          guidedServices: {
            _count: 'desc'
          }
        }
      });

      suggestions.push(...guides.map(guide => ({
        type: 'guide',
        title: guide.name,
        subtitle: `${guide._count.guidedServices} 個服務 • ${guide._count.reviewsAsGuide} 則評論`,
        avatar: guide.avatar,
        location: guide.userProfile?.location,
        languages: guide.userProfile?.languages || [],
        specialties: guide.userProfile?.specialties || [],
        url: `/guides/${guide.id}`
      })));
    }

    // 根據相關性排序
    suggestions.sort((a, b) => {
      const aRelevance = calculateRelevance(query, a.title);
      const bRelevance = calculateRelevance(query, b.title);
      return bRelevance - aRelevance;
    });

    return successResponse({
      suggestions: suggestions.slice(0, limit),
      query,
      total: suggestions.length
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    return errorResponse('取得建議失敗', 500);
  }
}

// 計算相關性分數
function calculateRelevance(query: string, title: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // 完全匹配得最高分
  if (titleLower === queryLower) return 100;
  
  // 開頭匹配得高分
  if (titleLower.startsWith(queryLower)) return 80;
  
  // 包含匹配得中等分
  if (titleLower.includes(queryLower)) return 60;
  
  // 模糊匹配得低分
  let score = 0;
  const queryChars = queryLower.split('');
  let lastIndex = -1;
  
  for (const char of queryChars) {
    const index = titleLower.indexOf(char, lastIndex + 1);
    if (index > lastIndex) {
      score += 1;
      lastIndex = index;
    }
  }
  
  return Math.min(score / queryChars.length * 40, 40);
}

// 取得熱門建議
async function getPopularSuggestions() {
  try {
    const [popularServices, popularLocations, popularCategories] = await Promise.all([
      // 熱門服務
      prisma.service.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
          images: true,
          _count: {
            select: {
              bookings: true,
              reviews: true
            }
          }
        },
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // 熱門地點
      prisma.service.groupBy({
        by: ['location'],
        where: { status: 'ACTIVE' },
        _count: {
          location: true
        },
        orderBy: {
          _count: {
            location: 'desc'
          }
        },
        take: 3
      }),
      
      // 熱門分類
      prisma.serviceCategory.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              services: true
            }
          }
        },
        orderBy: {
          services: {
            _count: 'desc'
          }
        },
        take: 3
      })
    ]);

    return {
      services: popularServices.map(service => ({
        type: 'service',
        title: service.title,
        subtitle: service.location,
        bookingCount: service._count.bookings,
        reviewCount: service._count.reviews,
        url: `/services/${service.id}`
      })),
      locations: popularLocations.map(location => ({
        type: 'location',
        title: location.location,
        count: location._count.location,
        url: `/search?location=${encodeURIComponent(location.location)}`
      })),
      categories: popularCategories.map(category => ({
        type: 'category',
        title: category.name,
        count: category._count.services,
        url: `/search?category=${category.slug}`
      }))
    };
  } catch (error) {
    console.error('Get popular suggestions error:', error);
    return {
      services: [],
      locations: [],
      categories: []
    };
  }
}