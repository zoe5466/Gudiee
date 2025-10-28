'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  User,
  Calendar,
  AlertTriangle,
  Eye,
  Edit,
  CreditCard,
  FileText,
  Mail,
  Phone,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { 
  CancellationRequest, 
  RefundRecord, 
  RefundStatus, 
  RefundMethod,
  CancellationReason,
  RefundStatistics 
} from '@/types/cancellation';

interface AdminRefundDashboardProps {
  className?: string;
}

// 模擬數據
const mockCancellationRequests: CancellationRequest[] = [
  {
    id: 'cancel-001',
    bookingId: 'booking-001',
    orderId: 'order-001',
    userId: 'user-001',
    reason: 'USER_REQUEST',
    description: '個人行程變更，無法參加原定的旅遊活動',
    status: 'PENDING',
    requestedAt: '2024-01-20T10:30:00Z',
    booking: {
      id: 'booking-001',
      serviceTitle: '台北101 & 信義區深度導覽',
      serviceDate: '2024-02-15',
      totalAmount: 1848,
      guide: {
        id: 'guide-001',
        name: '張小美'
      },
      customer: {
        id: 'user-001',
        name: '王小明',
        email: 'wang@example.com'
      }
    },
    refundCalculation: {
      totalAmount: 1848,
      refundPercentage: 75,
      refundAmount: 1386,
      processingFee: 50,
      finalRefundAmount: 1336,
      calculatedAt: '2024-01-20T10:30:00Z',
      policyApplied: {
        policyId: 'policy-1',
        policyName: '標準取消政策',
        ruleApplied: {
          id: 'rule-2',
          hoursBeforeStart: 48,
          refundPercentage: 75,
          processingFee: 50,
          description: '服務開始前48-72小時取消，可獲得75%退款（扣除50元手續費）'
        }
      }
    }
  },
  {
    id: 'cancel-002',
    bookingId: 'booking-002',
    orderId: 'order-002',
    userId: 'user-002',
    reason: 'WEATHER',
    description: '因颱風警報發布，考量安全因素申請取消',
    status: 'APPROVED',
    requestedAt: '2024-01-19T14:20:00Z',
    processedAt: '2024-01-19T16:45:00Z',
    processedBy: 'admin-001',
    adminNotes: '因天災因素批准全額退款',
    booking: {
      id: 'booking-002',
      serviceTitle: '陽明山國家公園生態導覽',
      serviceDate: '2024-02-10',
      totalAmount: 2200,
      guide: {
        id: 'guide-002',
        name: '李大華'
      },
      customer: {
        id: 'user-002',
        name: '陳小華',
        email: 'chen@example.com'
      }
    },
    refundCalculation: {
      totalAmount: 2200,
      refundPercentage: 100,
      refundAmount: 2200,
      processingFee: 0,
      finalRefundAmount: 2200,
      calculatedAt: '2024-01-19T14:20:00Z',
      policyApplied: {
        policyId: 'policy-1',
        policyName: '標準取消政策',
        ruleApplied: {
          id: 'rule-1',
          hoursBeforeStart: 72,
          refundPercentage: 100,
          processingFee: 0,
          description: '服務開始前72小時取消，可獲得100%退款'
        }
      }
    }
  }
];

const mockRefundRecords: RefundRecord[] = [
  {
    id: 'refund-001',
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
    externalTransactionId: 'txn_refund_123456',
    adminNotes: '天災因素全額退款，已完成處理'
  }
];

const mockStatistics: RefundStatistics = {
  totalRefunds: 156,
  totalRefundAmount: 468000,
  averageRefundAmount: 3000,
  refundsByStatus: {
    PENDING: 8,
    PROCESSING: 12,
    APPROVED: 4,
    REJECTED: 2,
    COMPLETED: 126,
    FAILED: 4
  },
  refundsByReason: {
    USER_REQUEST: 89,
    GUIDE_UNAVAILABLE: 23,
    WEATHER: 15,
    FORCE_MAJEURE: 8,
    SCHEDULE_CONFLICT: 12,
    HEALTH_SAFETY: 6,
    QUALITY_ISSUE: 3,
    OTHER: 0
  },
  refundsByMonth: [
    { month: '2024-01', count: 45, amount: 135000 },
    { month: '2024-02', count: 38, amount: 114000 },
    { month: '2024-03', count: 42, amount: 126000 },
    { month: '2024-04', count: 31, amount: 93000 }
  ],
  processingTimes: {
    average: 4.2,
    median: 3.5,
    fastest: 0.5,
    slowest: 24
  }
};

