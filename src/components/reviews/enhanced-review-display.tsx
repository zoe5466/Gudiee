// 增強版評論顯示組件
// 功能：提供完整的評論展示、互動、回覆等功能
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreHorizontal,
  User,
  Calendar,
  Eye,
  EyeOff,
  Flag,
  Share2,
  Camera,
  CheckCircle,
  Shield,
  Award,
  Heart,
  Reply,
  Edit,
  Trash2,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/store/auth';
import type { Review, ReviewResponse, RatingDimension } from '@/types/review';

// 組件屬性介面
interface EnhancedReviewDisplayProps {
  review: Review;                      // 評論數據
  showService?: boolean;               // 是否顯示服務資訊
  showDetailedRatings?: boolean;       // 是否顯示詳細評分
  allowInteractions?: boolean;         // 是否允許互動
  allowReplies?: boolean;              // 是否允許回覆
  allowReporting?: boolean;            // 是否允許檢舉
  allowSharing?: boolean;              // 是否允許分享
  maxCommentLength?: number;           // 評論內容最大顯示長度
  onHelpful?: (reviewId: string) => void;      // 有用回調
  onUnhelpful?: (reviewId: string) => void;    // 無用回調
  onReply?: (reviewId: string, content: string) => void; // 回覆回調
  onReport?: (reviewId: string, reason: string) => void; // 檢舉回調
  onShare?: (reviewId: string) => void;        // 分享回調
  onEdit?: (reviewId: string) => void;         // 編輯回調
  onDelete?: (reviewId: string) => void;       // 刪除回調
  className?: string;                  // 自定義樣式
}

// 維度標籤對應
const DIMENSION_LABELS: Record<RatingDimension, { label: string; icon: string; description: string }> = {
  overall: { label: '整體滿意度', icon: '⭐', description: '總體服務體驗' },
  communication: { label: '溝通能力', icon: '💬', description: '溝通效率與清晰度' },
  punctuality: { label: '準時性', icon: '⏰', description: '時間管理與守時' },
  knowledge: { label: '專業知識', icon: '📚', description: '專業技能與經驗' },
  friendliness: { label: '友善度', icon: '😊', description: '服務態度與親和力' },
  value: { label: '物有所值', icon: '💰', description: '價格與服務品質比例' },
  safety: { label: '安全性', icon: '🛡️', description: '安全保障與風險管控' },
  flexibility: { label: '彈性配合', icon: '🔄', description: '應變能力與客製化' },
  professionalism: { label: '專業性', icon: '👔', description: '職業素養與標準' }
};

// 檢舉原因選項
const REPORT_REASONS = [
  { value: 'INAPPROPRIATE_CONTENT', label: '不當內容' },
  { value: 'SPAM', label: '垃圾訊息' },
  { value: 'FAKE_REVIEW', label: '虛假評論' },
  { value: 'HARASSMENT', label: '騷擾行為' },
  { value: 'DISCRIMINATION', label: '歧視言論' },
  { value: 'COPYRIGHT', label: '版權問題' },
  { value: 'OTHER', label: '其他' }
];

/**
 * 增強版評論顯示主組件
 */
