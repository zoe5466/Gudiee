'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  DollarSign, 
  CreditCard,
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Download,
  Mail,
  Phone,
  Building,
  ArrowUpRight,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  RefundRecord, 
  RefundStatus, 
  RefundMethod,
  CancellationRequest 
} from '@/types/cancellation';

interface RefundTrackingInterfaceProps {
  userId?: string; // 如果提供，只顯示該用戶的退款
  className?: string;
}

// 模擬退款數據
const mockRefundRecords: RefundRecord[] = [
  {
    id: 'refund-001',
    cancellationRequestId: 'cancel-001',
    bookingId: 'booking-001',
    orderId: 'order-001',
    amount: 1336,
    method: 'ORIGINAL_PAYMENT',
    status: 'PROCESSING',
    initiatedBy: 'system',
    processedBy: 'admin-001',
    initiatedAt: '2024-01-20T14:30:00Z',
    processedAt: '2024-01-20T15:45:00Z',
    externalTransactionId: 'txn_refund_001',
    adminNotes: '正常退款處理中',
    customerNotes: '感謝處理'
  },
  {
    id: 'refund-002',
    cancellationRequestId: 'cancel-002',
    bookingId: 'booking-002',
    orderId: 'order-002',
    amount: 2200,
    method: 'ORIGINAL_PAYMENT',
    status: 'COMPLETED',
    initiatedBy: 'admin-001',
    processedBy: 'admin-001',
    approvedBy: 'admin-001',
    initiatedAt: '2024-01-19T17:00:00Z',
    processedAt: '2024-01-19T17:30:00Z',
    completedAt: '2024-01-20T09:15:00Z',
    externalTransactionId: 'txn_refund_002',
    adminNotes: '天災因素全額退款，已完成',
    paymentGatewayResponse: {
      status: 'success',
      reference: 'stripe_re_1234567890'
    }
  },
  {
    id: 'refund-003',
    cancellationRequestId: 'cancel-003',
    bookingId: 'booking-003',
    orderId: 'order-003',
    amount: 850,
    method: 'BANK_TRANSFER',
    status: 'FAILED',
    initiatedBy: 'admin-002',
    processedBy: 'admin-002',
    initiatedAt: '2024-01-18T10:00:00Z',
    processedAt: '2024-01-18T11:20:00Z',
    adminNotes: '銀行資訊錯誤，需重新處理',
    error: {
      code: 'INVALID_BANK_ACCOUNT',
      message: '銀行帳戶資訊無效',
      details: {
        bankCode: 'XXX',
        accountNumber: 'XXX-XXXX'
      }
    }
  },
  {
    id: 'refund-004',
    cancellationRequestId: 'cancel-004',
    bookingId: 'booking-004',
    orderId: 'order-004',
    amount: 3200,
    method: 'CREDIT',
    status: 'COMPLETED',
    initiatedBy: 'admin-001',
    processedBy: 'admin-001',
    approvedBy: 'admin-001',
    initiatedAt: '2024-01-17T14:00:00Z',
    processedAt: '2024-01-17T14:30:00Z',
    completedAt: '2024-01-17T15:00:00Z',
    adminNotes: '轉換為平台信用額度'
  }
];

const statusConfig = {
  PENDING: { 
    color: '#f59e0b', 
    bg: '#fef3c7', 
    icon: Clock, 
    label: '待處理',
    description: '退款申請已提交，等待處理'
  },
  PROCESSING: { 
    color: '#3b82f6', 
    bg: '#dbeafe', 
    icon: RefreshCw, 
    label: '處理中',
    description: '退款正在處理中，預計1-3個工作日完成'
  },
  APPROVED: { 
    color: '#10b981', 
    bg: '#d1fae5', 
    icon: CheckCircle, 
    label: '已批准',
    description: '退款已批准，將於1-2個工作日內到帳'
  },
  REJECTED: { 
    color: '#ef4444', 
    bg: '#fee2e2', 
    icon: XCircle, 
    label: '已拒絕',
    description: '退款申請已被拒絕'
  },
  COMPLETED: { 
    color: '#10b981', 
    bg: '#d1fae5', 
    icon: CheckCircle, 
    label: '已完成',
    description: '退款已成功處理並到帳'
  },
  FAILED: { 
    color: '#ef4444', 
    bg: '#fee2e2', 
    icon: XCircle, 
    label: '處理失敗',
    description: '退款處理失敗，請聯繫客服'
  }
};

