import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createApiResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'admin')) {
      return NextResponse.json(
        createApiResponse(null, false, '無權限訪問', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    // 獲取所有地陪資料
    const guides = await prisma.user.findMany({
      where: {
        role: 'GUIDE'
      },
      include: {
        userProfile: true,
        _count: {
          select: {
            services: true,
            bookings: true,
            reviews: true
          }
        },
        services: {
          where: {
            status: 'ACTIVE'
          }
        },
        bookings: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            totalAmount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 格式化地陪數據
    const formattedGuides = await Promise.all(guides.map(async (guide) => {
      // 計算平均評分
      const avgRating = await prisma.review.aggregate({
        where: {
          service: {
            guideId: guide.id
          }
        },
        _avg: {
          rating: true
        }
      })

      // 計算總收入
      const totalEarnings = guide.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)

      return {
        id: guide.id,
        email: guide.email,
        name: guide.name,
        isEmailVerified: guide.isEmailVerified,
        isKycVerified: guide.isKycVerified,
        createdAt: guide.createdAt,
        lastLoginAt: guide.lastLoginAt,
        status: guide.status || 'ACTIVE', // 假設默認狀態是活躍
        userProfile: guide.userProfile ? {
          name: guide.userProfile.name,
          bio: guide.userProfile.bio,
          location: guide.userProfile.location,
          languages: guide.userProfile.languages,
          specialties: guide.userProfile.specialties,
          experienceYears: guide.userProfile.experienceYears,
          certifications: guide.userProfile.certifications,
          profileImage: guide.userProfile.profileImage
        } : null,
        stats: {
          servicesCount: guide._count.services,
          bookingsCount: guide._count.bookings,
          reviewsCount: guide._count.reviews,
          totalEarnings: totalEarnings,
          averageRating: avgRating._avg.rating || 0
        }
      }
    }))

    return NextResponse.json(formattedGuides)

  } catch (error) {
    console.error('Guides API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '獲取地陪列表失敗', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}