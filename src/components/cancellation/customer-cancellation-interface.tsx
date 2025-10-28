'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  MapPin,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';
import { 
  CancellationRequest, 
  CancellationReason, 
  RefundCalculation,
  CancellationPolicy 
} from '@/types/cancellation';
import { Order } from '@/types/order';

interface CustomerCancellationInterfaceProps {
  order: Order;
  onClose: () => void;
  onSuccess: (cancellationRequest: CancellationRequest) => void;
  className?: string;
}

const cancellationReasons: Array<{
  value: CancellationReason;
  label: string;
  description: string;
}> = [
  {
    value: 'USER_REQUEST',
    label: '個人原因',
    description: '因個人行程變更或其他個人因素'
  },
  {
    value: 'SCHEDULE_CONFLICT',
    label: '時間衝突',
    description: '與其他活動或行程產生時間衝突'
  },
  {
    value: 'HEALTH_SAFETY',
    label: '健康安全考量',
    description: '因健康狀況或安全考慮需要取消'
  },
  {
    value: 'WEATHER',
    label: '天氣因素',
    description: '因天氣不佳影響活動進行'
  },
  {
    value: 'GUIDE_UNAVAILABLE',
    label: '嚮導無法提供服務',
    description: '嚮導因故無法提供原定服務'
  },
  {
    value: 'FORCE_MAJEURE',
    label: '不可抗力因素',
    description: '天災、疫情等不可抗力因素'
  },
  {
    value: 'QUALITY_ISSUE',
    label: '服務品質問題',
    description: '對服務內容或品質有疑慮'
  },
  {
    value: 'OTHER',
    label: '其他原因',
    description: '其他未列出的原因'
  }
];

