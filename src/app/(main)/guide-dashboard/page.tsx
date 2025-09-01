'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Users, DollarSign, Star, Eye, Edit, Trash2, MessageCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useBooking } from '@/store/booking';
import { FullNavigation } from '@/components/layout/page-navigation';
import { Loading } from '@/components/ui/loading';
import { ReviewsSummary } from '@/components/reviews/reviews-summary';

export default function GuideDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { bookings, fetchBookings, isLoading } = useBooking();
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'services' | 'bookings' | 'reviews' | 'earnings'>('overview');
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
    servicesCount: 0
  });

  // 檢查用戶是否已登入且為導遊
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/guide-dashboard');
      return;
    }
    
    if (user?.role !== 'guide') {
      router.push('/');
      return;
    }
    
    // 載入預訂資料
    fetchBookings();
  }, [isAuthenticated, user, router, fetchBookings]);

  // 計算統計資料
  useEffect(() => {
    if (bookings.length > 0) {
      const guideBookings = bookings.filter(booking => booking.guideId === user?.id);
      const totalEarnings = guideBookings.reduce((sum, booking) => {
        return booking.payment.status === 'completed' ? sum + booking.pricing.total : sum;
      }, 0);
      
      setStats({
        totalBookings: guideBookings.length,
        pendingBookings: guideBookings.filter(b => b.status === 'pending').length,
        totalEarnings,
        averageRating: 4.8, // 模擬數據
        totalReviews: 25, // 模擬數據
        servicesCount: 3 // 模擬數據
      });
    }
  }, [bookings, user]);

  // 模擬服務數據
  const mockServices = [
    {
      id: '1',
      title: '台北101 & 信義區深度導覽',
      image: 'https://images.unsplash.com/photo-1508150492017-3d1e63ecdfc5?w=400&h=300&fit=crop',
      price: 800,
      duration: '4小時',
      status: 'active',
      bookings: 15,
      rating: 4.9,
      lastBooked: '2024-01-15'
    },
    {
      id: '2',
      title: '九份老街文化巡禮',
      image: 'https://images.unsplash.com/photo-1549813069-f95e44d7f498?w=400&h=300&fit=crop',
      price: 1200,
      duration: '6小時',
      status: 'active',
      bookings: 8,
      rating: 4.7,
      lastBooked: '2024-01-12'
    }
  ];

  const renderOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* 統計卡片 */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>總預訂數</h3>
          <Calendar style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats.totalBookings}</div>
        <div style={{ fontSize: '0.875rem', color: '#10b981' }}>+12% 較上月</div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>待確認預訂</h3>
          <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b' }} />
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats.pendingBookings}</div>
        <div style={{ fontSize: '0.875rem', color: '#f59e0b' }}>需要處理</div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>總收入</h3>
          <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>NT$ {stats.totalEarnings.toLocaleString()}</div>
        <div style={{ fontSize: '0.875rem', color: '#10b981' }}>+8% 較上月</div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>平均評分</h3>
          <Star style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b' }} />
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats.averageRating}</div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stats.totalReviews} 則評價</div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>我的服務</h2>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover:shadow-lg"
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          新增服務
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {mockServices.map(service => (
          <div
            key={service.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <img
              src={service.image}
              alt={service.title}
              style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
            />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', flex: 1 }}>
                  {service.title}
                </h3>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: service.status === 'active' ? '#dcfce7' : '#fef3c7',
                  color: service.status === 'active' ? '#166534' : '#92400e',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {service.status === 'active' ? '上架中' : '暫停'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <div>價格: NT$ {service.price}</div>
                <div>時長: {service.duration}</div>
                <div>預訂: {service.bookings} 次</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star style={{ width: '0.875rem', height: '0.875rem', fill: '#f59e0b', color: '#f59e0b' }} />
                  {service.rating}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    color: '#374151',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-gray-50"
                >
                  <Eye style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem', display: 'inline' }} />
                  查看
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    color: '#374151',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-gray-50"
                >
                  <Edit style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem', display: 'inline' }} />
                  編輯
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => {
    const guideBookings = bookings.filter(booking => booking.guideId === user?.id);
    
    return (
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '2rem' }}>預訂管理</h2>
        
        {guideBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem' }}>
            <Calendar style={{ width: '3rem', height: '3rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              暫無預訂
            </h3>
            <p style={{ color: '#6b7280' }}>等待客戶預訂您的服務</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {guideBookings.map(booking => (
              <div
                key={booking.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                      預訂 #{booking.id}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <div>日期: {new Date(booking.details.date).toLocaleDateString('zh-TW')}</div>
                      <div>時間: {booking.details.time}</div>
                      <div>人數: {booking.details.guests} 人</div>
                      <div>聯絡人: {booking.details.contactInfo.name}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                      NT$ {booking.pricing.total.toLocaleString()}
                    </div>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                      color: booking.status === 'confirmed' ? '#166534' : '#92400e',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {booking.status === 'pending' ? '待確認' : booking.status === 'confirmed' ? '已確認' : '已完成'}
                    </span>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(to right, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:shadow-md"
                    >
                      <CheckCircle style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem', display: 'inline' }} />
                      確認預訂
                    </button>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #dc2626',
                        borderRadius: '0.375rem',
                        color: '#dc2626',
                        backgroundColor: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:bg-red-50"
                    >
                      拒絕預訂
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated || user?.role !== 'guide') {
    return <Loading />;
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <FullNavigation />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* 頁面標題 */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            導遊控制台
          </h1>
          <p style={{ color: '#6b7280' }}>
            管理您的服務、預訂和收入
          </p>
        </div>

        {/* 分類標籤 */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { key: 'overview', label: '總覽', icon: TrendingUp },
            { key: 'services', label: '我的服務', icon: Users },
            { key: 'bookings', label: '預訂管理', icon: Calendar },
            { key: 'reviews', label: '評價管理', icon: Star },
            { key: 'earnings', label: '收入統計', icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ...(selectedTab === tab.key ? {
                    backgroundColor: '#2563eb',
                    borderColor: '#2563eb',
                    color: 'white'
                  } : {
                    backgroundColor: 'white',
                    borderColor: '#e5e7eb',
                    color: '#374151'
                  })
                }}
                className={selectedTab !== tab.key ? 'hover:bg-gray-50' : ''}
              >
                <Icon style={{ width: '1rem', height: '1rem' }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 內容區域 */}
        <div>
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'services' && renderServices()}
          {selectedTab === 'bookings' && renderBookings()}
          {selectedTab === 'reviews' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '2rem' }}>
                評價管理
              </h2>
              <ReviewsSummary guideId={user?.id} showDetails={true} className="mb-4" />
              {/* 這裡可以加入更詳細的評價管理功能 */}
            </div>
          )}
          {selectedTab === 'earnings' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '2rem' }}>
                收入統計
              </h2>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                <p style={{ color: '#6b7280', textAlign: 'center' }}>收入統計功能開發中...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}