export default function EnhancedReviewDisplay({
  review,
  showService = false,
  showDetailedRatings = true,
  allowInteractions = true,
  allowReplies = true,
  allowReporting = true,
  allowSharing = true,
  maxCommentLength = 300,
  onHelpful,
  onUnhelpful,
  onReply,
  onReport,
  onShare,
  onEdit,
  onDelete,
  className = ''
}: EnhancedReviewDisplayProps) {
  const { user } = useAuth();

  // 狀態管理
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState<{ show: boolean; photoIndex: number }>({ show: false, photoIndex: 0 });
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // 計算衍生狀態
  const isUserReview = user?.id === review.reviewer.id;
  const canReply = allowReplies && user && (
    (review.service && user.id === review.service.guide.id) ||
    user.role === 'admin' ||
    isUserReview
  );
  const canEdit = user && (isUserReview || user.role === 'admin');
  const canDelete = user && (isUserReview || user.role === 'admin');
  const isHelpful = user ? review.helpfulVotes.some(vote => vote.userId === user.id && vote.isHelpful) : false;
  const isUnhelpful = user ? review.helpfulVotes.some(vote => vote.userId === user.id && !vote.isHelpful) : false;

  // 判斷評論內容是否需要截斷
  const shouldTruncateComment = review.comment.length > maxCommentLength;
  const displayComment = shouldTruncateComment && !isExpanded 
    ? review.comment.slice(0, maxCommentLength) + '...' 
    : review.comment;

  /**
   * 處理有用投票
   */
  const handleHelpfulVote = useCallback((isHelpful: boolean) => {
    if (!user) {
      alert('請先登入');
      return;
    }

    if (isHelpful) {
      onHelpful?.(review.id);
    } else {
      onUnhelpful?.(review.id);
    }
  }, [user, review.id, onHelpful, onUnhelpful]);

  /**
   * 處理回覆提交
   */
  const handleReplySubmit = useCallback(async () => {
    if (!replyContent.trim() || !user) return;

    setIsSubmittingReply(true);
    try {
      await onReply?.(review.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (error) {
      console.error('回覆失敗:', error);
      alert('回覆失敗，請稍後再試');
    } finally {
      setIsSubmittingReply(false);
    }
  }, [replyContent, user, review.id, onReply]);

  /**
   * 處理檢舉提交
   */
  const handleReportSubmit = useCallback(async () => {
    if (!reportReason || !user) return;

    try {
      await onReport?.(review.id, reportReason);
      setShowReportForm(false);
      setReportReason('');
      setReportDescription('');
      alert('檢舉已提交，我們會盡快處理');
    } catch (error) {
      console.error('檢舉失敗:', error);
      alert('檢舉失敗，請稍後再試');
    }
  }, [reportReason, user, review.id, onReport]);

  /**
   * 處理分享
   */
  const handleShare = useCallback((method: string) => {
    const reviewUrl = `${window.location.origin}/reviews/${review.id}`;
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(reviewUrl);
        alert('連結已複製到剪貼板');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reviewUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(reviewUrl)}&text=${encodeURIComponent('查看這則評論')}`);
        break;
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(reviewUrl)}`);
        break;
      default:
        onShare?.(review.id);
    }
    
    setShowShareMenu(false);
  }, [review.id, onShare]);

  /**
   * 格式化日期
   */
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 天前';
    if (diffDays <= 7) return `${diffDays} 天前`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} 週前`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} 個月前`;
    return `${Math.ceil(diffDays / 365)} 年前`;
  }, []);

  /**
   * 渲染評分星星
   */
  const renderStars = useCallback((rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        color={i < rating ? '#fbbf24' : '#d1d5db'}
        fill={i < rating ? '#fbbf24' : 'none'}
      />
    ));
  }, []);

  /**
   * 渲染詳細評分
   */
  const renderDetailedRatings = useMemo(() => {
    if (!showDetailedRatings) return null;

    const dimensions = Object.entries(review.rating)
      .filter(([key, value]) => key !== 'overall' && value > 0)
      .map(([key, value]) => ({ key: key as RatingDimension, value }));

    if (dimensions.length === 0) return null;

    return (
      <div style={{ marginTop: '16px' }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <BarChart3 size={14} />
          詳細評分
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {dimensions.map(({ key, value }) => {
            const dimension = DIMENSION_LABELS[key];
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{dimension.icon}</span>
                  <span style={{ fontSize: '12px', color: '#374151' }}>{dimension.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '1px' }}>
                    {renderStars(value, 12)}
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '4px' }}>
                    {value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [showDetailedRatings, review.rating, renderStars]);

  /**
   * 渲染照片網格
   */
  const renderPhotos = useMemo(() => {
    if (review.photos.length === 0) return null;

    return (
      <div style={{ marginTop: '16px' }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Camera size={14} />
          評論照片 ({review.photos.length})
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(review.photos.length, 4)}, 1fr)`,
          gap: '8px',
          maxWidth: '400px'
        }}>
          {review.photos.slice(0, 4).map((photo, index) => (
            <div
              key={photo.id}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#f3f4f6'
              }}
              onClick={() => setShowPhotoModal({ show: true, photoIndex: index })}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `評論照片 ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 25vw, 100px"
              />
              {index === 3 && review.photos.length > 4 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  +{review.photos.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }, [review.photos]);

  /**
   * 渲染標籤
   */
  const renderTags = useMemo(() => {
    if (review.tags.length === 0) return null;

    return (
      <div style={{ marginTop: '16px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          {review.tags.map(tag => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }, [review.tags]);

  /**
   * 渲染優缺點
   */
  const renderProsAndCons = useMemo(() => {
    const hasPros = review.pros.length > 0;
    const hasCons = review.cons.length > 0;
    
    if (!hasPros && !hasCons) return null;

    return (
      <div style={{
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: hasPros && hasCons ? '1fr 1fr' : '1fr',
        gap: '16px'
      }}>
        {hasPros && (
          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#059669',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ThumbsUp size={14} />
              優點
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {review.pros.map((pro, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: '14px',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px'
                  }}
                >
                  <span style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#059669',
                    borderRadius: '50%',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasCons && (
          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#dc2626',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ThumbsDown size={14} />
              改進建議
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {review.cons.map((con, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: '14px',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px'
                  }}
                >
                  <span style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#dc2626',
                    borderRadius: '50%',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }, [review.pros, review.cons]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} style={{ padding: '20px' }}>
      {/* 服務資訊（如果需要顯示） */}
      {showService && review.service && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {review.service.guide.avatar ? (
                <Image
                  src={review.service.guide.avatar}
                  alt={review.service.guide.name}
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <User size={20} color="#6b7280" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                {review.service.title}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <span>{review.service.location}</span>
                <span>•</span>
                <span>導遊：{review.service.guide.name}</span>
                {review.service.guide.isVerified && (
                  <>
                    <span>•</span>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ color: '#10b981' }}>已驗證</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 評論標題行 */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {/* 用戶頭像 */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {review.isAnonymous ? (
              <User size={24} color="#6b7280" />
            ) : review.reviewer.avatar ? (
              <Image
                src={review.reviewer.avatar}
                alt={review.reviewer.name}
                width={48}
                height={48}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {review.reviewer.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* 用戶資訊和評分 */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                {review.isAnonymous ? '匿名用戶' : review.reviewer.name}
              </h3>
              
              {/* 驗證標章 */}
              {review.reviewer.isVerified && (
                <CheckCircle size={16} color="#10b981" title="已驗證用戶" />
              )}
              
              {/* 狀態標籤 */}
              {review.status !== 'APPROVED' && (
                <span style={{
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  backgroundColor: review.status === 'PENDING' ? '#fef3c7' :
                                  review.status === 'FLAGGED' ? '#fee2e2' : '#f3f4f6',
                  color: review.status === 'PENDING' ? '#92400e' :
                         review.status === 'FLAGGED' ? '#991b1b' : '#6b7280'
                }}>
                  {review.status === 'PENDING' ? '待審核' :
                   review.status === 'FLAGGED' ? '已檢舉' :
                   review.status === 'HIDDEN' ? '已隱藏' : review.status}
                </span>
              )}
              
              {/* 精選標籤 */}
              {review.isFeatured && (
                <Award size={16} color="#f59e0b" title="精選評論" />
              )}
            </div>

            {/* 評分和時間 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {renderStars(review.rating.overall, 16)}
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginLeft: '4px'
                }}>
                  {review.rating.overall}
                </span>
              </div>
              
              <span style={{ fontSize: '12px', color: '#d1d5db' }}>•</span>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <Calendar size={14} />
                <span>{formatDate(review.createdAt)}</span>
              </div>
              
              {/* 預訂資訊 */}
              {review.booking && (
                <>
                  <span style={{ fontSize: '12px', color: '#d1d5db' }}>•</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {review.booking.guests} 人參與
                  </span>
                </>
              )}
            </div>

            {/* 用戶統計 */}
            {!review.isAnonymous && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <span>{review.reviewer.totalReviews} 則評論</span>
                <span>•</span>
                <span>平均評分 {review.reviewer.averageRating.toFixed(1)}</span>
                {review.reviewer.nationality && (
                  <>
                    <span>•</span>
                    <span>{review.reviewer.nationality}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 操作選單 */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMoreActions(!showMoreActions)}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {/* 操作下拉選單 */}
          {showMoreActions && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              minWidth: '160px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              overflow: 'hidden'
            }}>
              {allowSharing && (
                <button
                  onClick={() => {
                    setShowShareMenu(true);
                    setShowMoreActions(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Share2 size={14} />
                  分享評論
                </button>
              )}

              {canEdit && (
                <button
                  onClick={() => {
                    onEdit?.(review.id);
                    setShowMoreActions(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Edit size={14} />
                  編輯評論
                </button>
              )}

              {allowReporting && !isUserReview && (
                <button
                  onClick={() => {
                    setShowReportForm(true);
                    setShowMoreActions(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Flag size={14} />
                  檢舉評論
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => {
                    if (confirm('確定要刪除這則評論嗎？')) {
                      onDelete?.(review.id);
                    }
                    setShowMoreActions(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 size={14} />
                  刪除評論
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 評論標題 */}
      {review.title && (
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 12px 0',
          lineHeight: '1.4'
        }}>
          {review.title}
        </h2>
      )}

      {/* 評論內容 */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#374151',
          margin: 0,
          whiteSpace: 'pre-wrap'
        }}>
          {displayComment}
        </p>
        
        {shouldTruncateComment && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              marginTop: '8px',
              fontSize: '14px',
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isExpanded ? '收起' : '查看更多'}
          </button>
        )}
      </div>

      {/* 詳細評分 */}
      {renderDetailedRatings}

      {/* 優缺點 */}
      {renderProsAndCons}

      {/* 標籤 */}
      {renderTags}

      {/* 照片 */}
      {renderPhotos}

      {/* 互動統計和操作 */}
      {allowInteractions && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* 有用投票 */}
            <button
              onClick={() => handleHelpfulVote(true)}
              disabled={!user}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: isHelpful ? '#dbeafe' : 'transparent',
                border: `1px solid ${isHelpful ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '20px',
                fontSize: '14px',
                color: isHelpful ? '#1e40af' : '#6b7280',
                cursor: user ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              <ThumbsUp size={14} fill={isHelpful ? 'currentColor' : 'none'} />
              <span>有用 ({review.helpfulCount})</span>
            </button>

            {/* 查看數 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <Eye size={14} />
              <span>{review.viewCount}</span>
            </div>

            {/* 回覆數 */}
            {review.responses.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={14} />
                <span>{review.responses.length} 則回覆</span>
                {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {/* 回覆按鈕 */}
          {canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              <Reply size={14} />
              回覆
            </button>
          )}
        </div>
      )}

      {/* 回覆表單 */}
      {showReplyForm && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="輸入您的回覆..."
            rows={3}
            maxLength={500}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical'
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {replyContent.length}/500
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowReplyForm(false)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || isSubmittingReply}
                style={{
                  padding: '6px 12px',
                  backgroundColor: !replyContent.trim() || isSubmittingReply ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: !replyContent.trim() || isSubmittingReply ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSubmittingReply ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    發送中...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    發送回覆
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 回覆列表 */}
      {showReplies && review.responses.length > 0 && (
        <div style={{
          marginTop: '16px',
          paddingLeft: '16px',
          borderLeft: '3px solid #e5e7eb'
        }}>
          {review.responses.map((response) => (
            <div
              key={response.id}
              style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {response.author.avatar ? (
                      <Image
                        src={response.author.avatar}
                        alt={response.author.name}
                        width={32}
                        height={32}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: response.authorType === 'GUIDE' ? '#10b981' : '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {response.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        {response.author.name}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        backgroundColor: response.authorType === 'GUIDE' ? '#d1fae5' : '#dbeafe',
                        color: response.authorType === 'GUIDE' ? '#065f46' : '#1e40af'
                      }}>
                        {response.authorType === 'GUIDE' ? '導遊' : 
                         response.authorType === 'ADMIN' ? '管理員' : '用戶'}
                      </span>
                      {response.isOfficial && (
                        <Shield size={12} color="#10b981" title="官方回覆" />
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {formatDate(response.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#374151',
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}>
                {response.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 分享選單 */}
      {showShareMenu && (
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
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '300px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            margin: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                分享評論
              </h3>
              <button
                onClick={() => setShowShareMenu(false)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { key: 'copy', label: '複製連結', icon: Copy },
                { key: 'facebook', label: 'Facebook', icon: ExternalLink },
                { key: 'twitter', label: 'Twitter', icon: ExternalLink },
                { key: 'line', label: 'LINE', icon: ExternalLink }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleShare(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 檢舉表單 */}
      {showReportForm && (
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
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            margin: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                檢舉評論
              </h3>
              <button
                onClick={() => setShowReportForm(false)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                檢舉原因 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">請選擇檢舉原因</option>
                {REPORT_REASONS.map(reason => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                詳細說明（可選）
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="請描述具體問題..."
                rows={3}
                maxLength={500}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'right',
                marginTop: '4px'
              }}>
                {reportDescription.length}/500
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowReportForm(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason}
                style={{
                  padding: '8px 16px',
                  backgroundColor: !reportReason ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: !reportReason ? 'not-allowed' : 'pointer'
                }}
              >
                提交檢舉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 照片模態框 */}
      {showPhotoModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh'
          }}>
            <button
              onClick={() => setShowPhotoModal({ show: false, photoIndex: 0 })}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
            
            <Image
              src={review.photos[showPhotoModal.photoIndex]?.url || ''}
              alt={review.photos[showPhotoModal.photoIndex]?.caption || '評論照片'}
              width={800}
              height={600}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
            
            {review.photos.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px'
              }}>
                {review.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setShowPhotoModal({ show: true, photoIndex: index })}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: index === showPhotoModal.photoIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}