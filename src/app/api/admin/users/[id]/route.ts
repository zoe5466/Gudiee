import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createApiResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證用戶是否為管理員
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'admin')) {
      return NextResponse.json(
        createApiResponse(null, false, '無權限訪問', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    const { id } = params

    // 獲取用戶詳細資料
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        userProfile: true,
        services: {
          include: {
            _count: {
              select: {
                bookings: true,
                reviews: true
              }
            }
          }
        },
        bookings: {
          include: {
            service: true,
            guide: {
              include: {
                userProfile: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        reviews: {
          include: {
            service: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        createApiResponse(null, false, '用戶不存在', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    // 計算統計數據
    const stats = {
      servicesCount: targetUser.services.length,
      bookingsCount: targetUser.bookings.length,
      reviewsCount: targetUser.reviews.length,
      totalEarnings: targetUser.role === 'GUIDE' ? targetUser.bookings
        .filter(booking => booking.status === 'COMPLETED')
        .reduce((sum, booking) => sum + booking.totalAmount, 0) : 0,
      averageRating: targetUser.reviews.length > 0 
        ? targetUser.reviews.reduce((sum, review) => sum + review.rating, 0) / targetUser.reviews.length
        : 0
    }

    // 格式化數據
    const formattedUser = {
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      isEmailVerified: targetUser.isEmailVerified,
      isKycVerified: targetUser.isKycVerified,
      createdAt: targetUser.createdAt,
      lastLoginAt: targetUser.lastLoginAt,
      userProfile: targetUser.userProfile,
      stats: stats,
      recentServices: targetUser.services.slice(0, 5).map(service => ({
        id: service.id,
        title: service.title,
        status: service.status,
        createdAt: service.createdAt,
        price: service.price
      })),
      recentBookings: targetUser.bookings.slice(0, 5).map(booking => ({
        id: booking.id,
        serviceTitle: booking.service.title,
        bookingDate: booking.bookingDate,
        status: booking.status,
        totalAmount: booking.totalAmount
      })),
      recentReviews: targetUser.reviews.slice(0, 5).map(review => ({
        id: review.id,
        serviceTitle: review.service.title,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }))
    }

    return NextResponse.json(formattedUser)

  } catch (error) {
    console.error('User detail API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '獲取用戶詳情失敗', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證用戶是否為管理員
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'admin')) {
      return NextResponse.json(
        createApiResponse(null, false, '無權限訪問', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { action, data } = body

    // 根據動作執行不同操作
    switch (action) {
      case 'suspend':
        await prisma.user.update({
          where: { id },
          data: {
            isActive: false,
            suspendedAt: new Date()
          }
        })
        break

      case 'activate':
        await prisma.user.update({
          where: { id },
          data: {
            isActive: true,
            suspendedAt: null
          }
        })
        break

      case 'verify_email':
        await prisma.user.update({
          where: { id },
          data: {
            isEmailVerified: true,
            emailVerifiedAt: new Date()
          }
        })
        break

      case 'verify_kyc':
        await prisma.user.update({
          where: { id },
          data: {
            isKycVerified: true,
            kycVerifiedAt: new Date()
          }
        })
        break

      case 'update_role':
        if (data.role) {
          await prisma.user.update({
            where: { id },
            data: {
              role: data.role
            }
          })
        }
        break

      case 'update_permissions':
        if (data.permissions) {
          await prisma.user.update({
            where: { id },
            data: {
              permissions: data.permissions
            }
          })
        }
        break

      default:
        return NextResponse.json(
          createApiResponse(null, false, '無效的操作', 'INVALID_REQUEST'),
          { status: 400 }
        )
    }

    return NextResponse.json(
      createApiResponse(null, true, '操作成功')
    )

  } catch (error) {
    console.error('User action API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '操作失敗', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}