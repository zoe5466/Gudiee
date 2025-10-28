'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Upload, 
  Send, 
  FileText, 
  Image, 
  Link, 
  User, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Plus,
  Edit,
  Trash2,
  Flag,
  Gavel,
  Users,
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { 
  DisputeCase, 
  DisputeStatus, 
  Evidence, 
  Communication 
} from '@/types/cancellation';

interface DisputeResolutionInterfaceProps {
  disputeId?: string;
  userRole: 'CUSTOMER' | 'GUIDE' | 'ADMIN';
  className?: string;
}

// 模擬爭議案例數據
const mockDispute: DisputeCase = {
  id: 'dispute-001',
  cancellationRequestId: 'cancel-001',
  refundRecordId: 'refund-001',
  bookingId: 'booking-001',
  type: 'REFUND_DISPUTE',
  title: '退款金額爭議',
  description: '客戶認為退款金額計算有誤，應獲得更多退款',
  status: 'INVESTIGATING',
  priority: 'MEDIUM',
  customer: {
    id: 'user-001',
    name: '王小明',
    email: 'wang@example.com'
  },
  guide: {
    id: 'guide-001',
    name: '張小美',
    email: 'zhang@example.com'
  },
  assignedTo: 'admin-001',
  evidence: [
    {
      id: 'evidence-001',
      type: 'TEXT',
      title: '原始取消政策',
      content: '根據我們的記錄，取消時間為服務開始前50小時，應適用75%退款政策',
      uploadedBy: 'user-001',
      uploadedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 'evidence-002',
      type: 'IMAGE',
      title: '取消確認截圖',
      content: 'https://example.com/cancellation-screenshot.png',
      uploadedBy: 'user-001',
      uploadedAt: '2024-01-20T10:35:00Z'
    },
    {
      id: 'evidence-003',
      type: 'TEXT',
      title: '系統日誌記錄',
      content: '系統記錄顯示取消時間為服務開始前47小時，適用50%退款政策',
      uploadedBy: 'admin-001',
      uploadedAt: '2024-01-20T15:20:00Z'
    }
  ],
  communications: [
    {
      id: 'comm-001',
      fromUserId: 'user-001',
      fromUserName: '王小明',
      fromUserRole: 'CUSTOMER',
      message: '我在服務開始前超過48小時就申請取消了，為什麼只能獲得50%退款？',
      sentAt: '2024-01-20T10:30:00Z',
      isInternal: false
    },
    {
      id: 'comm-002',
      fromUserId: 'admin-001',
      fromUserName: '客服專員',
      fromUserRole: 'ADMIN',
      message: '感謝您的反映，我們正在調查此案。初步檢查系統記錄，顯示您的取消時間為服務開始前47小時。',
      sentAt: '2024-01-20T14:15:00Z',
      isInternal: false
    },
    {
      id: 'comm-003',
      fromUserId: 'admin-002',
      fromUserName: '技術專員',
      fromUserRole: 'ADMIN',
      message: '內部備註：需要檢查時區設定問題，可能是系統時間計算錯誤。',
      sentAt: '2024-01-20T15:30:00Z',
      isInternal: true
    },
    {
      id: 'comm-004',
      fromUserId: 'guide-001',
      fromUserName: '張小美',
      fromUserRole: 'GUIDE',
      message: '我可以確認客戶是在週四晚上取消的，而服務是在週六上午，應該超過48小時。',
      sentAt: '2024-01-20T16:45:00Z',
      isInternal: false
    }
  ],
  createdAt: '2024-01-20T10:30:00Z',
  updatedAt: '2024-01-20T16:45:00Z'
};

const statusConfig = {
  OPEN: { color: '#3b82f6', bg: '#dbeafe', icon: Flag, label: '已開啟' },
  INVESTIGATING: { color: '#f59e0b', bg: '#fef3c7', icon: Eye, label: '調查中' },
  RESOLVED: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle, label: '已解決' },
  ESCALATED: { color: '#ef4444', bg: '#fee2e2', icon: AlertTriangle, label: '已升級' },
  CLOSED: { color: '#6b7280', bg: '#f3f4f6', icon: XCircle, label: '已關閉' }
};