const statusColors = {
  PENDING: { bg: '#fef3c7', text: '#92400e', icon: Clock },
  PROCESSING: { bg: '#dbeafe', text: '#1e40af', icon: RefreshCw },
  APPROVED: { bg: '#d1fae5', text: '#065f46', icon: CheckCircle },
  REJECTED: { bg: '#fee2e2', text: '#991b1b', icon: XCircle },
  COMPLETED: { bg: '#d1fae5', text: '#065f46', icon: CheckCircle },
  FAILED: { bg: '#fee2e2', text: '#991b1b', icon: XCircle }
};

const reasonLabels = {
  USER_REQUEST: '個人原因',
  GUIDE_UNAVAILABLE: '嚮導無法提供服務',
  WEATHER: '天氣因素',
  FORCE_MAJEURE: '不可抗力',
  SCHEDULE_CONFLICT: '時間衝突',
  HEALTH_SAFETY: '健康安全',
  QUALITY_ISSUE: '服務品質',
  OTHER: '其他'
};

export function AdminRefundDashboard({ className = '' }: AdminRefundDashboardProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'refunds' | 'analytics'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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

  const handleProcessRequest = async (requestId: string, action: 'approve' | 'reject', notes?: string) => {
    setIsProcessing(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (action === 'approve') {
        alert(`已批准取消申請 ${requestId}${notes ? `\n備註：${notes}` : ''}`);
      } else {
        alert(`已拒絕取消申請 ${requestId}${notes ? `\n原因：${notes}` : ''}`);
      }
      
      setSelectedRequest(null);
    } catch (error) {
      alert('處理失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const renderRequestsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 搜尋和篩選 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '300px' }}>
          <Search style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
          <input
            type="text"
            placeholder="搜尋訂單編號、客戶姓名或服務名稱..."
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
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">所有狀態</option>
          <option value="PENDING">待處理</option>
          <option value="APPROVED">已批准</option>
          <option value="REJECTED">已拒絕</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">所有時間</option>
          <option value="today">今天</option>
          <option value="week">本週</option>
          <option value="month">本月</option>
        </select>

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
          匯出
        </button>
      </div>

      {/* 請求列表 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          <div>客戶資訊</div>
          <div>服務資訊</div>
          <div>取消原因</div>
          <div>退款金額</div>
          <div>狀態</div>
          <div>操作</div>
        </div>

        {mockCancellationRequests.map((request) => (
          <React.Fragment key={request.id}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
              gap: '1rem',
              padding: '1rem',
              borderBottom: '1px solid #f3f4f6',
              alignItems: 'center',
              fontSize: '0.875rem'
            }}>
              {/* 客戶資訊 */}
              <div>
                <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                  {request.booking.customer.name}
                </div>
                <div style={{ color: '#6b7280' }}>
                  {request.booking.customer.email}
                </div>
              </div>

              {/* 服務資訊 */}
              <div>
                <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                  {request.booking.serviceTitle}
                </div>
                <div style={{ color: '#6b7280' }}>
                  {formatDate(request.booking.serviceDate)}
                </div>
              </div>

              {/* 取消原因 */}
              <div>
                <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                  {reasonLabels[request.reason]}
                </div>
                <div style={{ color: '#6b7280' }}>
                  申請時間：{formatDate(request.requestedAt)}
                </div>
              </div>

              {/* 退款金額 */}
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                  {formatCurrency(request.refundCalculation?.finalRefundAmount || 0)}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  原價：{formatCurrency(request.booking.totalAmount)}
                </div>
              </div>

              {/* 狀態 */}
              <div>
                {(() => {
                  const statusConfig = statusColors[request.status as keyof typeof statusColors];
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: statusConfig.bg,
                      color: statusConfig.text,
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      width: 'fit-content'
                    }}>
                      <StatusIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                      {request.status === 'PENDING' && '待處理'}
                      {request.status === 'APPROVED' && '已批准'}
                      {request.status === 'REJECTED' && '已拒絕'}
                    </div>
                  );
                })()}
              </div>

              {/* 操作 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleRowExpansion(request.id)}
                  style={{
                    padding: '0.375rem',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  {expandedRows.has(request.id) ? (
                    <ChevronUp style={{ width: '1rem', height: '1rem' }} />
                  ) : (
                    <ChevronDown style={{ width: '1rem', height: '1rem' }} />
                  )}
                </button>
                
                {request.status === 'PENDING' && (
                  <button
                    onClick={() => setSelectedRequest(request)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    處理
                  </button>
                )}
              </div>
            </div>

            {/* 展開的詳細資訊 */}
            {expandedRows.has(request.id) && (
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {/* 取消詳情 */}
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '0.75rem'
                    }}>
                      取消詳情
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        <span style={{ color: '#6b7280' }}>原因：</span>
                        <span style={{ color: '#111827', fontWeight: '500' }}>
                          {reasonLabels[request.reason]}
                        </span>
                      </div>
                      {request.description && (
                        <div style={{ fontSize: '0.875rem' }}>
                          <span style={{ color: '#6b7280' }}>說明：</span>
                          <p style={{ color: '#111827', margin: '0.25rem 0 0', fontStyle: 'italic' }}>
                            "{request.description}"
                          </p>
                        </div>
                      )}
                      {request.adminNotes && (
                        <div style={{ fontSize: '0.875rem' }}>
                          <span style={{ color: '#6b7280' }}>管理員備註：</span>
                          <p style={{ color: '#111827', margin: '0.25rem 0 0' }}>
                            {request.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 退款計算 */}
                  {request.refundCalculation && (
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '0.75rem'
                      }}>
                        退款計算
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.875rem'
                        }}>
                          <span style={{ color: '#6b7280' }}>原始金額：</span>
                          <span style={{ color: '#111827' }}>
                            {formatCurrency(request.refundCalculation.totalAmount)}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.875rem'
                        }}>
                          <span style={{ color: '#6b7280' }}>退款比例：</span>
                          <span style={{ color: '#111827' }}>
                            {request.refundCalculation.refundPercentage}%
                          </span>
                        </div>
                        {request.refundCalculation.processingFee > 0 && (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.875rem'
                          }}>
                            <span style={{ color: '#6b7280' }}>手續費：</span>
                            <span style={{ color: '#ef4444' }}>
                              -{formatCurrency(request.refundCalculation.processingFee)}
                            </span>
                          </div>
                        )}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          paddingTop: '0.5rem',
                          borderTop: '1px solid #d1d5db'
                        }}>
                          <span style={{ color: '#111827' }}>最終退款：</span>
                          <span style={{ color: '#10b981' }}>
                            {formatCurrency(request.refundCalculation.finalRefundAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderRefundsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 退款記錄列表 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          <div>退款ID</div>
          <div>金額</div>
          <div>方式</div>
          <div>狀態</div>
          <div>處理時間</div>
          <div>操作</div>
        </div>

        {mockRefundRecords.map((refund) => (
          <div
            key={refund.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
              gap: '1rem',
              padding: '1rem',
              borderBottom: '1px solid #f3f4f6',
              alignItems: 'center',
              fontSize: '0.875rem'
            }}
          >
            <div>
              <div style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                {refund.id}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                {refund.externalTransactionId}
              </div>
            </div>

            <div style={{ fontWeight: '600', color: '#111827' }}>
              {formatCurrency(refund.amount)}
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CreditCard style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                <span>
                  {refund.method === 'ORIGINAL_PAYMENT' && '原付款方式'}
                  {refund.method === 'BANK_TRANSFER' && '銀行轉帳'}
                  {refund.method === 'CREDIT' && '平台信用'}
                  {refund.method === 'VOUCHER' && '優惠券'}
                </span>
              </div>
            </div>

            <div>
              {(() => {
                const statusConfig = statusColors[refund.status as keyof typeof statusColors];
                const StatusIcon = statusConfig.icon;
                return (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.75rem',
                    backgroundColor: statusConfig.bg,
                    color: statusConfig.text,
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    width: 'fit-content'
                  }}>
                    <StatusIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                    {refund.status === 'PENDING' && '待處理'}
                    {refund.status === 'PROCESSING' && '處理中'}
                    {refund.status === 'COMPLETED' && '已完成'}
                    {refund.status === 'FAILED' && '失敗'}
                  </div>
                );
              })()}
            </div>

            <div style={{ color: '#6b7280' }}>
              {refund.completedAt ? formatDate(refund.completedAt) : '-'}
            </div>

            <div>
              <button
                style={{
                  padding: '0.375rem',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <Eye style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 統計卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              總退款次數
            </h3>
            <BarChart3 style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {mockStatistics.totalRefunds}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.875rem',
            color: '#10b981'
          }}>
            <TrendingUp style={{ width: '1rem', height: '1rem' }} />
            +12.5% 較上月
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              總退款金額
            </h3>
            <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {formatCurrency(mockStatistics.totalRefundAmount)}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.875rem',
            color: '#ef4444'
          }}>
            <TrendingDown style={{ width: '1rem', height: '1rem' }} />
            -3.2% 較上月
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              平均退款金額
            </h3>
            <BarChart3 style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b' }} />
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {formatCurrency(mockStatistics.averageRefundAmount)}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            中位數：{formatCurrency(2800)}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              平均處理時間
            </h3>
            <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#8b5cf6' }} />
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {mockStatistics.processingTimes.average}h
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            最快：{mockStatistics.processingTimes.fastest}h
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        {/* 退款原因分佈 */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            退款原因分佈
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(mockStatistics.refundsByReason).map(([reason, count]) => (
              <div key={reason} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%'
                  }} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {reasonLabels[reason as CancellationReason]}
                  </span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 月度趨勢 */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            月度退款趨勢
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mockStatistics.refundsByMonth.map((month) => (
              <div key={month.month} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {month.month}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {month.count}次
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {formatCurrency(month.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#111827',
          margin: 0
        }}>
          退款管理中心
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
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
              cursor: 'pointer'
            }}
          >
            <RefreshCw style={{ width: '1rem', height: '1rem' }} />
            重新整理
          </button>
        </div>
      </div>

      {/* 標籤切換 */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc'
      }}>
        {[
          { key: 'requests', label: '取消申請', count: mockCancellationRequests.length },
          { key: 'refunds', label: '退款記錄', count: mockRefundRecords.length },
          { key: 'analytics', label: '數據分析', count: null }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 1.5rem',
              backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
              color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span style={{
                padding: '0.125rem 0.5rem',
                backgroundColor: activeTab === tab.key ? '#3b82f6' : '#9ca3af',
                color: 'white',
                borderRadius: '0.75rem',
                fontSize: '0.75rem'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 內容區域 */}
      <div style={{ padding: '1.5rem' }}>
        {activeTab === 'requests' && renderRequestsTab()}
        {activeTab === 'refunds' && renderRefundsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>

      {/* 處理對話框 */}
      {selectedRequest && (
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
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '32rem',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              處理取消申請
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                客戶：{selectedRequest.booking.customer.name}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                服務：{selectedRequest.booking.serviceTitle}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                退款金額：{formatCurrency(selectedRequest.refundCalculation?.finalRefundAmount || 0)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => handleProcessRequest(selectedRequest.id, 'approve')}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: isProcessing ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                <CheckCircle style={{ width: '1rem', height: '1rem' }} />
                批准
              </button>
              
              <button
                onClick={() => handleProcessRequest(selectedRequest.id, 'reject')}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: isProcessing ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                <XCircle style={{ width: '1rem', height: '1rem' }} />
                拒絕
              </button>
              
              <button
                onClick={() => setSelectedRequest(null)}
                disabled={isProcessing}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}