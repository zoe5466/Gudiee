import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - 創建示例預訂資料
export async function POST(request: NextRequest) {
  try {
    // 首先創建一個測試用戶（如果不存在）
    const testUser = await prisma.user.upsert({
      where: { email: 'test-customer@example.com' },
      update: {},
      create: {
        email: 'test-customer@example.com',
        passwordHash: 'hashed_password',
        name: '測試用戶',
        role: 'CUSTOMER',
        userProfile: {
          create: {
            bio: '我是一個測試用戶'
          }
        }
      }
    })

    const testGuide = await prisma.user.upsert({
      where: { email: 'test-guide@example.com' },
      update: {},
      create: {
        email: 'test-guide@example.com',
        passwordHash: 'hashed_password',
        name: '測試地陪',
        role: 'GUIDE',
        userProfile: {
          create: {
            bio: '我是一個專業的地陪',
            location: '台北',
            languages: ['中文', '英文'],
            specialties: ['歷史文化', '美食導覽']
          }
        }
      }
    })

    // 創建一個測試服務（如果不存在）
    let testService = await prisma.service.findFirst({
      where: {
        title: '台北一日遊',
        guideId: testGuide.id
      }
    })
    
    if (!testService) {
      testService = await prisma.service.create({
        data: {
          guideId: testGuide.id,
          title: '台北一日遊',
          description: '探索台北最美的景點和美食',
          location: '台北市',
          price: 2500,
          durationHours: 8,
          maxGuests: 6,
          images: ['https://example.com/image1.jpg'],
          highlights: ['101大樓', '夜市美食', '故宮博物院'],
          included: ['交通', '導覽服務', '午餐'],
          notIncluded: ['門票', '個人消費']
        }
      })
    }

    // 創建示例預訂
    const bookings = await Promise.all([
      prisma.booking.create({
        data: {
          serviceId: testService.id,
          guideId: testGuide.id,
          travelerId: testUser.id,
          status: 'PENDING',
          bookingDate: new Date('2025-08-30'),
          startTime: new Date('2025-08-30T09:00:00'),
          guests: 2,
          durationHours: 8,
          basePrice: 2500,
          serviceFee: 250,
          totalAmount: 2750,
          contactInfo: {
            phone: '+886-912345678',
            email: 'test-customer@example.com'
          },
          specialRequests: '希望能介紹當地美食'
        },
        include: {
          service: true,
          guide: { include: { userProfile: true } },
          traveler: { include: { userProfile: true } },
          payments: true
        }
      }),
      prisma.booking.create({
        data: {
          serviceId: testService.id,
          guideId: testGuide.id,
          travelerId: testUser.id,
          status: 'CONFIRMED',
          bookingDate: new Date('2025-09-05'),
          startTime: new Date('2025-09-05T10:00:00'),
          guests: 4,
          durationHours: 8,
          basePrice: 2500,
          serviceFee: 250,
          totalAmount: 2750,
          contactInfo: {
            phone: '+886-987654321',
            email: 'test-customer@example.com'
          },
          paymentStatus: 'COMPLETED'
        },
        include: {
          service: true,
          guide: { include: { userProfile: true } },
          traveler: { include: { userProfile: true } },
          payments: true
        }
      }),
      prisma.booking.create({
        data: {
          serviceId: testService.id,
          guideId: testGuide.id,
          travelerId: testUser.id,
          status: 'COMPLETED',
          bookingDate: new Date('2025-08-15'),
          startTime: new Date('2025-08-15T14:00:00'),
          guests: 3,
          durationHours: 8,
          basePrice: 2500,
          serviceFee: 250,
          totalAmount: 2750,
          contactInfo: {
            phone: '+886-555666777',
            email: 'test-customer@example.com'
          },
          paymentStatus: 'COMPLETED',
          completedAt: new Date('2025-08-15T22:00:00')
        },
        include: {
          service: true,
          guide: { include: { userProfile: true } },
          traveler: { include: { userProfile: true } },
          payments: true
        }
      })
    ])

    // 創建支付記錄
    await prisma.payment.create({
      data: {
        bookingId: bookings[1].id,
        userId: testUser.id,
        paymentMethod: 'CREDIT_CARD',
        paymentProvider: 'stripe',
        providerPaymentId: 'pi_test_12345',
        amount: 2750,
        currency: 'TWD',
        status: 'COMPLETED',
        processedAt: new Date()
      }
    })

    await prisma.payment.create({
      data: {
        bookingId: bookings[2].id,
        userId: testUser.id,
        paymentMethod: 'CREDIT_CARD',
        paymentProvider: 'stripe',
        providerPaymentId: 'pi_test_67890',
        amount: 2750,
        currency: 'TWD',
        status: 'COMPLETED',
        processedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: '測試預訂資料創建成功',
      bookingsCreated: bookings.length
    })

  } catch (error) {
    console.error('Error seeding bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed bookings' },
      { status: 500 }
    )
  }
}