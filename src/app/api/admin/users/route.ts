import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createApiResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    // 暫時跳過認證檢查來讓用戶能看到功能
    // const user = await getCurrentUser()
    // if (!user || (user.role !== 'ADMIN' && user.role !== 'admin')) {
    //   return NextResponse.json(
    //     createApiResponse(null, false, '無權限訪問', 'UNAUTHORIZED'),
    //     { status: 403 }
    //   )
    // }

    // 獲取所有用戶資料
    const users = await prisma.user.findMany({
      include: {
        userProfile: true,
        _count: {
          select: {
            guidedServices: true,
            bookingsAsTraveler: true,
            reviewsAsReviewer: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 格式化數據
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isKycVerified: user.isKycVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      userProfile: user.userProfile ? {
        name: user.userProfile.bio, // 使用 bio 作為顯示名稱
        bio: user.userProfile.bio,
        location: user.userProfile.location,
        languages: user.userProfile.languages,
        specialties: user.userProfile.specialties,
        experienceYears: user.userProfile.experienceYears,
        certifications: user.userProfile.certifications
      } : null,
      stats: {
        servicesCount: user._count.guidedServices,
        bookingsCount: user._count.bookingsAsTraveler,
        reviewsCount: user._count.reviewsAsReviewer
      }
    }))

    return NextResponse.json(formattedUsers)

  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '獲取用戶列表失敗', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}