const methodConfig = {
  ORIGINAL_PAYMENT: { 
    icon: CreditCard, 
    label: '原付款方式',
    description: '退款至原信用卡或付款帳戶'
  },
  BANK_TRANSFER: { 
    icon: Building, 
    label: '銀行轉帳',
    description: '直接轉帳至指定銀行帳戶'
  },
  CREDIT: { 
    icon: DollarSign, 
    label: '平台信用',
    description: '轉換為平台信用額度'
  },
  VOUCHER: { 
    icon: ArrowUpRight, 
    label: '優惠券',
    description: '發放等值優惠券'
  }
};

export function RefundTrackingInterface({ 
  userId, 
  className = '' 
}: RefundTrackingInterfaceProps) {
  const [refunds, setRefunds] = useState<RefundRecord[]>(mockRefundRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RefundStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<RefundMethod | 'all'>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 過濾退款記錄
  const filteredRefunds = refunds.filter(refund => {
    if (userId && !refund.id.includes(userId)) return false;
    if (statusFilter !== 'all' && refund.status !== statusFilter) return false;
    if (methodFilter !== 'all' && refund.method !== methodFilter) return false;
    if (searchQuery && !refund.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !refund.externalTransactionId?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProcessingTime = (refund: RefundRecord) => {
    if (!refund.processedAt) return null;
    
    const start = new Date(refund.initiatedAt);
    const end = refund.completedAt ? new Date(refund.completedAt) : new Date(refund.processedAt);
    const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours} 小時`;
    } else {
      const days = Math.round(hours / 24);
      return `${days} 天`;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    // 模擬 API 調用
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const renderRefundTimeline = (refund: RefundRecord) => {
    const timelineSteps = [
      {
        key: 'initiated',
        label: '申請提交',
        timestamp: refund.initiatedAt,
        status: 'completed',
        description: `由 ${refund.initiatedBy} 發起退款申請`
      },
      {
        key: 'processed',
        label: '開始處理',
        timestamp: refund.processedAt,
        status: refund.processedAt ? 'completed' : 'pending',
        description: refund.processedAt ? `由 ${refund.processedBy} 開始處理` : '等待管理員處理'
      },
      {
        key: 'approved',
        label: '審核通過',
        timestamp: refund.approvedBy ? refund.processedAt : undefined,
        status: refund.approvedBy ? 'completed' : refund.status === 'REJECTED' ? 'failed' : 'pending',
        description: refund.approvedBy ? `由 ${refund.approvedBy} 批准` : refund.status === 'REJECTED' ? '申請被拒絕' : '等待審核'
      },
      {
        key: 'completed',
        label: '退款完成',
        timestamp: refund.completedAt,
        status: refund.completedAt ? 'completed' : refund.status === 'FAILED' ? 'failed' : 'pending',
        description: refund.completedAt ? '退款已成功到帳' : refund.status === 'FAILED' ? '處理失敗' : '處理中'
      }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {timelineSteps.map((step, index) => (
          <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: 
                step.status === 'completed' ? '#10b981' :
                step.status === 'failed' ? '#ef4444' : '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: step.status === 'pending' ? '#6b7280' : 'white',
              fontSize: '0.75rem',
              fontWeight: '600',
              flexShrink: 0
            }}>
              {step.status === 'completed' ? '✓' : 
               step.status === 'failed' ? '✗' : 
               index + 1}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: step.status === 'completed' ? '#10b981' : 
                       step.status === 'failed' ? '#ef4444' : '#6b7280',
                marginBottom: '0.25rem'
              }}>
                {step.label}
              </div>
              
              {step.timestamp && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  {formatDate(step.timestamp)}
                </div>
              )}
              
              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af'
              }}>
                {step.description}
              </div>
            </div>
            
            {index < timelineSteps.length - 1 && (
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '2.5rem',
                width: '2px',
                height: '1rem',
                backgroundColor: '#e5e7eb',
                transform: 'translateX(-50%)'
              }} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
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
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#111827',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
          退款追蹤
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={refreshData}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw style={{ 
              width: '1rem', 
              height: '1rem',
              animation: isLoading ? 'spin 1s linear infinite' : 'none'
            }} />
            重新整理
          </button>
          
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} />
            匯出記錄
          </button>
        </div>
      </div>

      {/* 篩選器 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '250px' }}>
          <Search style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          <input
            type="text"
            placeholder="搜尋退款ID或交易編號..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '0.875rem'
            }}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RefundStatus | 'all')}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">所有狀態</option>
          {Object.entries(statusConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value as RefundMethod | 'all')}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">所有方式</option>
          {Object.entries(methodConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* 退款列表 */}
      <div style={{ padding: '1.5rem' }}>
        {filteredRefunds.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <DollarSign style={{ 
              width: '3rem', 
              height: '3rem', 
              color: '#d1d5db', 
              margin: '0 auto 1rem' 
            }} />
            <p style={{ fontSize: '1rem', margin: 0 }}>
              沒有找到符合條件的退款記錄
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredRefunds.map((refund) => {
              const status = statusConfig[refund.status];
              const method = methodConfig[refund.method];
              const StatusIcon = status.icon;
              const MethodIcon = method.icon;
              
              return (
                <div
                  key={refund.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    backgroundColor: '#fefefe',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedRefund(refund)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          {refund.id}
                        </h3>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: status.bg,
                          color: status.color,
                          borderRadius: '0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          <StatusIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                          {status.label}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <MethodIcon style={{ width: '1rem', height: '1rem' }} />
                          {method.label}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <Calendar style={{ width: '1rem', height: '1rem' }} />
                          {formatDate(refund.initiatedAt)}
                        </div>
                        
                        {getProcessingTime(refund) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Clock style={{ width: '1rem', height: '1rem' }} />
                            處理時間：{getProcessingTime(refund)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        {formatCurrency(refund.amount)}
                      </div>
                      
                      {refund.externalTransactionId && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          fontFamily: 'monospace'
                        }}>
                          {refund.externalTransactionId}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        處理狀態
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRefund(refund);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.375rem 0.75rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye style={{ width: '0.875rem', height: '0.875rem' }} />
                        查看詳情
                      </button>
                    </div>
                    
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {status.description}
                    </div>
                    
                    {refund.error && (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: '#fee2e2',
                        borderRadius: '0.375rem',
                        border: '1px solid #fecaca'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem'
                        }}>
                          <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#dc2626'
                          }}>
                            處理錯誤
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#dc2626'
                        }}>
                          {refund.error.message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 詳細資訊對話框 */}
      {selectedRefund && (
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
            maxWidth: '48rem',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* 對話框標題 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                退款詳細資訊
              </h3>
              
              <button
                onClick={() => setSelectedRefund(null)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* 對話框內容 */}
            <div style={{
              padding: '1.5rem',
              maxHeight: 'calc(90vh - 120px)',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem'
              }}>
                {/* 基本資訊 */}
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    基本資訊
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        退款ID
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                        {selectedRefund.id}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        退款金額
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                        {formatCurrency(selectedRefund.amount)}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        退款方式
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#111827'
                      }}>
                        {React.createElement(methodConfig[selectedRefund.method].icon, {
                          style: { width: '1rem', height: '1rem' }
                        })}
                        {methodConfig[selectedRefund.method].label}
                      </div>
                    </div>
                    
                    {selectedRefund.externalTransactionId && (
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          交易編號
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: '#111827',
                          fontFamily: 'monospace',
                          backgroundColor: '#f3f4f6',
                          padding: '0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          {selectedRefund.externalTransactionId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 處理時間線 */}
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    處理進度
                  </h4>
                  
                  <div style={{ position: 'relative' }}>
                    {renderRefundTimeline(selectedRefund)}
                  </div>
                </div>
              </div>

              {/* 備註資訊 */}
              {(selectedRefund.adminNotes || selectedRefund.customerNotes) && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    備註資訊
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedRefund.adminNotes && (
                      <div style={{
                        padding: '1rem',
                        backgroundColor: '#eff6ff',
                        borderRadius: '0.5rem',
                        border: '1px solid #bfdbfe'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <Info style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#1e40af'
                          }}>
                            管理員備註
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#1e40af'
                        }}>
                          {selectedRefund.adminNotes}
                        </div>
                      </div>
                    )}
                    
                    {selectedRefund.customerNotes && (
                      <div style={{
                        padding: '1rem',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '0.5rem',
                        border: '1px solid #bbf7d0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <Info style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#065f46'
                          }}>
                            客戶備註
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#065f46'
                        }}>
                          {selectedRefund.customerNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 錯誤資訊 */}
              {selectedRefund.error && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    錯誤資訊
                  </h4>
                  
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#fee2e2',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#dc2626'
                      }}>
                        錯誤代碼：{selectedRefund.error.code}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#dc2626',
                      marginBottom: '0.5rem'
                    }}>
                      {selectedRefund.error.message}
                    </div>
                    
                    {selectedRefund.error.details && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#7f1d1d',
                        backgroundColor: '#fecaca',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        fontFamily: 'monospace'
                      }}>
                        {JSON.stringify(selectedRefund.error.details, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 聯繫客服 */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  需要協助？
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  如果您對退款進度有任何疑問，請聯繫我們的客服團隊
                </p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}>
                    <Phone style={{ width: '1rem', height: '1rem' }} />
                    0800-123-456
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}>
                    <Mail style={{ width: '1rem', height: '1rem' }} />
                    support@guidee.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}