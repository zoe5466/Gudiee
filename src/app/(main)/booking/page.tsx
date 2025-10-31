// 預訂頁面組件
// 功能：處理服務預訂流程，包含預訂詳情確認、聯絡資訊填寫、付款處理等
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Calendar, Users, Clock, MapPin, CreditCard, Shield, Check, AlertCircle } from 'lucide-react';
import { useOrder } from '@/store/order';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { CreateOrderRequest } from '@/types/order';

// 預訂步驟類型
type BookingStep = 'details' | 'payment' | 'confirmation';

/**
 * 預訂頁面主組件
 * 
 * 功能：
 * - 用戶身份驗證檢查
 * - 顯示預訂服務詳情
 * - 收集聯絡資訊
 * - 處理特殊需求
 * - 整合付款流程
 * - 預訂確認和創建
 */
export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { createOrder, currentOrder, isCreating, error, clearError } = useOrder();
  const { success, error: showError } = useToast();
  
  // 從 URL 參數獲取預訂資訊
  const serviceId = searchParams.get('serviceId') || '';
  const date = searchParams.get('date') || '';
  const startTime = searchParams.get('startTime') || '09:00';
  const participants = parseInt(searchParams.get('participants') || '2');
  
  const [bookingStep, setBookingStep] = useState<BookingStep>('details');
  const [isInitializing, setIsInitializing] = useState(true);

  // 等待認證初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/auth/login?redirect=/booking');
      return;
    }
  }, [isInitializing, isAuthenticated, router]);
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '台灣',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  // 當用戶資料載入時更新聯絡資訊
  useEffect(() => {
    if (user) {
      setContactInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
      }));
    }
  }, [user]);
  
  const [specialRequests, setSpecialRequests] = useState('');
  
  // 檢查必填參數
  useEffect(() => {
    if (!isInitializing && (!serviceId || !date)) {
      showError('缺少預訂資訊', '請從服務頁面重新開始預訂流程');
      router.push('/search');
    }
  }, [isInitializing, serviceId, date, router, showError]);

  // Mock service data - 在實際應用中從 API 或 store 獲取
  const mockService = {
    id: serviceId,
    title: '台北101 & 信義區深度導覽',
    price: 800,
    duration: 4,
    location: {
      name: '台北101購物中心正門',
      address: '台北市信義區市府路45號'
    },
    guide: {
      id: 'guide-001',
      name: '張小美',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    }
  };
  
  // 計算價格
  const calculatePricing = () => {
    const basePrice = mockService.price;
    const subtotal = basePrice * participants;
    const serviceFee = Math.round(subtotal * 0.1); // 10% 服務費
    const tax = Math.round((subtotal + serviceFee) * 0.05); // 5% 稅費
    const total = subtotal + serviceFee + tax;
    
    return {
      basePrice,
      participants,
      subtotal,
      serviceFee,
      tax,
      total,
      currency: 'TWD'
    };
  };
  
  const pricing = calculatePricing();

  const handleNextStep = () => {
    if (bookingStep === 'details') {
      // 驗證聯絡資訊
      if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
        showError('請填寫完整聯絡資訊', '姓名、電子郵件和手機號碼為必填項目');
        return;
      }
      setBookingStep('payment');
    }
  };

  const handleCreateOrder = async () => {
    try {
      clearError();
      
      const orderData: CreateOrderRequest = {
        serviceId,
        date,
        startTime,
        participants,
        customer: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
          nationality: contactInfo.nationality,
          ...(contactInfo.emergencyContact.name && {
            emergencyContact: contactInfo.emergencyContact
          })
        },
        specialRequests: specialRequests || undefined
      };
      
      const order = await createOrder(orderData);
      success('訂單建立成功', `訂單編號：${order.orderNumber}`);
      setBookingStep('confirmation');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '建立訂單失敗';
      showError('建立訂單失敗', errorMessage);
    }
  };

  const handlePaymentSuccess = async () => {
    success('付款成功', '您的預訂已確認');
    setBookingStep('confirmation');
  };

  const handlePaymentError = (errorMessage: string) => {
    showError('付款失敗', errorMessage);
  };

  if (isInitializing || isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    )
  }

  if (!isInitializing && (!serviceId || !date)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            缺少預訂資訊
          </h2>
          <p className="text-gray-600 mb-6">
            請從服務頁面重新開始預訂流程
          </p>
          <button 
            onClick={() => router.push('/search')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            回到搜尋
          </button>
        </div>
      </div>
    );
  }
  
  if (isInitializing || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 mt-16 rounded-t-xl">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">確認預訂</h1>
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
                      <span>{new Date(date).toLocaleDateString('zh-TW')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                      <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                      <span>{startTime} - {mockService.duration} 小時</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                      <Users style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                      <span>{participants} 位旅客</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                      <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                      <span>{mockService.location.name}</span>
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
                    <div>
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
                        placeholder="例：0912345678"
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
                        國籍
                      </label>
                      <input
                        type="text"
                        value={contactInfo.nationality}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, nationality: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        placeholder="例：台灣"
                      />
                    </div>
                  </div>
                  
                  {/* 緊急聯絡人 */}
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>緊急聯絡人（選填）</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="sm:grid-cols-3">
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: '#374151', 
                          marginBottom: '0.5rem' 
                        }}>
                          姓名
                        </label>
                        <input
                          type="text"
                          value={contactInfo.emergencyContact.name}
                          onChange={(e) => setContactInfo(prev => ({ 
                            ...prev, 
                            emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                          }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                          }}
                          placeholder="緊急聯絡人姓名"
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
                          電話
                        </label>
                        <input
                          type="tel"
                          value={contactInfo.emergencyContact.phone}
                          onChange={(e) => setContactInfo(prev => ({ 
                            ...prev, 
                            emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                          }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                          }}
                          placeholder="緊急聯絡人電話"
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
                          關係
                        </label>
                        <select
                          value={contactInfo.emergencyContact.relationship}
                          onChange={(e) => setContactInfo(prev => ({ 
                            ...prev, 
                            emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                          }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="">請選擇</option>
                          <option value="配偶">配偶</option>
                          <option value="父母">父母</option>
                          <option value="子女">子女</option>
                          <option value="兄弟姊妹">兄弟姊妹</option>
                          <option value="朋友">朋友</option>
                          <option value="其他">其他</option>
                        </select>
                      </div>
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
                  付款資訊
                </h2>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #e5e7eb',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>訂單總額</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                      NT$ {pricing.total.toLocaleString()}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <button
                      onClick={handleCreateOrder}
                      disabled={isCreating}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: isCreating ? '#d1d5db' : '#FF5A5F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: isCreating ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {isCreating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          建立訂單中...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          確認訂單並付款
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontSize: '0.75rem', 
                    color: '#6b7280',
                    justifyContent: 'center'
                  }}>
                    <Shield className="w-4 h-4" />
                    <span>您的支付資訊受到 SSL 加密保護</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {bookingStep === 'payment' && (
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
                  返回修改資料
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
                    訂單建立成功！
                  </h2>
                  {currentOrder && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                        訂單編號：{currentOrder.orderNumber}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        狀態：{currentOrder.status === 'DRAFT' ? '待確認' : '已確認'}
                      </p>
                    </div>
                  )}
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    您的訂單已建立，導遊將在 24 小時內確認您的預訂。
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }} className="sm:flex-row sm:justify-center">
                    <button 
                      onClick={() => router.push('/my-bookings')}
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
                      查看我的訂單
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
                  <span style={{ color: '#111827' }}>{new Date(date).toLocaleDateString('zh-TW')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>時間：</span>
                  <span style={{ color: '#111827' }}>{startTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>人數：</span>
                  <span style={{ color: '#111827' }}>{participants} 位</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>時長：</span>
                  <span style={{ color: '#111827' }}>{mockService.duration} 小時</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>服務費用：</span>
                  <span style={{ color: '#111827' }}>
                    NT$ {pricing.subtotal.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>平台服務費：</span>
                  <span style={{ color: '#111827' }}>
                    NT$ {pricing.serviceFee.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>稅費：</span>
                  <span style={{ color: '#111827' }}>
                    NT$ {pricing.tax.toLocaleString()}
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
                <span>NT$ {pricing.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}