// 模擬的取消政策數據
const mockCancellationPolicy: CancellationPolicy = {
  id: 'policy-1',
  name: '標準取消政策',
  description: '適用於大部分旅遊服務的標準取消政策',
  isDefault: true,
  rules: [
    {
      id: 'rule-1',
      hoursBeforeStart: 72,
      refundPercentage: 100,
      processingFee: 0,
      description: '服務開始前72小時取消，可獲得100%退款'
    },
    {
      id: 'rule-2',
      hoursBeforeStart: 48,
      refundPercentage: 75,
      processingFee: 50,
      description: '服務開始前48-72小時取消，可獲得75%退款（扣除50元手續費）'
    },
    {
      id: 'rule-3',
      hoursBeforeStart: 24,
      refundPercentage: 50,
      processingFee: 100,
      description: '服務開始前24-48小時取消，可獲得50%退款（扣除100元手續費）'
    },
    {
      id: 'rule-4',
      hoursBeforeStart: 0,
      refundPercentage: 0,
      processingFee: 0,
      description: '服務開始前24小時內取消，無法退款'
    }
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
};

export function CustomerCancellationInterface({
  order,
  onClose,
  onSuccess,
  className = ''
}: CustomerCancellationInterfaceProps) {
  const [step, setStep] = useState(1); // 1: 政策確認, 2: 原因選擇, 3: 詳細資訊, 4: 確認
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [description, setDescription] = useState('');
  const [refundCalculation, setRefundCalculation] = useState<RefundCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 計算退款金額
  const calculateRefund = (): RefundCalculation => {
    const bookingAmount = order.pricing.total;
    const serviceDate = order.booking.date + 'T' + order.booking.startTime;
    const cancellationDate = new Date().toISOString();
    
    const serviceDateObj = new Date(serviceDate);
    const cancellationDateObj = new Date(cancellationDate);
    const hoursUntilService = (serviceDateObj.getTime() - cancellationDateObj.getTime()) / (1000 * 60 * 60);

    // 找出適用的規則
    const applicableRule = mockCancellationPolicy.rules
      .sort((a, b) => b.hoursBeforeStart - a.hoursBeforeStart)
      .find(rule => hoursUntilService >= rule.hoursBeforeStart);

    if (!applicableRule) {
      // 如果沒有適用規則，使用最嚴格的規則
      const strictestRule = mockCancellationPolicy.rules[mockCancellationPolicy.rules.length - 1]!;
      return {
        totalAmount: bookingAmount,
        refundPercentage: strictestRule.refundPercentage,
        refundAmount: bookingAmount * (strictestRule.refundPercentage / 100),
        processingFee: strictestRule.processingFee,
        finalRefundAmount: Math.max(0, (bookingAmount * (strictestRule.refundPercentage / 100)) - strictestRule.processingFee),
        calculatedAt: new Date().toISOString(),
        policyApplied: {
          policyId: mockCancellationPolicy.id,
          policyName: mockCancellationPolicy.name,
          ruleApplied: strictestRule
        }
      };
    }

    const refundAmount = bookingAmount * (applicableRule.refundPercentage / 100);
    const finalRefundAmount = Math.max(0, refundAmount - applicableRule.processingFee);

    return {
      totalAmount: bookingAmount,
      refundPercentage: applicableRule.refundPercentage,
      refundAmount,
      processingFee: applicableRule.processingFee,
      finalRefundAmount,
      calculatedAt: new Date().toISOString(),
      policyApplied: {
        policyId: mockCancellationPolicy.id,
        policyName: mockCancellationPolicy.name,
        ruleApplied: applicableRule
      }
    };
  };

  useEffect(() => {
    setRefundCalculation(calculateRefund());
  }, [order]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (!selectedReason || !refundCalculation) {
      setError('請填寫所有必要資訊');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));

      const cancellationRequest: CancellationRequest = {
        id: `cancel-${Date.now()}`,
        bookingId: order.id,
        orderId: order.id,
        userId: order.userId,
        reason: selectedReason,
        customReason: selectedReason === 'OTHER' ? customReason : undefined,
        description: description || undefined,
        status: 'PENDING',
        requestedAt: new Date().toISOString(),
        booking: {
          id: order.id,
          serviceTitle: order.booking.serviceName,
          serviceDate: order.booking.date,
          totalAmount: order.pricing.total,
          guide: {
            id: order.booking.guideId,
            name: order.booking.guideName,
          },
          customer: {
            id: order.userId,
            name: order.customer.name,
            email: order.customer.email,
          },
        },
        refundCalculation
      };

      onSuccess(cancellationRequest);
    } catch (error) {
      console.error('Cancellation error:', error);
      setError('取消申請失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return selectedReason !== null;
      case 3:
        if (selectedReason === 'OTHER') {
          return customReason.trim().length > 0;
        }
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <AlertTriangle style={{ 
                width: '4rem', 
                height: '4rem', 
                color: '#f59e0b', 
                margin: '0 auto 1rem' 
              }} />
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.5rem' 
              }}>
                取消政策說明
              </h3>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                請仔細閱讀以下取消政策，了解退款規則
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827', 
                marginBottom: '1rem' 
              }}>
                {mockCancellationPolicy.name}
              </h4>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                marginBottom: '1.5rem' 
              }}>
                {mockCancellationPolicy.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {mockCancellationPolicy.rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Clock style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            {rule.hoursBeforeStart > 0 
                              ? `提前 ${rule.hoursBeforeStart} 小時`
                              : '服務開始後'
                            }
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <DollarSign style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            退款 {rule.refundPercentage}%
                          </span>
                        </div>
                        {rule.processingFee > 0 && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} />
                            <span style={{ fontSize: '0.875rem', color: '#f59e0b' }}>
                              手續費 {formatCurrency(rule.processingFee)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {rule.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {refundCalculation && (
              <div style={{
                backgroundColor: '#eff6ff',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #bfdbfe'
              }}>
                <h4 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1e40af', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <DollarSign style={{ width: '1.25rem', height: '1.25rem' }} />
                  您的退款試算
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>原始金額：</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>
                      {formatCurrency(refundCalculation.totalAmount)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>退款比例：</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>
                      {refundCalculation.refundPercentage}%
                    </span>
                  </div>
                  {refundCalculation.processingFee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>手續費：</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#ef4444' }}>
                        - {formatCurrency(refundCalculation.processingFee)}
                      </span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #bfdbfe',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1e40af' }}>
                      預計退款：
                    </span>
                    <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10b981' }}>
                      {formatCurrency(refundCalculation.finalRefundAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <FileText style={{ 
                width: '3rem', 
                height: '3rem', 
                color: '#3b82f6', 
                margin: '0 auto 1rem' 
              }} />
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.5rem' 
              }}>
                選擇取消原因
              </h3>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                請選擇最符合您情況的取消原因
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cancellationReasons.map((reason) => (
                <label
                  key={reason.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: `2px solid ${selectedReason === reason.value ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    backgroundColor: selectedReason === reason.value ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '64px'
                  }}
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value as CancellationReason)}
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      accentColor: '#3b82f6'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '0.25rem'
                    }}>
                      {reason.label}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {reason.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <FileText style={{ 
                width: '3rem', 
                height: '3rem', 
                color: '#3b82f6', 
                margin: '0 auto 1rem' 
              }} />
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.5rem' 
              }}>
                詳細說明
              </h3>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                請提供更多關於取消原因的詳細說明
              </p>
            </div>

            {selectedReason === 'OTHER' && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  取消原因 *
                </label>
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="請簡述您的取消原因"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    minHeight: '48px'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                詳細說明 {selectedReason !== 'OTHER' && '(可選)'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="請提供更多詳細資訊，這將有助於我們處理您的取消申請"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>

            <div style={{
              backgroundColor: '#fef3c7',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #fbbf24'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem'
              }}>
                <AlertTriangle style={{ 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  color: '#f59e0b',
                  flexShrink: 0,
                  marginTop: '0.125rem'
                }} />
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#92400e',
                    margin: '0 0 0.5rem'
                  }}>
                    重要提醒
                  </p>
                  <ul style={{
                    fontSize: '0.875rem',
                    color: '#92400e',
                    margin: 0,
                    paddingLeft: '1rem',
                    listStyle: 'disc'
                  }}>
                    <li>提交申請後，我們將在24小時內審核</li>
                    <li>退款將於審核通過後3-7個工作日內到帳</li>
                    <li>如有緊急情況，請直接聯繫客服</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircle style={{ 
                width: '4rem', 
                height: '4rem', 
                color: '#10b981', 
                margin: '0 auto 1rem' 
              }} />
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.5rem' 
              }}>
                確認取消申請
              </h3>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                請確認以下資訊無誤後，提交取消申請
              </p>
            </div>

            {/* 訂單資訊摘要 */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827', 
                marginBottom: '1rem' 
              }}>
                訂單資訊
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>服務名稱：</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {order.booking.serviceName}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>嚮導：</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {order.booking.guideName}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>日期：</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {formatDate(order.booking.date)} {order.booking.startTime}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>地點：</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {order.booking.location.name}
                  </span>
                </div>
              </div>
            </div>

            {/* 取消原因摘要 */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827', 
                marginBottom: '1rem' 
              }}>
                取消原因
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {cancellationReasons.find(r => r.value === selectedReason)?.label}
                  </span>
                  {selectedReason === 'OTHER' && customReason && (
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                      - {customReason}
                    </span>
                  )}
                </div>
                {description && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: '0.5rem 0 0',
                    fontStyle: 'italic'
                  }}>
                    &quot;{description}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* 退款資訊 */}
            {refundCalculation && (
              <div style={{
                backgroundColor: '#f0fdf4',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
                  退款資訊
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#065f46' }}>原始金額：</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#065f46' }}>
                      {formatCurrency(refundCalculation.totalAmount)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#065f46' }}>退款比例：</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#065f46' }}>
                      {refundCalculation.refundPercentage}%
                    </span>
                  </div>
                  {refundCalculation.processingFee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#065f46' }}>手續費：</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#ef4444' }}>
                        - {formatCurrency(refundCalculation.processingFee)}
                      </span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #bbf7d0',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#065f46' }}>
                      預計退款：
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                      {formatCurrency(refundCalculation.finalRefundAmount)}
                    </span>
                  </div>
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#065f46'
                }}>
                  退款將於審核通過後3-7個工作日內退回至您的原付款方式
                </div>
              </div>
            )}

            {/* 聯繫資訊 */}
            <div style={{
              backgroundColor: '#eff6ff',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #bfdbfe'
            }}>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1e40af', 
                marginBottom: '1rem' 
              }}>
                需要協助？
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone style={{ width: '1rem', height: '1rem', color: '#1e40af' }} />
                  <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                    客服電話：0800-123-456
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail style={{ width: '1rem', height: '1rem', color: '#1e40af' }} />
                  <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                    客服信箱：support@guidee.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        maxWidth: '48rem',
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
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            取消預訂
          </h2>
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

        {/* 進度指示器 */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4].map((stepNumber, index) => (
              <React.Fragment key={stepNumber}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: step >= stepNumber ? '#3b82f6' : '#e5e7eb',
                    color: step >= stepNumber ? 'white' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {step > stepNumber ? '✓' : stepNumber}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: step >= stepNumber ? '#3b82f6' : '#6b7280',
                    fontWeight: step === stepNumber ? '600' : '400'
                  }}>
                    {stepNumber === 1 && '政策'}
                    {stepNumber === 2 && '原因'}
                    {stepNumber === 3 && '說明'}
                    {stepNumber === 4 && '確認'}
                  </span>
                </div>
                {index < 3 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: step > stepNumber ? '#3b82f6' : '#e5e7eb',
                    margin: '0 0.5rem'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 內容區域 */}
        <div style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
                <span style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '500' }}>
                  {error}
                </span>
              </div>
            </div>
          )}

          {renderStepContent()}
        </div>

        {/* 底部按鈕 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            {step === 1 ? '取消' : '上一步'}
          </button>

          <button
            onClick={() => {
              if (step < 4) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={!canProceed() || isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: !canProceed() || isSubmitting ? '#9ca3af' : step === 4 ? '#ef4444' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: !canProceed() || isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                提交中...
              </>
            ) : step === 4 ? (
              <>
                確認取消
                <CheckCircle style={{ width: '1rem', height: '1rem' }} />
              </>
            ) : (
              <>
                下一步
                <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}