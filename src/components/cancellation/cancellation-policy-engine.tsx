'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, AlertTriangle, Info, Settings, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { CancellationPolicy, CancellationRule, RefundCalculation } from '@/types/cancellation';

interface CancellationPolicyEngineProps {
  className?: string;
  onPolicyChange?: (policy: CancellationPolicy) => void;
  editMode?: boolean;
}

// 模擬的取消政策數據
const mockPolicies: CancellationPolicy[] = [
  {
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
  },
  {
    id: 'policy-2',
    name: '靈活取消政策',
    description: '提供更寬鬆的取消條件，適用於高價值服務',
    isDefault: false,
    rules: [
      {
        id: 'rule-5',
        hoursBeforeStart: 48,
        refundPercentage: 100,
        processingFee: 0,
        description: '服務開始前48小時取消，可獲得100%退款'
      },
      {
        id: 'rule-6',
        hoursBeforeStart: 24,
        refundPercentage: 80,
        processingFee: 50,
        description: '服務開始前24-48小時取消，可獲得80%退款（扣除50元手續費）'
      },
      {
        id: 'rule-7',
        hoursBeforeStart: 12,
        refundPercentage: 50,
        processingFee: 100,
        description: '服務開始前12-24小時取消，可獲得50%退款（扣除100元手續費）'
      },
      {
        id: 'rule-8',
        hoursBeforeStart: 0,
        refundPercentage: 25,
        processingFee: 150,
        description: '服務開始前12小時內取消，可獲得25%退款（扣除150元手續費）'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 'policy-3',
    name: '嚴格取消政策',
    description: '適用於特殊活動或限量服務的嚴格取消政策',
    isDefault: false,
    rules: [
      {
        id: 'rule-9',
        hoursBeforeStart: 168,
        refundPercentage: 100,
        processingFee: 0,
        description: '服務開始前7天取消，可獲得100%退款'
      },
      {
        id: 'rule-10',
        hoursBeforeStart: 72,
        refundPercentage: 50,
        processingFee: 200,
        description: '服務開始前3-7天取消，可獲得50%退款（扣除200元手續費）'
      },
      {
        id: 'rule-11',
        hoursBeforeStart: 0,
        refundPercentage: 0,
        processingFee: 0,
        description: '服務開始前3天內取消，無法退款'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  }
];

export function CancellationPolicyEngine({ 
  className = '', 
  onPolicyChange,
  editMode = false 
}: CancellationPolicyEngineProps) {
  const [policies, setPolicies] = useState<CancellationPolicy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<CancellationPolicy>(mockPolicies[0]!);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<CancellationPolicy | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  
  // 計算器相關狀態
  const [calculatorData, setCalculatorData] = useState({
    bookingAmount: 2000,
    serviceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    cancellationDate: new Date().toISOString().split('T')[0]
  });

  // 計算退款金額
  const calculateRefund = (
    policy: CancellationPolicy,
    bookingAmount: number,
    serviceDate: string,
    cancellationDate: string
  ): RefundCalculation => {
    const serviceDateObj = new Date(serviceDate + 'T00:00:00');
    const cancellationDateObj = new Date(cancellationDate + 'T00:00:00');
    const hoursUntilService = (serviceDateObj.getTime() - cancellationDateObj.getTime()) / (1000 * 60 * 60);

    // 找出適用的規則
    const applicableRule = policy.rules
      .sort((a, b) => b.hoursBeforeStart - a.hoursBeforeStart)
      .find(rule => hoursUntilService >= rule.hoursBeforeStart);

    if (!applicableRule) {
      // 如果沒有適用規則，使用最嚴格的規則
      const strictestRule = policy.rules[policy.rules.length - 1]!;
      return {
        totalAmount: bookingAmount,
        refundPercentage: strictestRule.refundPercentage,
        refundAmount: bookingAmount * (strictestRule.refundPercentage / 100),
        processingFee: strictestRule.processingFee,
        finalRefundAmount: Math.max(0, (bookingAmount * (strictestRule.refundPercentage / 100)) - strictestRule.processingFee),
        calculatedAt: new Date().toISOString(),
        policyApplied: {
          policyId: policy.id,
          policyName: policy.name,
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
        policyId: policy.id,
        policyName: policy.name,
        ruleApplied: applicableRule
      }
    };
  };

  const currentCalculation = calculateRefund(
    selectedPolicy,
    calculatorData.bookingAmount,
    calculatorData.serviceDate || '',
    calculatorData.cancellationDate || ''
  );

  // 新增規則
  const addRule = () => {
    if (!editingPolicy) return;
    
    const newRule: CancellationRule = {
      id: `rule-${Date.now()}`,
      hoursBeforeStart: 24,
      refundPercentage: 50,
      processingFee: 0,
      description: '新規則'
    };

    setEditingPolicy({
      ...editingPolicy,
      rules: [...editingPolicy.rules, newRule].sort((a, b) => b.hoursBeforeStart - a.hoursBeforeStart)
    });
  };

  // 刪除規則
  const deleteRule = (ruleId: string) => {
    if (!editingPolicy) return;
    
    setEditingPolicy({
      ...editingPolicy,
      rules: editingPolicy.rules.filter(rule => rule.id !== ruleId)
    });
  };

  // 更新規則
  const updateRule = (ruleId: string, updates: Partial<CancellationRule>) => {
    if (!editingPolicy) return;
    
    setEditingPolicy({
      ...editingPolicy,
      rules: editingPolicy.rules.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ).sort((a, b) => b.hoursBeforeStart - a.hoursBeforeStart)
    });
  };

  // 保存政策
  const savePolicy = () => {
    if (!editingPolicy) return;
    
    const updatedPolicies = policies.map(p => 
      p.id === editingPolicy.id ? editingPolicy : p
    );
    
    setPolicies(updatedPolicies);
    setSelectedPolicy(editingPolicy);
    setEditingPolicy(null);
    setIsEditing(false);
    
    if (onPolicyChange) {
      onPolicyChange(editingPolicy);
    }
  };

  // 取消編輯
  const cancelEdit = () => {
    setEditingPolicy(null);
    setIsEditing(false);
  };

  // 開始編輯
  const startEdit = () => {
    setEditingPolicy({ ...selectedPolicy });
    setIsEditing(true);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
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
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Settings style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
            取消政策引擎
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0.25rem 0 0'
          }}>
            管理和配置取消退款政策，自動計算退款金額
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: showCalculator ? '#3b82f6' : '#f3f4f6',
              color: showCalculator ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <DollarSign style={{ width: '1rem', height: '1rem' }} />
            退款計算器
          </button>
          {editMode && !isEditing && (
            <button
              onClick={startEdit}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Edit style={{ width: '1rem', height: '1rem' }} />
              編輯政策
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', height: '600px' }}>
        {/* 左側：政策列表 */}
        <div style={{
          width: '300px',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ padding: '1rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              取消政策
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {policies.map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy)}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    backgroundColor: selectedPolicy.id === policy.id ? 'white' : 'transparent',
                    border: selectedPolicy.id === policy.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {policy.name}
                    </span>
                    {policy.isDefault && (
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontSize: '0.75rem'
                      }}>
                        預設
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {policy.description}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: '0.25rem 0 0'
                  }}>
                    {policy.rules.length} 條規則
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右側：政策詳情和計算器 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 政策詳情 */}
          <div style={{ flex: 1, padding: '1.5rem' }}>
            {isEditing && editingPolicy ? (
              <div>
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
                    編輯政策
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={savePolicy}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Save style={{ width: '1rem', height: '1rem' }} />
                      保存
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <X style={{ width: '1rem', height: '1rem' }} />
                      取消
                    </button>
                  </div>
                </div>

                {/* 編輯表單 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    政策名稱
                  </label>
                  <input
                    type="text"
                    value={editingPolicy.name}
                    onChange={(e) => setEditingPolicy({
                      ...editingPolicy,
                      name: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    政策描述
                  </label>
                  <textarea
                    value={editingPolicy.description}
                    onChange={(e) => setEditingPolicy({
                      ...editingPolicy,
                      description: e.target.value
                    })}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* 規則編輯 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    取消規則
                  </h4>
                  <button
                    onClick={addRule}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {editingPolicy.rules.map((rule) => (
                    <div
                      key={rule.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                    >
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto',
                        gap: '1rem',
                        alignItems: 'center'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginBottom: '0.25rem'
                          }}>
                            提前時數
                          </label>
                          <input
                            type="number"
                            value={rule.hoursBeforeStart}
                            onChange={(e) => updateRule(rule.id, {
                              hoursBeforeStart: parseInt(e.target.value) || 0
                            })}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginBottom: '0.25rem'
                          }}>
                            退款比例 (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={rule.refundPercentage}
                            onChange={(e) => updateRule(rule.id, {
                              refundPercentage: parseInt(e.target.value) || 0
                            })}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginBottom: '0.25rem'
                          }}>
                            手續費 (NT$)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rule.processingFee}
                            onChange={(e) => updateRule(rule.id, {
                              processingFee: parseInt(e.target.value) || 0
                            })}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={rule.description}
                        onChange={(e) => updateRule(rule.id, {
                          description: e.target.value
                        })}
                        placeholder="規則描述"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          marginTop: '0.5rem'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {selectedPolicy.name}
                  </h3>
                  {selectedPolicy.isDefault && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem'
                    }}>
                      預設政策
                    </span>
                  )}
                </div>
                
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '1.5rem'
                }}>
                  {selectedPolicy.description}
                </p>

                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  取消規則
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedPolicy.rules.map((rule, index) => (
                    <div
                      key={rule.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                    >
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
                              手續費 NT$ {rule.processingFee}
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
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 退款計算器 */}
          {showCalculator && (
            <div style={{
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <DollarSign style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                退款計算器
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    預訂金額 (NT$)
                  </label>
                  <input
                    type="number"
                    value={calculatorData.bookingAmount}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData,
                      bookingAmount: parseInt(e.target.value) || 0
                    })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
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
                    服務日期
                  </label>
                  <input
                    type="date"
                    value={calculatorData.serviceDate}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData,
                      serviceDate: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
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
                    取消日期
                  </label>
                  <input
                    type="date"
                    value={calculatorData.cancellationDate}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData,
                      cancellationDate: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              {/* 計算結果 */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  退款計算結果
                </h4>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        原始金額：
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        NT$ {currentCalculation.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        退款比例：
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {currentCalculation.refundPercentage}%
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        退款金額：
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        NT$ {currentCalculation.refundAmount.toLocaleString()}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        手續費：
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#ef4444' }}>
                        - NT$ {currentCalculation.processingFee.toLocaleString()}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                        最終退款：
                      </span>
                      <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10b981' }}>
                        NT$ {currentCalculation.finalRefundAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#eff6ff',
                    borderRadius: '0.375rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <Info style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>
                        適用規則
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#1e40af',
                      margin: 0
                    }}>
                      {currentCalculation.policyApplied.ruleApplied.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}