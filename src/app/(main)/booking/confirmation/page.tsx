'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Users, MapPin, Phone, Mail, CreditCard, ArrowLeft, Download, Share2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/store/auth';

interface BookingDetails {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  guideName: string;
  guidePhone: string;
  guideEmail: string;
  guideAvatar: string;
  date: string;
  time: string;
  duration: string;
  guests: number;
  location: string;
  totalAmount: number;
  paymentMethod: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingReference: string;
  specialRequests?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function BookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bookingId = searchParams.get('id');

  useEffect(() => {
    if (!bookingId) {
      router.push('/');
      return;
    }

    // 模擬獲取預訂詳情
    const mockBooking: BookingDetails = {
      id: bookingId,
      serviceId: '1',
      serviceTitle: '台北101 & 信義區深度導覽',
      serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '小美',
      guidePhone: '+886 912-345-678',
      guideEmail: 'guide@example.com',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      date: '2024-02-15',
      time: '09:00',
      duration: '4小時',
      guests: 2,
      location: '台北市信義區',
      totalAmount: 1600,
      paymentMethod: 'Credit Card',
      status: 'confirmed',
      bookingReference: 'GD' + Date.now().toString().slice(-8),
      specialRequests: '希望導遊可以協助拍照',
      customerInfo: {
        name: user?.name || '訪客',
        email: user?.email || 'customer@example.com',
        phone: '+886 987-654-321'
      }
    };

    setTimeout(() => {
      setBooking(mockBooking);
      setIsLoading(false);
    }, 1000);
  }, [bookingId, router, user]);

  const handleDownloadTicket = () => {
    // 模擬下載票券功能
    alert('票券下載功能開發中');
  };

  const handleShareBooking = () => {
    // 模擬分享功能
    if (navigator.share) {
      navigator.share({
        title: `Guidee 預訂確認 - ${booking?.serviceTitle}`,
        text: `我已成功預訂${booking?.serviceTitle}，期待這次的體驗！`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('預訂連結已複製到剪貼板');
    }
  };

  const handleContactGuide = () => {
    router.push(`/chat?guideId=${booking?.serviceId}`);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            找不到預訂資訊
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            請檢查您的預訂編號是否正確
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    }}>
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Success Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <CheckCircle style={{ width: '2rem', height: '2rem', color: 'white' }} />
          </div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            預訂成功！
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            您的預訂已確認，期待為您提供精彩的體驗
          </p>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#059669'
          }}>
            預訂編號：{booking.bookingReference}
          </div>
        </div>

        {/* Booking Details */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          {/* Service Info */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            padding: '1.5rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <img
              src={booking.serviceImage}
              alt={booking.serviceTitle}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '0.5rem',
                objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                {booking.serviceTitle}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '0.5rem'
              }}>
                <MapPin style={{ width: '1rem', height: '1rem' }} />
                {booking.location}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <img
                  src={booking.guideAvatar}
                  alt={booking.guideName}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  導遊：{booking.guideName}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  <Calendar style={{ width: '1rem', height: '1rem' }} />
                  預訂日期
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  {new Date(booking.date).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  <Clock style={{ width: '1rem', height: '1rem' }} />
                  時間與時長
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  {booking.time} ({booking.duration})
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  <Users style={{ width: '1rem', height: '1rem' }} />
                  參加人數
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  {booking.guests} 位
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  <CreditCard style={{ width: '1rem', height: '1rem' }} />
                  付款金額
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  NT$ {booking.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                聯絡資訊
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.75rem'
              }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    姓名
                  </span>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {booking.customerInfo.name}
                  </div>
                </div>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    電子郵件
                  </span>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {booking.customerInfo.email}
                  </div>
                </div>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    聯絡電話
                  </span>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {booking.customerInfo.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef7ff',
                border: '1px solid #e9d5ff',
                borderRadius: '0.5rem'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  特殊需求
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {booking.specialRequests}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guide Contact Info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            導遊聯絡資訊
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <img
              src={booking.guideAvatar}
              alt={booking.guideName}
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827'
              }}>
                {booking.guideName}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                專業地陪導遊
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Phone style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                {booking.guidePhone}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Mail style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                {booking.guideEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={handleContactGuide}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <MessageSquare style={{ width: '1rem', height: '1rem' }} />
            聯絡導遊
          </button>

          <button
            onClick={handleDownloadTicket}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} />
            下載票券
          </button>

          <button
            onClick={handleShareBooking}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Share2 style={{ width: '1rem', height: '1rem' }} />
            分享預訂
          </button>

          <button
            onClick={() => router.push('/profile/bookings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            查看所有預訂
          </button>
        </div>

        {/* Important Notes */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fbbf24',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#92400e',
            marginBottom: '0.5rem'
          }}>
            重要提醒
          </h4>
          <ul style={{
            fontSize: '0.875rem',
            color: '#92400e',
            paddingLeft: '1.25rem'
          }}>
            <li>請於預訂日期前一天再次確認行程安排</li>
            <li>如需取消或修改預訂，請提前24小時聯絡導遊</li>
            <li>建議提前10-15分鐘到達集合地點</li>
            <li>如遇天候不佳，導遊會主動聯絡安排替代方案</li>
          </ul>
        </div>
      </div>
    </div>
  );
}