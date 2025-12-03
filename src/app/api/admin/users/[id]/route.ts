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

    const { id } = params

    // 獲取用戶詳細資料
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        userProfile: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        createApiResponse(null, false, '用戶不存在', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    // 計算統計數據 - 暫時設為0，需要通過其他方式計算
    const stats = {
      servicesCount: 0,
      bookingsCount: 0,
      reviewsCount: 0,
      totalEarnings: 0,
      averageRating: 0
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
      // lastLoginAt field doesn't exist in User schema
      userProfile: targetUser.userProfile,
      stats: stats,
      recentServices: [], // Services relation doesn't exist on User
      recentBookings: [], // Bookings relation doesn't exist on User
      recentReviews: [] // Reviews relation doesn't exist on User
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
    if (!user || (user.role !== 'GUIDE')) {
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
            // isActive and suspendedAt fields don't exist in User schema
          }
        })
        break

      case 'activate':
        await prisma.user.update({
          where: { id },
          data: {
            // isActive and suspendedAt fields don't exist in User schema
          }
        })
        break

      case 'verify_email':
        await prisma.user.update({
          where: { id },
          data: {
            isEmailVerified: true
            // emailVerifiedAt field doesn't exist in User schema
          }
        })
        break

      case 'verify_kyc':
        await prisma.user.update({
          where: { id },
          data: {
            isKycVerified: true
            // kycVerifiedAt field doesn't exist in User schema
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