'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Calendar, 
  User, 
  MapPin,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  CreditCard,
  FileText,
  MessageSquare
} from 'lucide-react';
import { CustomerCancellationInterface } from './customer-cancellation-interface';
import { RefundTrackingInterface } from './refund-tracking-interface';
import { DisputeResolutionInterface } from './dispute-resolution-interface';
import { Order } from '@/types/order';
import { CancellationRequest, RefundRecord } from '@/types/cancellation';

interface BookingCancellationIntegrationProps {
  order: Order;
  onClose: () => void;
  className?: string;
}

type ViewMode = 'overview' | 'cancel' | 'track' | 'dispute';

export function BookingCancellationIntegration({
  order,
  onClose,
  className = ''
}: BookingCancellationIntegrationProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [cancellationRequest, setCancellationRequest] = useState<CancellationRequest | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getTimeUntilService = () => {
    const serviceDate = new Date(order.booking.date + 'T' + order.booking.startTime);
    const now = new Date();
    const hours = (serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hours < 0) {
      return { hours: 0, canCancel: false, message: '服務已開始或已結束' };
    } else if (hours < 24) {
      return { 
        hours, 
        canCancel: false, 
        message: '服務開始前24小時內無法取消' 
      };
    } else {
      return { 
        hours, 
        canCancel: true, 
        message: `距離服務開始還有 ${Math.floor(hours)} 小時` 
      };
    }
  };

  const timeInfo = getTimeUntilService();

  const handleCancellationSuccess = (request: CancellationRequest) => {
    setCancellationRequest(request);
    setViewMode('overview');
    // 這裡可以添加成功提示或其他處理邏輯
    alert('取消申請已提交！\n\n我們將在24小時內審核您的申請，並透過電子郵件通知您結果。');
  };

  const renderOverview = () => (
    <div style={{ 
      padding: '2rem',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      {/* 訂單資訊 */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
          預訂資訊
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              服務名稱
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
              {order.booking.serviceName}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              嚮導
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
              {order.booking.guideName}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              日期時間
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
              {formatDate(order.booking.date)} {order.booking.startTime}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              參與人數
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
              {order.booking.participants} 人
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              集合地點
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
              {order.booking.location.name}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              總金額
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
              {formatCurrency(order.pricing.total)}
            </div>
          </div>
        </div>
      </div>

      {/* 訂單狀態 */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          訂單狀態
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 
              order.status === 'CONFIRMED' ? '#d1fae5' :
              order.status === 'CANCELLED' ? '#fee2e2' :
              order.status === 'COMPLETED' ? '#d1fae5' : '#fef3c7',
            color: 
              order.status === 'CONFIRMED' ? '#065f46' :
              order.status === 'CANCELLED' ? '#991b1b' :
              order.status === 'COMPLETED' ? '#065f46' : '#92400e',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {order.status === 'CONFIRMED' && <CheckCircle style={{ width: '1rem', height: '1rem' }} />}
            {order.status === 'CANCELLED' && <XCircle style={{ width: '1rem', height: '1rem' }} />}
            {order.status === 'COMPLETED' && <CheckCircle style={{ width: '1rem', height: '1rem' }} />}
            {order.status === 'PENDING' && <Clock style={{ width: '1rem', height: '1rem' }} />}
            
            {order.status === 'CONFIRMED' && '已確認'}
            {order.status === 'CANCELLED' && '已取消'}
            {order.status === 'COMPLETED' && '已完成'}
            {order.status === 'PENDING' && '待確認'}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#eff6ff',
            color: '#1e40af',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <Clock style={{ width: '1rem', height: '1rem' }} />
            {timeInfo.message}
          </div>
        </div>

        {/* 取消狀態 */}
        {cancellationRequest && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.5rem',
            border: '1px solid #fbbf24',
            marginTop: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#92400e'
              }}>
                取消申請狀態
              </span>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#92400e'
            }}>
              您的取消申請（{cancellationRequest.id}）目前狀態為：
              {cancellationRequest.status === 'PENDING' && '待審核'}
              {cancellationRequest.status === 'APPROVED' && '已批准'}
              {cancellationRequest.status === 'REJECTED' && '已拒絕'}
            </div>
            
            {cancellationRequest.refundCalculation && (
              <div style={{
                fontSize: '0.875rem',
                color: '#92400e',
                marginTop: '0.25rem'
              }}>
                預計退款金額：{formatCurrency(cancellationRequest.refundCalculation.finalRefundAmount)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 操作按鈕 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* 取消預訂 */}
        {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && !cancellationRequest && (
          <button
            onClick={() => setViewMode('cancel')}
            disabled={!timeInfo.canCancel}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              backgroundColor: !timeInfo.canCancel ? '#f3f4f6' : '#ef4444',
              color: !timeInfo.canCancel ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: !timeInfo.canCancel ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <XCircle style={{ width: '1.25rem', height: '1.25rem' }} />
            {!timeInfo.canCancel ? '無法取消預訂' : '申請取消預訂'}
          </button>
        )}

        {/* 追蹤退款 */}
        {(cancellationRequest || order.status === 'CANCELLED') && (
          <button
            onClick={() => setViewMode('track')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <DollarSign style={{ width: '1.25rem', height: '1.25rem' }} />
            追蹤退款進度
          </button>
        )}

        {/* 申請爭議 */}
        {cancellationRequest && cancellationRequest.status !== 'PENDING' && (
          <button
            onClick={() => setViewMode('dispute')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <MessageSquare style={{ width: '1.25rem', height: '1.25rem' }} />
            申請爭議處理
          </button>
        )}
      </div>

      {/* 重要提醒 */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '0.75rem',
        border: '1px solid #bae6fd'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#0c4a6e',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertTriangle style={{ width: '1rem', height: '1rem' }} />
          重要提醒
        </h4>
        
        <ul style={{
          fontSize: '0.875rem',
          color: '#0c4a6e',
          margin: 0,
          paddingLeft: '1.25rem'
        }}>
          <li>取消政策：服務開始前24小時內無法取消</li>
          <li>退款時間：審核通過後3-7個工作日內到帳</li>
          <li>如有爭議：可透過平台爭議處理機制申請調解</li>
          <li>聯繫客服：0800-123-456 或 support@guidee.com</li>
        </ul>
      </div>

      {/* 聯繫資訊 */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          需要協助？
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Phone style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                客服電話
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                0800-123-456
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Mail style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                客服信箱
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                support@guidee.com
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                服務時間
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                週一至週日 9:00-21:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: viewMode === 'overview' ? '48rem' : '64rem',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }} className={className}>
        {/* 標題欄 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 0.25rem'
            }}>
              {viewMode === 'overview' && '預訂管理'}
              {viewMode === 'cancel' && '取消預訂'}
              {viewMode === 'track' && '退款追蹤'}
              {viewMode === 'dispute' && '爭議處理'}
            </h2>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              訂單編號：{order.orderNumber}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {viewMode !== 'overview' && (
              <button
                onClick={() => setViewMode('overview')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                返回總覽
              </button>
            )}
            
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
            >
              <X style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          </div>
        </div>

        {/* 內容區域 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {viewMode === 'overview' && renderOverview()}
          
          {viewMode === 'cancel' && (
            <CustomerCancellationInterface
              order={order}
              onClose={() => setViewMode('overview')}
              onSuccess={handleCancellationSuccess}
            />
          )}
          
          {viewMode === 'track' && (
            <RefundTrackingInterface
              userId={order.userId}
            />
          )}
          
          {viewMode === 'dispute' && (
            <DisputeResolutionInterface
              disputeId="dispute-001"
              userRole="CUSTOMER"
            />
          )}
        </div>
      </div>
    </div>
  );
}