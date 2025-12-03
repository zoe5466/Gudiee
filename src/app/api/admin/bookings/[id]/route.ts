import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createApiResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic';

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

    const bookingId = params.id

    // 獲取訂單詳細資料
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          include: {
            guide: {
              select: {
                id: true,
                name: true,
                email: true,
                userProfile: true
              }
            }
          }
        },
        traveler: {
          select: {
            id: true,
            name: true,
            email: true,
            userProfile: true
          }
        },
        guide: {
          select: {
            id: true,
            name: true,
            email: true,
            userProfile: true
          }
        },
        payments: true,
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
                userProfile: {
                  select: {
                    bio: true,
                    location: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        createApiResponse(null, false, '找不到該訂單', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    return NextResponse.json(booking)

  } catch (error) {
    console.error('Booking detail API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '獲取訂單詳情失敗', 'INTERNAL_ERROR'),
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

    const bookingId = params.id
    const { action, data } = await request.json()

    switch (action) {
      case 'confirm':
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED'
          }
        })
        break

      case 'cancel':
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CANCELLED'
          }
        })
        break

      case 'complete':
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date()
          }
        })
        break

      case 'refund':
        // 處理退款邏輯
        await prisma.$transaction([
          prisma.booking.update({
            where: { id: bookingId },
            data: {
              status: 'CANCELLED'
            }
          }),
          prisma.payment.updateMany({
            where: { bookingId: bookingId },
            data: {
              status: 'REFUNDED',
              refundedAt: new Date()
            }
          })
        ])
        break

      case 'update_payment_status':
        if (data?.paymentStatus) {
          await prisma.payment.updateMany({
            where: { bookingId: bookingId },
            data: {
              status: data.paymentStatus
            }
          })
        }
        break

      case 'add_note':
        if (data?.note) {
          // Note: Booking notes field doesn't exist in schema
          // await prisma.booking.update({
          //   where: { id: bookingId },
          //   data: {
          //     notes: data.note
          //   }
          // })
        }
        break

      default:
        return NextResponse.json(
          createApiResponse(null, false, '無效的操作', 'INVALID_REQUEST'),
          { status: 400 }
        )
    }

    return NextResponse.json(
      createApiResponse({ success: true }, true, '操作成功')
    )

  } catch (error) {
    console.error('Booking action API error:', error)
    return NextResponse.json(
      createApiResponse(null, false, '操作失敗', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}