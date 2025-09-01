'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, MessageSquare, Download, Star, MoreHorizontal, Filter, Search, Eye, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  guideName: string;
  guideAvatar: string;
  guideContact: {
    phone: string;
    email: string;
  };
  date: Date;
  duration: string;
  guests: number;
  location: string;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  bookingReference: string;
  createdAt: Date;
  updatedAt: Date;
  specialRequests?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  cancellationPolicy?: string;
  refundAmount?: number;
}

interface OrderManagementProps {
  userRole: 'customer' | 'guide' | 'admin';
  className?: string;
}

export function OrderManagement({ userRole, className = '' }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // 篩選和搜索狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 模擬訂單數據
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD001',
        serviceId: 'SRV001',
        serviceTitle: '台北101 & 信義區深度導覽',
        serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        guideName: '小美',
        guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        guideContact: {
          phone: '+886 912-345-678',
          email: 'guide@example.com'
        },
        date: new Date('2024-02-20'),
        duration: '4小時',
        guests: 2,
        location: '台北市信義區',
        totalAmount: 1760,
        status: 'confirmed',
        paymentStatus: 'paid',
        bookingReference: 'GD20240215001',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-15'),
        specialRequests: '希望導遊可以協助拍照',
        customerInfo: {
          name: '王小明',
          email: 'customer@example.com',
          phone: '+886 987-654-321'
        },
        cancellationPolicy: '24小時前可免費取消'
      },
      {
        id: 'ORD002',
        serviceId: 'SRV002',
        serviceTitle: '九份老街 & 金瓜石礦業遺址',
        serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        guideName: '阿明',
        guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        guideContact: {
          phone: '+886 923-456-789',
          email: 'guide2@example.com'
        },
        date: new Date('2024-02-25'),
        duration: '6小時',
        guests: 4,
        location: '新北市瑞芳區',
        totalAmount: 2640,
        status: 'pending',
        paymentStatus: 'paid',
        bookingReference: 'GD20240216001',
        createdAt: new Date('2024-02-16'),
        updatedAt: new Date('2024-02-16'),
        customerInfo: {
          name: '李小華',
          email: 'customer2@example.com',
          phone: '+886 976-543-210'
        },
        cancellationPolicy: '48小時前可免費取消'
      },
      {
        id: 'ORD003',
        serviceId: 'SRV003',
        serviceTitle: '日月潭環湖 & 邵族文化體驗',
        serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        guideName: '小華',
        guideAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        guideContact: {
          phone: '+886 934-567-890',
          email: 'guide3@example.com'
        },
        date: new Date('2024-01-15'),
        duration: '8小時',
        guests: 3,
        location: '南投縣魚池鄉',
        totalAmount: 3168,
        status: 'completed',
        paymentStatus: 'paid',
        bookingReference: 'GD20240105001',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-16'),
        customerInfo: {
          name: '張美玲',
          email: 'customer3@example.com',
          phone: '+886 965-432-109'
        },
        cancellationPolicy: '72小時前可免費取消'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 搜索和篩選
  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = !searchQuery || 
        order.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.guideName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      const matchesDate = dateFilter === 'all' || (() => {
        const now = new Date();
        const orderDate = order.date;
        
        switch (dateFilter) {
          case 'upcoming':
            return orderDate > now;
          case 'past':
            return orderDate < now;
          case 'this_month':
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, dateFilter, sortBy, sortOrder]);

  // 獲取狀態顏色
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#ef4444';
      case 'refunded': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // 獲取狀態圖示
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle style={{ width: '1rem', height: '1rem' }} />;
      case 'pending': return <AlertCircle style={{ width: '1rem', height: '1rem' }} />;
      case 'completed': return <CheckCircle style={{ width: '1rem', height: '1rem' }} />;
      case 'cancelled': return <XCircle style={{ width: '1rem', height: '1rem' }} />;
      case 'refunded': return <XCircle style={{ width: '1rem', height: '1rem' }} />;
      default: return <AlertCircle style={{ width: '1rem', height: '1rem' }} />;
    }
  };

  // 獲取狀態標籤
  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return '已確認';
      case 'pending': return '待確認';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      case 'refunded': return '已退款';
      default: return status;
    }
  };

  // 處理訂單操作
  const handleOrderAction = (orderId: string, action: 'confirm' | 'cancel' | 'refund' | 'complete') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        switch (action) {
          case 'confirm':
            return { ...order, status: 'confirmed', updatedAt: new Date() };
          case 'cancel':
            return { ...order, status: 'cancelled', updatedAt: new Date() };
          case 'refund':
            return { 
              ...order, 
              status: 'refunded', 
              paymentStatus: 'refunded',
              refundAmount: order.totalAmount,
              updatedAt: new Date() 
            };
          case 'complete':
            return { ...order, status: 'completed', updatedAt: new Date() };
          default:
            return order;
        }
      }
      return order;
    }));
  };

  // 下載收據
  const handleDownloadReceipt = (order: Order) => {
    // 模擬下載功能
    alert(`正在下載 ${order.bookingReference} 的收據...`);
  };

  // 聯絡導遊/客戶
  const handleContact = (order: Order) => {
    // 模擬聯絡功能
    if (userRole === 'customer') {
      alert(`正在聯絡導遊 ${order.guideName}...`);
    } else {
      alert(`正在聯絡客戶 ${order.customerInfo.name}...`);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }} className={className}>
      {/* 標題和操作區 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            {userRole === 'customer' ? '我的預訂' : userRole === 'guide' ? '接收的預訂' : '所有訂單'}
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0.25rem 0 0'
          }}>
            管理和追蹤您的預訂狀態
          </p>
        </div>
      </div>

      {/* 搜索和篩選區 */}
      <div style={{
        padding: '1rem 1.5rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* 搜索框 */}
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1rem',
              height: '1rem',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="搜索預訂編號、服務名稱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 狀態篩選 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">所有狀態</option>
            <option value="confirmed">已確認</option>
            <option value="pending">待確認</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
            <option value="refunded">已退款</option>
          </select>

          {/* 日期篩選 */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">所有日期</option>
            <option value="upcoming">即將到來</option>
            <option value="past">已過去</option>
            <option value="this_month">本月</option>
          </select>

          {/* 排序 */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="date-desc">最新日期</option>
            <option value="date-asc">最早日期</option>
            <option value="amount-desc">金額高到低</option>
            <option value="amount-asc">金額低到高</option>
            <option value="status-asc">狀態排序</option>
          </select>
        </div>
      </div>

      {/* 訂單列表 */}
      <div style={{ overflowX: 'auto' }}>
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              📋
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              沒有找到訂單
            </h3>
            <p>嘗試調整搜尋條件或篩選器</p>
          </div>
        ) : (
          <div style={{ padding: '1rem' }}>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  transition: 'all 0.2s'
                }}
                className="hover:shadow-md"
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}>
                  {/* 訂單信息 */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <img
                        src={order.serviceImage}
                        alt={order.serviceTitle}
                        style={{
                          width: '4rem',
                          height: '4rem',
                          borderRadius: '0.5rem',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#111827',
                            margin: 0
                          }}>
                            {order.serviceTitle}
                          </h3>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: getStatusColor(order.status),
                            color: 'white',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          <span>訂單編號：{order.bookingReference}</span>
                          <span>導遊：{order.guideName}</span>
                        </div>
                      </div>
                    </div>

                    {/* 詳細信息 */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Calendar style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {order.date.toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Clock style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {order.duration}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Users style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {order.guests} 位
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <MapPin style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {order.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 金額和操作 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '1rem'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      NT$ {order.totalAmount.toLocaleString()}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <button
                        onClick={() => handleContact(order)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer'
                        }}
                        title="聯絡"
                      >
                        <MessageSquare style={{ width: '1rem', height: '1rem' }} />
                      </button>
                      
                      <button
                        onClick={() => handleDownloadReceipt(order)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer'
                        }}
                        title="下載收據"
                      >
                        <Download style={{ width: '1rem', height: '1rem' }} />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer'
                        }}
                        title="查看詳情"
                      >
                        <Eye style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    </div>

                    {/* 管理操作 (僅管理員和導遊) */}
                    {(userRole === 'admin' || userRole === 'guide') && order.status === 'pending' && (
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        <button
                          onClick={() => handleOrderAction(order.id, 'confirm')}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          確認
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'cancel')}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          取消
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 訂單詳情模態框 */}
      {showDetails && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                訂單詳情
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                <XCircle style={{ width: '1.5rem', height: '1.5rem', color: '#6b7280' }} />
              </button>
            </div>

            {/* 詳細內容在這裡顯示 selectedOrder 的完整信息 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <strong>預訂編號：</strong> {selectedOrder.bookingReference}
              </div>
              <div>
                <strong>服務名稱：</strong> {selectedOrder.serviceTitle}
              </div>
              <div>
                <strong>導遊：</strong> {selectedOrder.guideName}
              </div>
              <div>
                <strong>客戶：</strong> {selectedOrder.customerInfo.name}
              </div>
              <div>
                <strong>聯絡電話：</strong> {selectedOrder.customerInfo.phone}
              </div>
              <div>
                <strong>電子郵件：</strong> {selectedOrder.customerInfo.email}
              </div>
              {selectedOrder.specialRequests && (
                <div>
                  <strong>特殊需求：</strong> {selectedOrder.specialRequests}
                </div>
              )}
              <div>
                <strong>取消政策：</strong> {selectedOrder.cancellationPolicy}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}