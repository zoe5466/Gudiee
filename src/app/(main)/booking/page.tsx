'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar, Users, Clock, MapPin, CreditCard, Shield, Check } from 'lucide-react'
import { useBooking } from '@/store/booking'
import { useAuth } from '@/store/auth'
import { Loading } from '@/components/ui/loading'
import { FullNavigation } from '@/components/layout/page-navigation'
import { PaymentForm } from '@/components/payment/payment-form'

export default function BookingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { currentBooking, bookingStep, setBookingStep, updateBookingDetails, createBooking, isLoading } = useBooking()

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/booking')
      return
    }
  }, [isAuthenticated, router])
  
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
  })

  // 當用戶資料載入時更新聯絡資訊
  useEffect(() => {
    if (user) {
      setContactInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
      })
    }
  }, [user])
  
  const [specialRequests, setSpecialRequests] = useState('')

  // Mock service data - 在實際應用中從 API 或 store 獲取
  const mockService = {
    id: currentBooking?.serviceId || '1',
    title: '台北101 & 信義區深度導覽',
    price: 800,
    duration: 4,
    guide: {
      name: '小美',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    }
  }

  const handleNextStep = () => {
    if (bookingStep === 'details') {
      updateBookingDetails({
        contactInfo,
        specialRequests,
      })
      setBookingStep('payment')
    }
  }

  const handleCreateBooking = async () => {
    try {
      const bookingId = await createBooking()
      // 創建預訂後進入支付流程
      setBookingStep('payment')
    } catch (error) {
      console.error('預訂失敗:', error)
    }
  }

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      // 處理支付成功
      setBookingStep('confirmation')
    } catch (error) {
      console.error('支付確認失敗:', error)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('支付失敗:', error)
    // 顯示錯誤訊息
  }

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Loading variant="spinner" size="lg" />
      </div>
    )
  }

  if (!currentBooking) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            沒有找到預訂資料
          </h2>
          <button 
            onClick={() => router.push('/search')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FF5A5F',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            回到搜尋
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <FullNavigation />

      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        marginTop: '4rem',
        borderRadius: '1rem 1rem 0 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>確認預訂</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }} className="sm:p-6">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }} className="sm:gap-8 sm:flex-nowrap">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              color: bookingStep === 'details' ? '#FF5A5F' : '#9ca3af',
              fontSize: '0.875rem'
            }} className="sm:gap-2 sm:text-base">
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: bookingStep === 'details' ? '#FF5A5F' : '#e5e7eb',
                color: bookingStep === 'details' ? 'white' : '#6b7280'
              }} className="sm:w-8 sm:h-8 sm:text-sm">
                1
              </div>
              <span className="hidden sm:inline">預訂詳情</span>
            </div>
            <div style={{ 
              width: '2rem', 
              height: '2px', 
              backgroundColor: bookingStep !== 'details' ? '#FF5A5F' : '#e5e7eb' 
            }} className="sm:w-16"></div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              color: bookingStep === 'payment' ? '#FF5A5F' : '#9ca3af',
              fontSize: '0.875rem'
            }} className="sm:gap-2 sm:text-base">
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: bookingStep === 'payment' ? '#FF5A5F' : '#e5e7eb',
                color: bookingStep === 'payment' ? 'white' : '#6b7280'
              }} className="sm:w-8 sm:h-8 sm:text-sm">
                2
              </div>
              <span className="hidden sm:inline">付款方式</span>
            </div>
            <div style={{ 
              width: '2rem', 
              height: '2px', 
              backgroundColor: bookingStep === 'confirmation' ? '#FF5A5F' : '#e5e7eb' 
            }} className="sm:w-16"></div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              color: bookingStep === 'confirmation' ? '#FF5A5F' : '#9ca3af',
              fontSize: '0.875rem'
            }} className="sm:gap-2 sm:text-base">
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: bookingStep === 'confirmation' ? '#FF5A5F' : '#e5e7eb',
                color: bookingStep === 'confirmation' ? 'white' : '#6b7280'
              }} className="sm:w-8 sm:h-8 sm:text-sm">
                3
              </div>
              <span className="hidden sm:inline">預訂確認</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }} className="sm:p-8">
        <div style={{ display: 'grid', gap: '2rem' }} className="lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div style={{ order: 2 }} className="lg:order-1">
            {bookingStep === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Booking Details */}
                <div style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '1rem', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
                    預訂詳情
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                      <Calendar style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                      <span>{currentBooking.date?.toLocaleDateString('zh-TW')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                      <Users style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                      <span>{currentBooking.guests} 位旅客</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                      <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                      <span>{currentBooking.duration} 小時</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '1rem', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
                    聯絡資訊
                  </h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }} className="sm:grid-cols-2">
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.5rem' 
                      }}>
                        姓名 *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.5rem' 
                      }}>
                        電子郵件 *
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.5rem' 
                      }}>
                        手機號碼 *
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '1rem', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
                    特殊需求
                  </h2>
                  
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                    placeholder="有任何特殊需求或備註嗎？（選填）"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button 
                    onClick={handleNextStep}
                    disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: (!contactInfo.name || !contactInfo.email || !contactInfo.phone) ? '#d1d5db' : '#FF5A5F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: (!contactInfo.name || !contactInfo.email || !contactInfo.phone) ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      opacity: (!contactInfo.name || !contactInfo.email || !contactInfo.phone) ? 0.5 : 1
                    }}
                  >
                    繼續
                  </button>
                </div>
              </div>
            )}

            {bookingStep === 'payment' && (
              <div style={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '1rem', 
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <PaymentForm
                  amount={mockService.price * (currentBooking?.duration || 4) * (currentBooking?.guests || 2) + Math.round(mockService.price * (currentBooking?.duration || 4) * (currentBooking?.guests || 2) * 0.1)}
                  currency="NT$"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Navigation buttons */}
            {bookingStep !== 'confirmation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }} className="sm:flex-row sm:justify-between">
                  <button 
                    onClick={() => setBookingStep('details')}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    返回
                  </button>
                  <button 
                    onClick={handleCreateBooking}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: '#FF5A5F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    確認付款
                  </button>
                </div>
            )}

            {bookingStep === 'confirmation' && (
              <div>
                {/* Success Message */}
                <div style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '1rem', 
                  padding: '2rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    width: '4rem', 
                    height: '4rem', 
                    backgroundColor: '#dcfce7', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 1rem' 
                  }}>
                    <Check style={{ width: '2rem', height: '2rem', color: '#16a34a' }} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                    預訂成功！
                  </h2>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    您的預訂已確認，地陪將在 24 小時內與您聯繫。
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }} className="sm:flex-row sm:justify-center">
                    <button 
                      onClick={() => router.push('/profile')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      查看預訂記錄
                    </button>
                    <button 
                      onClick={() => router.push('/search')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#FF5A5F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      繼續探索
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div style={{ order: 1 }} className="lg:order-2">
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '1rem', 
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }} className="lg:sticky lg:top-24">
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                預訂摘要
              </h3>
              
              {/* Service Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <img 
                  src={mockService.guide.avatar} 
                  alt={mockService.guide.name}
                  style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>
                    {mockService.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>地陪：{mockService.guide.name}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem', 
                marginBottom: '1.5rem', 
                paddingBottom: '1.5rem', 
                borderBottom: '1px solid #e5e7eb' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>日期：</span>
                  <span style={{ color: '#111827' }}>{currentBooking.date?.toLocaleDateString('zh-TW')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>人數：</span>
                  <span style={{ color: '#111827' }}>{currentBooking.guests} 位</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>時長：</span>
                  <span style={{ color: '#111827' }}>{currentBooking.duration} 小時</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>服務費用：</span>
                  <span style={{ color: '#111827' }}>
                    NT$ {(mockService.price * (currentBooking.duration || 1)).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>平台服務費：</span>
                  <span style={{ color: '#111827' }}>
                    NT$ {Math.round((mockService.price * (currentBooking.duration || 1)) * 0.1).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827', 
                paddingTop: '1rem', 
                borderTop: '1px solid #e5e7eb' 
              }}>
                <span>總計：</span>
                <span>NT$ {Math.round((mockService.price * (currentBooking.duration || 1)) * 1.1).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}