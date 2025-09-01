import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/guides/[id] - 取得嚮導詳細資料
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guideId = params.id;

    // 查詢嚮導資料
    const guide = await prisma.user.findUnique({
      where: { 
        id: guideId,
        role: 'GUIDE',
        isEmailVerified: true
      },
      include: {
        userProfile: true,
        guidedServices: {
          where: { status: 'ACTIVE' },
          include: {
            category: true,
            reviews: {
              where: { status: 'APPROVED' },
              select: {
                rating: true
              }
            },
            _count: {
              select: {
                bookings: true,
                reviews: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reviewsAsGuide: {
          where: { status: 'APPROVED' },
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            service: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            guidedServices: true,
            reviewsAsGuide: true,
            bookingsAsGuide: true
          }
        }
      }
    });

    if (!guide) {
      return errorResponse('找不到嚮導', 404);
    }

    // 計算統計資料
    const allRatings = guide.reviewsAsGuide.map(r => r.rating);
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
      : 0;

    // 計算評分分布
    const ratingDistribution = [1, 2, 3, 4, 5].reduce((acc, rating) => {
      acc[rating] = allRatings.filter(r => r === rating).length;
      return acc;
    }, {} as Record<number, number>);

    // 計算總預訂數和總收入（模擬）
    const totalBookings = guide._count.bookingsAsGuide;
    const totalEarnings = guide.guidedServices.reduce((sum, service) => 
      sum + (Number(service.price) * (service._count?.bookings || 0)), 0
    );

    // 處理服務資料，計算每個服務的平均評分
    const servicesWithStats = guide.guidedServices.map(service => {
      const serviceRatings = service.reviews.map(r => r.rating);
      const serviceAverageRating = serviceRatings.length > 0 
        ? serviceRatings.reduce((sum, rating) => sum + rating, 0) / serviceRatings.length 
        : 0;

      const { reviews, ...serviceData } = service;
      
      return {
        ...serviceData,
        averageRating: Number(serviceAverageRating.toFixed(1)),
        totalReviews: service._count.reviews,
        totalBookings: service._count.bookings
      };
    });

    // 計算本月統計（模擬）
    const currentDate = new Date();
    const monthlyBookings = Math.floor(totalBookings * 0.15); // 假設本月佔總數的15%
    const monthlyEarnings = Math.floor(totalEarnings * 0.15);

    // 取得嚮導加入時間
    const memberSince = guide.createdAt;
    const experienceMonths = guide.userProfile?.experienceYears 
      ? guide.userProfile.experienceYears * 12 
      : 0;

    // 語言和專業領域處理
    const languages = guide.userProfile?.languages || [];
    const specialties = guide.userProfile?.specialties || [];

    // 認證狀態
    const verifications = {
      email: guide.isEmailVerified,
      phone: !!guide.phone,
      identity: guide.isKycVerified,
      profile: !!guide.userProfile?.bio
    };

    // 建構回應資料
    const guideProfile = {
      id: guide.id,
      name: guide.name,
      avatar: guide.avatar,
      bio: guide.userProfile?.bio,
      location: guide.userProfile?.location,
      languages,
      specialties,
      experienceYears: guide.userProfile?.experienceYears,
      certifications: guide.userProfile?.certifications || [],
      socialLinks: guide.userProfile?.socialLinks || {},
      memberSince,
      verifications,
      stats: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: guide._count.reviewsAsGuide,
        totalBookings,
        totalEarnings,
        monthlyBookings,
        monthlyEarnings,
        activeServices: guide._count.guidedServices,
        responseRate: 95 + Math.floor(Math.random() * 5), // 模擬回覆率
        responseTime: Math.floor(Math.random() * 4) + 1 // 1-4 小時
      },
      ratingDistribution,
      services: servicesWithStats,
      recentReviews: guide.reviewsAsGuide.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        isAnonymous: review.isAnonymous,
        reviewer: review.isAnonymous ? null : review.reviewer,
        service: review.service
      }))
    };

    return successResponse(guideProfile);

  } catch (error) {
    console.error('Get guide profile error:', error);
    return errorResponse('取得嚮導資料失敗', 500);
  }
}