'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Edit,
  Copy,
  Download,
  RefreshCw,
  Filter,
  Search,
  User,
  Calendar,
  FileText,
  Settings,
  Zap
} from 'lucide-react';
import { EmailNotification } from '@/types/cancellation';

interface EmailNotificationSystemProps {
  className?: string;
}

// 模擬郵件通知數據
const mockEmailNotifications: EmailNotification[] = [
  {
    id: 'email-001',
    type: 'CANCELLATION_CONFIRMED',
    recipientEmail: 'wang@example.com',
    recipientName: '王小明',
    subject: '取消申請已確認 - 台北101導覽',
    templateId: 'cancellation_confirmed',
    templateData: {
      customerName: '王小明',
      serviceName: '台北101 & 信義區深度導覽',
      cancellationId: 'cancel-001',
      refundAmount: 1336,
      refundMethod: '原付款方式',
      estimatedRefundDays: '3-7個工作日'
    },
    sentAt: '2024-01-20T15:30:00Z',
    status: 'SENT'
  },
  {
    id: 'email-002',
    type: 'REFUND_PROCESSED',
    recipientEmail: 'chen@example.com',
    recipientName: '陳小華',
    subject: '退款已處理完成 - 陽明山生態導覽',
    templateId: 'refund_processed',
    templateData: {
      customerName: '陳小華',
      serviceName: '陽明山國家公園生態導覽',
      refundAmount: 2200,
      refundId: 'refund-002',
      transactionId: 'txn_refund_002'
    },
    sentAt: '2024-01-20T09:15:00Z',
    status: 'SENT'
  },
  {
    id: 'email-003',
    type: 'DISPUTE_CREATED',
    recipientEmail: 'support@guidee.com',
    recipientName: '客服團隊',
    subject: '新爭議案件 - 退款金額爭議',
    templateId: 'dispute_created_admin',
    templateData: {
      disputeId: 'dispute-001',
      customerName: '王小明',
      disputeType: '退款爭議',
      priority: '中',
      assignedTo: 'admin-001'
    },
    sentAt: '2024-01-20T10:45:00Z',
    status: 'SENT'
  },
  {
    id: 'email-004',
    type: 'DISPUTE_RESOLVED',
    recipientEmail: 'wang@example.com',
    recipientName: '王小明',
    subject: '爭議已解決 - 退款金額調整',
    templateId: 'dispute_resolved',
    templateData: {
      customerName: '王小明',
      disputeId: 'dispute-001',
      resolution: '部分退款',
      additionalRefund: 500,
      resolutionDescription: '經調查後同意客戶申請，提供額外退款'
    },
    status: 'PENDING'
  },
  {
    id: 'email-005',
    type: 'CANCELLATION_CONFIRMED',
    recipientEmail: 'lee@example.com',
    recipientName: '李大明',
    subject: '取消申請已確認 - 淡水老街美食之旅',
    templateId: 'cancellation_confirmed',
    templateData: {
      customerName: '李大明',
      serviceName: '淡水老街美食文化導覽',
      cancellationId: 'cancel-005',
      refundAmount: 0,
      refundMethod: '',
      noRefundReason: '服務開始前24小時內取消'
    },
    status: 'FAILED',
    error: 'SMTP 連接失敗'
  }
];

const statusConfig = {
  PENDING: { color: '#f59e0b', bg: '#fef3c7', icon: Clock, label: '待發送' },
  SENT: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle, label: '已發送' },
  FAILED: { color: '#ef4444', bg: '#fee2e2', icon: XCircle, label: '發送失敗' }
};

const typeLabels = {
  CANCELLATION_CONFIRMED: '取消確認',
  REFUND_PROCESSED: '退款完成',
  DISPUTE_CREATED: '爭議建立',
  DISPUTE_RESOLVED: '爭議解決'
};

