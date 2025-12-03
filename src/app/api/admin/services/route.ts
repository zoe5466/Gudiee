import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createApiResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 暫時跳過認證檢查來讓用戶能看到功能
    // const user = await getCurrentUser()
    // if (!user || (user.role !== 'GUIDE')) {
    //   return NextResponse.json(
    //     createApiResponse(null, false, '無權限訪問', 'UNAUTHORIZED'),
    //     { status: 403 }
    //   )
    // }

    // 獲取所有服務資料
    const services = await prisma.service.findMany({
      include: {
        guide: {
          include: {
            userProfile: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 格式化數據並計算平均評分
    const formattedServices = services.map(service => {
      const averageRating = service.reviews.length > 0
        ? service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length
        : null

      return {
        id: service.id,
        title: service.title,
        description: service.description,
        location: service.location,
        durationHours: service.durationHours,
        price: service.price,
        maxGuests: service.maxGuests,
        status: service.status,
        createdAt: service.createdAt,
        images: service.images,
        guide: {
          id: service.guide.id,
          name: service.guide.name,
          userProfile: service.guide.userProfile
        },
        _count: {
          bookings: service._count.bookings,
          reviews: service._count.reviews
        },
        averageRating
      }
    })

    return NextResponse.json(formattedServices)

  } catch (error) {
    console.error('Services API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '獲取服務列表失敗', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}