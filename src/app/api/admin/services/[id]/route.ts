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
    if (!user || (user.role !== 'GUIDE')) {
      return NextResponse.json(
        createApiResponse(null, false, '無權限訪問', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    const { id } = params

    // 獲取服務詳細資料
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        guide: {
          include: {
            userProfile: true
          }
        },
        bookings: {
          include: {
            traveler: {
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
            reviewer: {
              include: {
                userProfile: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        createApiResponse(null, false, '服務不存在', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    // 計算統計數據
    const stats = {
      totalBookings: service.bookings.length,
      totalRevenue: service.bookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + Number(b.totalAmount), 0),
      averageRating: service.reviews.length > 0
        ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
        : 0,
      totalReviews: service.reviews.length
    }

    const formattedService = {
      ...service,
      stats,
      recentBookings: service.bookings.map(booking => ({
        id: booking.id,
        travelerName: booking.traveler.name || booking.traveler.email || '未知',
        bookingDate: booking.bookingDate,
        guests: booking.guests,
        totalAmount: booking.totalAmount,
        status: booking.status,
        createdAt: booking.createdAt
      })),
      reviews: service.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewerName: review.reviewer.name || review.reviewer.email || '匿名',
        createdAt: review.createdAt,
        photos: review.photos
      }))
    }

    return NextResponse.json(formattedService)

  } catch (error) {
    console.error('Service detail API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '獲取服務詳情失敗', 'INTERNAL_ERROR'),
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
    if (!user || (user.role !== 'GUIDE')) {
      return NextResponse.json(
        createApiResponse(null, false, '無權限訪問', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { action, reason } = body

    let updateData: any = {}
    let message = ''

    // 根據動作執行不同操作
    switch (action) {
      case 'approve':
        updateData = {
          status: 'ACTIVE',
          reviewedAt: new Date(),
          reviewedBy: user.id
        }
        message = '服務已通過審核'
        break

      case 'reject':
        updateData = {
          status: 'REJECTED',
          reviewedAt: new Date(),
          reviewedBy: user.id,
          rejectionReason: reason
        }
        message = '服務已被拒絕'
        break

      case 'suspend':
        updateData = {
          status: 'SUSPENDED',
          suspendedAt: new Date(),
          suspendedBy: user.id,
          suspensionReason: reason
        }
        message = '服務已被暫停'
        break

      case 'activate':
        updateData = {
          status: 'ACTIVE',
          suspendedAt: null,
          suspendedBy: null,
          suspensionReason: null
        }
        message = '服務已重新啟用'
        break

      default:
        return NextResponse.json(
          createApiResponse(null, false, '無效的操作', 'INVALID_REQUEST'),
          { status: 400 }
        )
    }

    await prisma.service.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(
      createApiResponse(null, true, message)
    )

  } catch (error) {
    console.error('Service action API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '操作失敗', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}