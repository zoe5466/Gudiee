import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createApiResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const user = await getCurrentUser()
    if (!user || (user.role !== 'GUIDE')) {
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
        userProfile: true
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

      // 計算總收入 - 暫時設為0，需要通過其他方式計算
      const totalEarnings = 0

      return {
        id: guide.id,
        email: guide.email,
        name: guide.name,
        isEmailVerified: guide.isEmailVerified,
        isKycVerified: guide.isKycVerified,
        createdAt: guide.createdAt,
        // lastLoginAt field doesn't exist in User schema
        // status field doesn't exist in User schema, using default 'ACTIVE'
        userProfile: guide.userProfile ? {
          name: guide.name,
          bio: guide.userProfile.bio,
          location: guide.userProfile.location,
          languages: guide.userProfile.languages,
          specialties: guide.userProfile.specialties,
          experienceYears: guide.userProfile.experienceYears,
          certifications: guide.userProfile.certifications
          // profileImage field doesn't exist in UserProfile schema
        } : null,
        stats: {
          servicesCount: 0, // 需要通過其他方式計算
          bookingsCount: 0, // 需要通過其他方式計算
          reviewsCount: 0, // 需要通過其他方式計算
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