// 郵件模板
const emailTemplates = {
  cancellation_confirmed: {
    subject: '取消申請已確認 - {{serviceName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #111827; margin: 0; font-size: 24px;">取消申請已確認</h1>
        </div>
        
        <p>親愛的 {{customerName}}，</p>
        
        <p>您的取消申請已經確認，詳細資訊如下：</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>服務名稱：</strong>{{serviceName}}</p>
          <p><strong>取消編號：</strong>{{cancellationId}}</p>
          {{#if refundAmount}}
          <p><strong>退款金額：</strong>NT$ {{refundAmount}}</p>
          <p><strong>退款方式：</strong>{{refundMethod}}</p>
          <p><strong>預計到帳：</strong>{{estimatedRefundDays}}</p>
          {{else}}
          <p><strong>退款說明：</strong>{{noRefundReason}}</p>
          {{/if}}
        </div>
        
        <p>如有任何問題，請聯繫我們的客服團隊。</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 14px;">
          Guidee 旅遊導覽平台<br>
          客服電話：0800-123-456<br>
          客服信箱：support@guidee.com
        </p>
      </div>
    `
  },
  refund_processed: {
    subject: '退款已處理完成 - {{serviceName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #065f46; margin: 0; font-size: 24px;">退款已處理完成</h1>
        </div>
        
        <p>親愛的 {{customerName}}，</p>
        
        <p>您的退款已經處理完成，詳細資訊如下：</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>服務名稱：</strong>{{serviceName}}</p>
          <p><strong>退款金額：</strong>NT$ {{refundAmount}}</p>
          <p><strong>退款編號：</strong>{{refundId}}</p>
          <p><strong>交易編號：</strong>{{transactionId}}</p>
        </div>
        
        <p>退款將於1-2個工作日內到帳至您的原付款帳戶。</p>
        
        <p>感謝您使用 Guidee 服務，期待再次為您提供優質的旅遊體驗。</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 14px;">
          Guidee 旅遊導覽平台<br>
          客服電話：0800-123-456<br>
          客服信箱：support@guidee.com
        </p>
      </div>
    `
  }
};

export function EmailNotificationSystem({ className = '' }: EmailNotificationSystemProps) {
  const [emails, setEmails] = useState<EmailNotification[]>(mockEmailNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'SENT' | 'FAILED'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | keyof typeof typeLabels>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEmails = emails.filter(email => {
    if (statusFilter !== 'all' && email.status !== statusFilter) return false;
    if (typeFilter !== 'all' && email.type !== typeFilter) return false;
    if (searchQuery && 
        !email.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !email.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !email.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleResendEmail = async (emailId: string) => {
    setIsProcessing(true);
    try {
      // 模擬重新發送
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, status: 'SENT', sentAt: new Date().toISOString(), error: undefined }
          : email
      ));
      
      alert('郵件已重新發送');
    } catch (error) {
      alert('重新發送失敗');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderEmailPreview = (email: EmailNotification) => {
    const template = emailTemplates[email.templateId as keyof typeof emailTemplates];
    if (!template) return <div>模板不存在</div>;

    // 簡單的模板替換
    let html = template.html;
    Object.entries(email.templateData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, String(value || ''));
    });

    // 處理條件邏輯（簡化版）
    html = html.replace(/{{#if\s+(\w+)}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g, (match, condition, ifContent, elseContent) => {
      return email.templateData[condition] ? ifContent : elseContent;
    });
    
    html = html.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
      return email.templateData[condition] ? content : '';
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const getStatistics = () => {
    const total = emails.length;
    const sent = emails.filter(e => e.status === 'SENT').length;
    const pending = emails.filter(e => e.status === 'PENDING').length;
    const failed = emails.filter(e => e.status === 'FAILED').length;
    
    return { total, sent, pending, failed };
  };

  const stats = getStatistics();

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
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Mail style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
          郵件通知系統
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
            <Settings style={{ width: '1rem', height: '1rem' }} />
            設定
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

      {/* 統計資訊 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        padding: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            總郵件數
          </div>
        </div>
        
        <div style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>
            {stats.sent}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            已發送
          </div>
        </div>
        
        <div style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            待發送
          </div>
        </div>
        
        <div style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ef4444' }}>
            {stats.failed}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            發送失敗
          </div>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '300px' }}>
          <Search style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          <input
            type="text"
            placeholder="搜尋收件人、主題..."
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
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">所有狀態</option>
          <option value="PENDING">待發送</option>
          <option value="SENT">已發送</option>
          <option value="FAILED">發送失敗</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">所有類型</option>
          {Object.entries(typeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* 郵件列表 */}
      <div style={{ padding: '1.5rem' }}>
        {filteredEmails.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <Mail style={{ 
              width: '3rem', 
              height: '3rem', 
              color: '#d1d5db', 
              margin: '0 auto 1rem' 
            }} />
            <p style={{ fontSize: '1rem', margin: 0 }}>
              沒有找到符合條件的郵件記錄
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEmails.map((email) => {
              const status = statusConfig[email.status];
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={email.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    backgroundColor: '#fefefe',
                    transition: 'all 0.2s'
                  }}
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
                          {email.subject}
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

                        <div style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {typeLabels[email.type]}
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
                          <User style={{ width: '1rem', height: '1rem' }} />
                          {email.recipientName} ({email.recipientEmail})
                        </div>
                        
                        {email.sentAt && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar style={{ width: '1rem', height: '1rem' }} />
                            {formatDate(email.sentAt)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedEmail(email);
                          setShowPreview(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye style={{ width: '0.875rem', height: '0.875rem' }} />
                        預覽
                      </button>
                      
                      {email.status === 'FAILED' && (
                        <button
                          onClick={() => handleResendEmail(email.id)}
                          disabled={isProcessing}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: isProcessing ? '#9ca3af' : '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <RefreshCw style={{ 
                            width: '0.875rem', 
                            height: '0.875rem',
                            animation: isProcessing ? 'spin 1s linear infinite' : 'none'
                          }} />
                          重發
                        </button>
                      )}
                      
                      {email.status === 'PENDING' && (
                        <button
                          onClick={() => handleResendEmail(email.id)}
                          disabled={isProcessing}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: isProcessing ? '#9ca3af' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Send style={{ width: '0.875rem', height: '0.875rem' }} />
                          發送
                        </button>
                      )}
                    </div>
                  </div>

                  {email.error && (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#fee2e2',
                      borderRadius: '0.375rem',
                      border: '1px solid #fecaca'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#dc2626'
                        }}>
                          發送錯誤
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#dc2626',
                        marginTop: '0.25rem'
                      }}>
                        {email.error}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 郵件預覽對話框 */}
      {showPreview && selectedEmail && (
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
            {/* 預覽標題 */}
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
                郵件預覽
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <Copy style={{ width: '1rem', height: '1rem' }} />
                  複製
                </button>
                
                <button
                  onClick={() => setShowPreview(false)}
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
            </div>

            {/* 郵件資訊 */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <span style={{ color: '#6b7280' }}>收件人：</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {selectedEmail.recipientName} &lt;{selectedEmail.recipientEmail}&gt;
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>主題：</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {selectedEmail.subject}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>類型：</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {typeLabels[selectedEmail.type]}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>模板：</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {selectedEmail.templateId}
                  </span>
                </div>
              </div>
            </div>

            {/* 郵件內容 */}
            <div style={{
              padding: '1.5rem',
              maxHeight: 'calc(90vh - 200px)',
              overflowY: 'auto'
            }}>
              {renderEmailPreview(selectedEmail)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}