const priorityConfig = {
  LOW: { color: '#10b981', label: '低' },
  MEDIUM: { color: '#f59e0b', label: '中' },
  HIGH: { color: '#ef4444', label: '高' },
  URGENT: { color: '#dc2626', label: '緊急' }
};

const typeLabels = {
  CANCELLATION_DISPUTE: '取消爭議',
  REFUND_DISPUTE: '退款爭議',
  SERVICE_QUALITY: '服務品質'
};

export function DisputeResolutionInterface({ 
  disputeId, 
  userRole, 
  className = '' 
}: DisputeResolutionInterfaceProps) {
  const [dispute, setDispute] = useState<DisputeCase>(mockDispute);
  const [newMessage, setNewMessage] = useState('');
  const [newEvidence, setNewEvidence] = useState<{
    type: Evidence['type'];
    title: string;
    content: string;
  }>({
    type: 'TEXT',
    title: '',
    content: ''
  });
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [showInternalComments, setShowInternalComments] = useState(userRole === 'ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newComm: Communication = {
        id: `comm-${Date.now()}`,
        fromUserId: userRole === 'CUSTOMER' ? dispute.customer.id : 
                   userRole === 'GUIDE' ? dispute.guide.id : 'admin-001',
        fromUserName: userRole === 'CUSTOMER' ? dispute.customer.name : 
                     userRole === 'GUIDE' ? dispute.guide.name : '客服專員',
        fromUserRole: userRole,
        message: newMessage,
        sentAt: new Date().toISOString(),
        isInternal: false
      };

      setDispute(prev => ({
        ...prev,
        communications: [...prev.communications, newComm],
        updatedAt: new Date().toISOString()
      }));

      setNewMessage('');
    } catch (error) {
      alert('發送失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEvidence = async () => {
    if (!newEvidence.title.trim() || !newEvidence.content.trim()) {
      alert('請填寫完整的證據資訊');
      return;
    }

    setIsSubmitting(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const evidence: Evidence = {
        id: `evidence-${Date.now()}`,
        type: newEvidence.type,
        title: newEvidence.title,
        content: newEvidence.content,
        uploadedBy: userRole === 'CUSTOMER' ? dispute.customer.id : 
                   userRole === 'GUIDE' ? dispute.guide.id : 'admin-001',
        uploadedAt: new Date().toISOString()
      };

      setDispute(prev => ({
        ...prev,
        evidence: [...prev.evidence, evidence],
        updatedAt: new Date().toISOString()
      }));

      setNewEvidence({ type: 'TEXT', title: '', content: '' });
      setShowEvidenceForm(false);
    } catch (error) {
      alert('新增證據失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveDispute = async (resolution: {
    type: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'NO_REFUND' | 'CREDIT' | 'REBOOK';
    amount?: number;
    description: string;
  }) => {
    setIsSubmitting(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1500));

      setDispute(prev => ({
        ...prev,
        status: 'RESOLVED',
        resolution: {
          ...resolution,
          agreedBy: [prev.customer.id, prev.guide.id]
        },
        resolvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      alert('爭議已解決！');
    } catch (error) {
      alert('解決爭議失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCommunications = showInternalComments 
    ? dispute.communications 
    : dispute.communications.filter(comm => !comm.isInternal);

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
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Gavel style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
            {dispute.title}
          </h1>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <span>爭議編號：{dispute.id}</span>
            <span>類型：{typeLabels[dispute.type]}</span>
            <span>建立時間：{formatDate(dispute.createdAt)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* 狀態標籤 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: statusConfig[dispute.status].bg,
            color: statusConfig[dispute.status].color,
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {React.createElement(statusConfig[dispute.status].icon, {
              style: { width: '1rem', height: '1rem' }
            })}
            {statusConfig[dispute.status].label}
          </div>

          {/* 優先級標籤 */}
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: `${priorityConfig[dispute.priority].color}20`,
            color: priorityConfig[dispute.priority].color,
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            優先級：{priorityConfig[dispute.priority].label}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: '600px' }}>
        {/* 左側：爭議資訊和證據 */}
        <div style={{
          width: '400px',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          overflowY: 'auto'
        }}>
          {/* 爭議描述 */}
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              爭議描述
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#374151',
              lineHeight: '1.5',
              margin: 0
            }}>
              {dispute.description}
            </p>
          </div>

          {/* 參與者資訊 */}
          <div style={{ 
            padding: '0 1.5rem 1.5rem',
            borderBottom: '1px solid #e5e7eb' 
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              參與者
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <User style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {dispute.customer.name}（客戶）
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {dispute.customer.email}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Star style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {dispute.guide.name}（嚮導）
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {dispute.guide.email}
                  </div>
                </div>
              </div>
              
              {dispute.assignedTo && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Shield style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      處理專員
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {dispute.assignedTo}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 證據列表 */}
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                證據材料
              </h3>
              
              {userRole !== 'ADMIN' && (
                <button
                  onClick={() => setShowEvidenceForm(!showEvidenceForm)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                  新增
                </button>
              )}
            </div>

            {/* 新增證據表單 */}
            {showEvidenceForm && (
              <div style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                marginBottom: '1rem'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    證據類型
                  </label>
                  <select
                    value={newEvidence.type}
                    onChange={(e) => setNewEvidence(prev => ({
                      ...prev,
                      type: e.target.value as Evidence['type']
                    }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="TEXT">文字說明</option>
                    <option value="IMAGE">圖片</option>
                    <option value="DOCUMENT">文件</option>
                    <option value="LINK">連結</option>
                  </select>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    標題
                  </label>
                  <input
                    type="text"
                    value={newEvidence.title}
                    onChange={(e) => setNewEvidence(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="請輸入證據標題"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    內容
                  </label>
                  <textarea
                    value={newEvidence.content}
                    onChange={(e) => setNewEvidence(prev => ({
                      ...prev,
                      content: e.target.value
                    }))}
                    placeholder={
                      newEvidence.type === 'TEXT' ? '請輸入詳細說明' :
                      newEvidence.type === 'IMAGE' ? '請輸入圖片URL或上傳圖片' :
                      newEvidence.type === 'DOCUMENT' ? '請輸入文件URL或上傳文件' :
                      '請輸入相關連結'
                    }
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleAddEvidence}
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: isSubmitting ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? '提交中...' : '提交'}
                  </button>
                  
                  <button
                    onClick={() => setShowEvidenceForm(false)}
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
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 證據列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dispute.evidence.map((evidence) => {
                const getIcon = () => {
                  switch (evidence.type) {
                    case 'TEXT': return FileText;
                    case 'IMAGE': return Image;
                    case 'DOCUMENT': return FileText;
                    case 'LINK': return Link;
                    default: return FileText;
                  }
                };
                
                const Icon = getIcon();
                
                return (
                  <div
                    key={evidence.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}>
                      <Icon style={{ 
                        width: '1.25rem', 
                        height: '1.25rem', 
                        color: '#6b7280',
                        flexShrink: 0,
                        marginTop: '0.125rem'
                      }} />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#111827',
                          marginBottom: '0.25rem'
                        }}>
                          {evidence.title}
                        </div>
                        
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.5rem'
                        }}>
                          {formatDate(evidence.uploadedAt)} · {evidence.uploadedBy}
                        </div>
                        
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          lineHeight: '1.4'
                        }}>
                          {evidence.type === 'IMAGE' || evidence.type === 'DOCUMENT' || evidence.type === 'LINK' ? (
                            <a
                              href={evidence.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#3b82f6',
                                textDecoration: 'underline'
                              }}
                            >
                              {evidence.type === 'IMAGE' ? '查看圖片' :
                               evidence.type === 'DOCUMENT' ? '下載文件' :
                               '開啟連結'}
                            </a>
                          ) : (
                            evidence.content
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右側：溝通記錄 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 溝通記錄標題 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <MessageSquare style={{ width: '1rem', height: '1rem' }} />
              溝通記錄
            </h3>
            
            {userRole === 'ADMIN' && (
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#374151',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={showInternalComments}
                  onChange={(e) => setShowInternalComments(e.target.checked)}
                  style={{ accentColor: '#3b82f6' }}
                />
                顯示內部溝通
              </label>
            )}
          </div>

          {/* 溝通記錄列表 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredCommunications.map((comm) => (
                <div
                  key={comm.id}
                  style={{
                    display: 'flex',
                    flexDirection: comm.fromUserRole === userRole ? 'row-reverse' : 'row',
                    gap: '0.75rem'
                  }}
                >
                  {/* 頭像 */}
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 
                      comm.fromUserRole === 'ADMIN' ? '#3b82f6' :
                      comm.fromUserRole === 'GUIDE' ? '#f59e0b' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {comm.fromUserName.charAt(0)}
                  </div>

                  {/* 訊息內容 */}
                  <div style={{
                    maxWidth: '70%',
                    padding: '1rem',
                    backgroundColor: 
                      comm.fromUserRole === userRole ? '#3b82f6' :
                      comm.isInternal ? '#f59e0b' : '#f3f4f6',
                    color: 
                      comm.fromUserRole === userRole ? 'white' :
                      comm.isInternal ? 'white' : '#111827',
                    borderRadius: '1rem',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {comm.fromUserName}
                      </span>
                      
                      {comm.isInternal && (
                        <span style={{
                          padding: '0.125rem 0.375rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          內部
                        </span>
                      )}
                    </div>
                    
                    <div style={{
                      fontSize: '0.875rem',
                      lineHeight: '1.4',
                      marginBottom: '0.5rem'
                    }}>
                      {comm.message}
                    </div>
                    
                    <div style={{
                      fontSize: '0.75rem',
                      opacity: 0.8
                    }}>
                      {formatDate(comm.sentAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 發送訊息區域 */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end'
            }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="輸入您的訊息..."
                rows={3}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'none',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: !newMessage.trim() || isSubmitting ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: !newMessage.trim() || isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                <Send style={{ width: '1rem', height: '1rem' }} />
                發送
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 管理員解決方案區域 */}
      {userRole === 'ADMIN' && dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' && (
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            解決方案
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handleResolveDispute({
                type: 'FULL_REFUND',
                description: '同意客戶申請，提供全額退款'
              })}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: isSubmitting ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <CheckCircle style={{ width: '1rem', height: '1rem' }} />
              全額退款
            </button>
            
            <button
              onClick={() => handleResolveDispute({
                type: 'PARTIAL_REFUND',
                amount: 1000,
                description: '部分同意客戶申請，提供部分退款'
              })}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: isSubmitting ? '#9ca3af' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <DollarSign style={{ width: '1rem', height: '1rem' }} />
              部分退款
            </button>
            
            <button
              onClick={() => handleResolveDispute({
                type: 'NO_REFUND',
                description: '經調查後，維持原退款決定'
              })}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: isSubmitting ? '#9ca3af' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <XCircle style={{ width: '1rem', height: '1rem' }} />
              拒絕退款
            </button>
            
            <button
              onClick={() => handleResolveDispute({
                type: 'CREDIT',
                description: '轉換為平台信用額度作為補償'
              })}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: isSubmitting ? '#9ca3af' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <Star style={{ width: '1rem', height: '1rem' }} />
              平台信用
            </button>
          </div>
        </div>
      )}

      {/* 已解決的爭議顯示解決方案 */}
      {dispute.resolution && (
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f0fdf4'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#065f46',
              margin: 0
            }}>
              爭議已解決
            </h3>
          </div>
          
          <div style={{
            fontSize: '0.875rem',
            color: '#065f46',
            marginBottom: '0.5rem'
          }}>
            解決方案：{dispute.resolution.description}
          </div>
          
          {dispute.resolution.amount && (
            <div style={{
              fontSize: '0.875rem',
              color: '#065f46'
            }}>
              退款金額：{new Intl.NumberFormat('zh-TW', {
                style: 'currency',
                currency: 'TWD',
                minimumFractionDigits: 0
              }).format(dispute.resolution.amount)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}