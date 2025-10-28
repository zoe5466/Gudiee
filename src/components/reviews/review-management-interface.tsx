// 評論管理介面組件
// 功能：提供完整的評論管理、篩選、排序、審核、回覆等功能
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  User,
  Star,
  Image as ImageIcon,
  ThumbsUp,
  AlertTriangle,
  Check,
  X,
  Edit,
  Trash2,
  Reply,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { 
  Review, 
  ReviewFilters, 
  ReviewStatus, 
  ReviewerType,
  ReviewModeration
} from '@/types/review';

// 組件屬性介面
interface ReviewManagementInterfaceProps {
  targetId?: string;                   // 目標 ID（可選，用於特定服務或導遊）
  targetType?: 'service' | 'guide';   // 目標類型
  userRole: 'admin' | 'guide' | 'traveler'; // 用戶角色
  className?: string;                  // 自定義樣式
}

// 狀態選項
const STATUS_OPTIONS: Array<{ value: ReviewStatus; label: string; color: string }> = [
  { value: 'PENDING', label: '待審核', color: '#f59e0b' },
  { value: 'APPROVED', label: '已通過', color: '#10b981' },
  { value: 'REJECTED', label: '已拒絕', color: '#ef4444' },
  { value: 'HIDDEN', label: '已隱藏', color: '#6b7280' },
  { value: 'FLAGGED', label: '已檢舉', color: '#dc2626' },
  { value: 'DELETED', label: '已刪除', color: '#374151' }
];

// 排序選項
const SORT_OPTIONS = [
  { value: 'newest', label: '最新優先' },
  { value: 'oldest', label: '最舊優先' },
  { value: 'rating_high', label: '評分高到低' },
  { value: 'rating_low', label: '評分低到高' },
  { value: 'helpful', label: '最有用' },
  { value: 'trending', label: '熱門討論' }
];

/**
 * 評論管理介面主組件
 */
export default function ReviewManagementInterface({
  targetId,
  targetType,
  userRole,
  className = ''
}: ReviewManagementInterfaceProps) {
  // 狀態管理
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  
  // 篩選和搜尋狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest',
    page: 1,
    limit: 20
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // 批量操作狀態
  const [batchActionType, setBatchActionType] = useState<string>('');
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  
  // 審核狀態
  const [moderationModal, setModerationModal] = useState<{
    show: boolean;
    reviewId: string;
    action: 'APPROVE' | 'REJECT' | 'HIDE' | 'FLAG';
  } | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [moderationNotes, setModerationNotes] = useState('');

  /**
   * 載入評論數據
   */
  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成模擬評論數據
      const mockReviews: Review[] = Array.from({ length: 50 }, (_, i) => ({
        id: `review-${i + 1}`,
        orderId: `order-${Math.floor(Math.random() * 100)}`,
        reviewerId: `user-${Math.floor(Math.random() * 50)}`,
        revieweeId: targetId || `target-${Math.floor(Math.random() * 10)}`,
        reviewerType: Math.random() > 0.5 ? 'TRAVELER' : 'GUIDE',
        rating: {
          overall: Math.floor(Math.random() * 5) + 1,
          communication: Math.floor(Math.random() * 5) + 1,
          punctuality: Math.floor(Math.random() * 5) + 1,
          knowledge: Math.floor(Math.random() * 5) + 1,
          friendliness: Math.floor(Math.random() * 5) + 1,
          value: Math.floor(Math.random() * 5) + 1
        },
        title: Math.random() > 0.6 ? '很棒的體驗！' : undefined,
        comment: [
          '非常好的服務，導遊很專業，行程安排得很棒！',
          '整體體驗不錯，但是時間安排有點緊湊。',
          '超級推薦！導遊知識豐富，而且很幽默。',
          '價格合理，服務品質很好，值得推薦。',
          '導遊很準時，講解詳細，整體體驗很滿意。',
          '服務態度很好，但是行程內容可以更豐富一些。'
        ][Math.floor(Math.random() * 6)] || '',
        pros: Math.random() > 0.5 ? ['專業知識', '準時', '親切'] : [],
        cons: Math.random() > 0.7 ? ['時間安排緊湊'] : [],
        tags: Math.random() > 0.5 ? ['專業', '準時', '親切'] : [],
        photos: Math.random() > 0.7 ? [
          { 
            id: `photo-${i}-1`, 
            url: `/images/review-${i}-1.jpg`, 
            uploadedAt: new Date().toISOString(),
            fileSize: 1024000
          }
        ] : [],
        status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)]?.value || 'PENDING',
        isAnonymous: Math.random() > 0.8,
        isVerified: Math.random() > 0.3,
        isFeatured: Math.random() > 0.9,
        isEdited: Math.random() > 0.9,
        helpfulCount: Math.floor(Math.random() * 50),
        unhelpfulCount: Math.floor(Math.random() * 10),
        viewCount: Math.floor(Math.random() * 200),
        shareCount: Math.floor(Math.random() * 20),
        reviewer: {
          id: `user-${Math.floor(Math.random() * 50)}`,
          name: Math.random() > 0.8 ? '匿名用戶' : `用戶${i + 1}`,
          avatar: Math.random() > 0.5 ? `/avatars/user-${i + 1}.jpg` : undefined,
          isVerified: Math.random() > 0.5,
          totalReviews: Math.floor(Math.random() * 20) + 1,
          averageRating: 3.5 + Math.random() * 1.5,
          joinedAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
          nationality: ['台灣', '日本', '美國', '英國', '德國'][Math.floor(Math.random() * 5)]
        },
        responses: Math.random() > 0.6 ? [
          {
            id: `response-${i}`,
            reviewId: `review-${i + 1}`,
            authorId: 'guide-1',
            authorType: 'GUIDE',
            content: '感謝您的評價！我們會繼續努力提供更好的服務。',
            isOfficial: true,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              id: 'guide-1',
              name: '導遊小王',
              avatar: '/avatars/guide-1.jpg'
            }
          }
        ] : [],
        reports: Math.random() > 0.95 ? [
          {
            id: `report-${i}`,
            reporterId: `user-${Math.floor(Math.random() * 50)}`,
            reason: 'INAPPROPRIATE_CONTENT',
            description: '內容不當',
            reportedAt: new Date().toISOString(),
            status: 'PENDING'
          }
        ] : [],
        helpfulVotes: [],
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date(Date.now() - Math.random() * 86400000 * 25).toISOString()
      }));

      setReviews(mockReviews);
      setFilteredReviews(mockReviews);

    } catch (err) {
      setError(err instanceof Error ? err.message : '載入評論失敗');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 應用篩選和搜尋
   */
  const applyFiltersAndSearch = useMemo(() => {
    let result = [...reviews];

    // 搜尋過濾
    if (searchQuery) {
      result = result.filter(review => 
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 狀態過濾
    if (filters.status && filters.status.length > 0) {
      result = result.filter(review => filters.status!.includes(review.status));
    }

    // 評分過濾
    if (filters.rating && filters.rating.length > 0) {
      result = result.filter(review => filters.rating!.includes(review.rating.overall));
    }

    // 評論者類型過濾
    if (filters.reviewerType && filters.reviewerType.length > 0) {
      result = result.filter(review => filters.reviewerType!.includes(review.reviewerType));
    }

    // 其他過濾條件
    if (filters.verified !== undefined) {
      result = result.filter(review => review.isVerified === filters.verified);
    }

    if (filters.withPhotos) {
      result = result.filter(review => review.photos.length > 0);
    }

    if (filters.withResponses) {
      result = result.filter(review => review.responses.length > 0);
    }

    if (filters.featured) {
      result = result.filter(review => review.isFeatured);
    }

    // 日期範圍過濾
    if (filters.dateRange) {
      const startTime = filters.dateRange.start.getTime();
      const endTime = filters.dateRange.end.getTime();
      result = result.filter(review => {
        const reviewTime = new Date(review.createdAt).getTime();
        return reviewTime >= startTime && reviewTime <= endTime;
      });
    }

    // 排序
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating_high':
          return b.rating.overall - a.rating.overall;
        case 'rating_low':
          return a.rating.overall - b.rating.overall;
        case 'helpful':
          return b.helpfulCount - a.helpfulCount;
        case 'trending':
          return (b.viewCount + b.shareCount) - (a.viewCount + a.shareCount);
        default:
          return 0;
      }
    });

    return result;
  }, [reviews, searchQuery, filters]);

  useEffect(() => {
    setFilteredReviews(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  useEffect(() => {
    fetchReviews();
  }, [targetId, targetType]);

  /**
   * 處理審核操作
   */
  const handleModeration = async (action: 'APPROVE' | 'REJECT' | 'HIDE' | 'FLAG') => {
    if (!moderationModal) return;

    try {
      const moderation: ReviewModeration = {
        reviewId: moderationModal.reviewId,
        action,
        reason: moderationReason,
        notes: moderationNotes,
        moderatorId: 'current-user-id',
        moderatedAt: new Date().toISOString()
      };

      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 500));

      // 更新本地狀態
      setReviews(prev => prev.map(review => 
        review.id === moderationModal.reviewId
          ? { 
              ...review, 
              status: action === 'APPROVE' ? 'APPROVED' : 
                      action === 'REJECT' ? 'REJECTED' : 
                      action === 'HIDE' ? 'HIDDEN' : 'FLAGGED',
              moderatorNotes: moderationNotes,
              moderatedBy: 'current-user-id',
              moderatedAt: new Date().toISOString()
            }
          : review
      ));

      setModerationModal(null);
      setModerationReason('');
      setModerationNotes('');

    } catch (error) {
      console.error('審核操作失敗:', error);
      alert('審核操作失敗');
    }
  };

  /**
   * 處理批量操作
   */
  const handleBatchAction = async () => {
    if (selectedReviews.size === 0) return;

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));

      let newStatus: ReviewStatus | null = null;
      switch (batchActionType) {
        case 'approve':
          newStatus = 'APPROVED';
          break;
        case 'reject':
          newStatus = 'REJECTED';
          break;
        case 'hide':
          newStatus = 'HIDDEN';
          break;
        case 'delete':
          newStatus = 'DELETED';
          break;
      }

      if (newStatus) {
        setReviews(prev => prev.map(review =>
          selectedReviews.has(review.id)
            ? { ...review, status: newStatus! }
            : review
        ));
      }

      setSelectedReviews(new Set());
      setShowBatchConfirm(false);
      setBatchActionType('');

    } catch (error) {
      console.error('批量操作失敗:', error);
      alert('批量操作失敗');
    }
  };

  /**
   * 切換評論選擇
   */
  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  /**
   * 全選/取消全選
   */
  const toggleSelectAll = () => {
    if (selectedReviews.size === filteredReviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(filteredReviews.map(r => r.id)));
    }
  };

  /**
   * 渲染狀態標籤
   */
  const renderStatusBadge = (status: ReviewStatus) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    if (!statusOption) return null;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: `${statusOption.color}20`,
        color: statusOption.color
      }}>
        {statusOption.label}
      </span>
    );
  };

  /**
   * 渲染評論卡片
   */
  const renderReviewCard = (review: Review) => {
    const isExpanded = expandedReview === review.id;
    const isSelected = selectedReviews.has(review.id);

    return (
      <div
        key={review.id}
        style={{
          border: `1px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
          transition: 'all 0.2s'
        }}
      >
        {/* 評論標題行 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleReviewSelection(review.id)}
              style={{ width: '16px', height: '16px' }}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: review.reviewer.avatar ? 'transparent' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {review.reviewer.avatar ? (
                  <img 
                    src={review.reviewer.avatar} 
                    alt={review.reviewer.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={16} color="#6b7280" />
                )}
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {review.isAnonymous ? '匿名用戶' : review.reviewer.name}
                  </span>
                  {review.reviewer.isVerified && (
                    <CheckCircle size={12} color="#10b981" />
                  )}
                  {renderStatusBadge(review.status)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
                  <span>{new Date(review.createdAt).toLocaleDateString('zh-TW')}</span>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        color={i < review.rating.overall ? '#fbbf24' : '#d1d5db'}
                        fill={i < review.rating.overall ? '#fbbf24' : 'none'}
                      />
                    ))}
                    <span style={{ marginLeft: '4px' }}>{review.rating.overall}</span>
                  </div>
                  {review.photos.length > 0 && (
                    <>
                      <span>•</span>
                      <ImageIcon size={12} />
                      <span>{review.photos.length}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 統計數據 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ThumbsUp size={12} />
                <span>{review.helpfulCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} />
                <span>{review.viewCount}</span>
              </div>
              {review.responses.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} />
                  <span>{review.responses.length}</span>
                </div>
              )}
            </div>

            {/* 操作按鈕 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {userRole === 'admin' && (
                <>
                  <button
                    onClick={() => setModerationModal({
                      show: true,
                      reviewId: review.id,
                      action: 'APPROVE'
                    })}
                    style={{
                      padding: '4px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title="通過"
                  >
                    <Check size={14} color="#059669" />
                  </button>
                  <button
                    onClick={() => setModerationModal({
                      show: true,
                      reviewId: review.id,
                      action: 'REJECT'
                    })}
                    style={{
                      padding: '4px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title="拒絕"
                  >
                    <X size={14} color="#dc2626" />
                  </button>
                  <button
                    onClick={() => setModerationModal({
                      show: true,
                      reviewId: review.id,
                      action: 'FLAG'
                    })}
                    style={{
                      padding: '4px',
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fde68a',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title="標記"
                  >
                    <Flag size={14} color="#d97706" />
                  </button>
                </>
              )}
              
              <button
                onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                style={{
                  padding: '4px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* 評論內容預覽 */}
        <div style={{ marginBottom: isExpanded ? '16px' : '0' }}>
          {review.title && (
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {review.title}
            </h4>
          )}
          <p style={{
            fontSize: '14px',
            color: '#374151',
            margin: '0',
            lineHeight: '1.5',
            display: isExpanded ? 'block' : '-webkit-box',
            WebkitLineClamp: isExpanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {review.comment}
          </p>
        </div>

        {/* 展開的詳細內容 */}
        {isExpanded && (
          <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            {/* 詳細評分 */}
            {Object.entries(review.rating).filter(([key]) => key !== 'overall').length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  詳細評分
                </h5>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '8px'
                }}>
                  {Object.entries(review.rating).filter(([key, value]) => key !== 'overall' && value > 0).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {key === 'communication' ? '溝通' :
                         key === 'punctuality' ? '準時' :
                         key === 'knowledge' ? '知識' :
                         key === 'friendliness' ? '友善' :
                         key === 'value' ? '價值' : key}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={10}
                            color={i < value ? '#fbbf24' : '#d1d5db'}
                            fill={i < value ? '#fbbf24' : 'none'}
                          />
                        ))}
                        <span style={{ fontSize: '10px', color: '#6b7280', marginLeft: '4px' }}>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 標籤 */}
            {review.tags.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  標籤
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {review.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 照片 */}
            {review.photos.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  照片 ({review.photos.length})
                </h5>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '8px',
                  maxWidth: '400px'
                }}>
                  {review.photos.map(photo => (
                    <div
                      key={photo.id}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#f3f4f6'
                      }}
                    >
                      <img
                        src={photo.url}
                        alt="評論照片"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 回覆 */}
            {review.responses.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  回覆 ({review.responses.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {review.responses.map(response => (
                    <div
                      key={response.id}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        borderLeft: '3px solid #3b82f6'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                            {response.author.name}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            backgroundColor: response.authorType === 'GUIDE' ? '#dbeafe' : '#fef3c7',
                            color: response.authorType === 'GUIDE' ? '#1e40af' : '#92400e',
                            borderRadius: '8px'
                          }}>
                            {response.authorType === 'GUIDE' ? '導遊' : '管理員'}
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>
                          {new Date(response.createdAt).toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: '#374151',
                        margin: '0',
                        lineHeight: '1.4'
                      }}>
                        {response.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 管理員備註 */}
            {userRole === 'admin' && review.moderatorNotes && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                border: '1px solid #fde68a'
              }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '6px' }}>
                  管理員備註
                </h5>
                <p style={{ fontSize: '12px', color: '#92400e', margin: '0' }}>
                  {review.moderatorNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-8 ${className}`}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '16px', fontSize: '16px', color: '#6b7280' }}>
            載入評論數據中...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-8 ${className}`}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <AlertTriangle size={48} color="#ef4444" />
          <p style={{ marginTop: '16px', fontSize: '16px', color: '#ef4444', textAlign: 'center' }}>
            {error}
          </p>
          <button
            onClick={fetchReviews}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`} style={{ padding: '24px' }}>
      {/* 標題和統計 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            評論管理
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
            共 {filteredReviews.length} 則評論 
            {selectedReviews.size > 0 && ` • 已選擇 ${selectedReviews.size} 則`}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchReviews}
            style={{
              padding: '8px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} />
          </button>
          
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            <Download size={16} />
            匯出
          </button>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div style={{ marginBottom: '24px' }}>
        {/* 搜尋列 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋評論內容、用戶名稱或標籤..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '12px 16px',
              backgroundColor: showFilters ? '#dbeafe' : '#f3f4f6',
              border: `1px solid ${showFilters ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: showFilters ? '#1e40af' : '#374151'
            }}
          >
            <Filter size={16} />
            篩選
          </button>
        </div>

        {/* 篩選面板 */}
        {showFilters && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {/* 狀態篩選 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginBottom: '6px'
                }}>
                  狀態
                </label>
                <select
                  multiple
                  value={filters.status || []}
                  onChange={(e) => {
                    const selectedValues = Array.from(e.target.selectedOptions, option => option.value as ReviewStatus);
                    setFilters(prev => ({ ...prev, status: selectedValues }));
                  }}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px'
                  }}
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 評分篩選 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginBottom: '6px'
                }}>
                  評分
                </label>
                <select
                  multiple
                  value={filters.rating?.map(String) || []}
                  onChange={(e) => {
                    const selectedValues = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setFilters(prev => ({ ...prev, rating: selectedValues }));
                  }}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px'
                  }}
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} 星
                    </option>
                  ))}
                </select>
              </div>

              {/* 排序 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginBottom: '6px'
                }}>
                  排序
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 其他篩選 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginBottom: '6px'
                }}>
                  其他篩選
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={filters.verified === true}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        verified: e.target.checked ? true : undefined 
                      }))}
                    />
                    只顯示已驗證
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={filters.withPhotos === true}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        withPhotos: e.target.checked || undefined 
                      }))}
                    />
                    含照片評論
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={filters.withResponses === true}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        withResponses: e.target.checked || undefined 
                      }))}
                    />
                    有回覆評論
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={filters.featured === true}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        featured: e.target.checked || undefined 
                      }))}
                    />
                    精選評論
                  </label>
                </div>
              </div>
            </div>

            {/* 篩選操作 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setFilters({ sortBy: 'newest', page: 1, limit: 20 })}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                重置篩選
              </button>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                應用篩選
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 批量操作 */}
      {selectedReviews.size > 0 && userRole === 'admin' && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '14px', color: '#1e40af' }}>
              已選擇 {selectedReviews.size} 則評論
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setBatchActionType('approve');
                  setShowBatchConfirm(true);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                批量通過
              </button>
              <button
                onClick={() => {
                  setBatchActionType('reject');
                  setShowBatchConfirm(true);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                批量拒絕
              </button>
              <button
                onClick={() => {
                  setBatchActionType('hide');
                  setShowBatchConfirm(true);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                批量隱藏
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 評論列表 */}
      <div style={{ marginBottom: '24px' }}>
        {/* 列表標題 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={selectedReviews.size === filteredReviews.length && filteredReviews.length > 0}
              onChange={toggleSelectAll}
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              全選 ({filteredReviews.length})
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
            按 {SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label} 排序
          </div>
        </div>

        {/* 評論卡片列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredReviews.length === 0 ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <MessageSquare size={48} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>暫無符合條件的評論</p>
              <p style={{ fontSize: '14px', margin: '0' }}>嘗試調整篩選條件或搜尋關鍵字</p>
            </div>
          ) : (
            filteredReviews.map(renderReviewCard)
          )}
        </div>
      </div>

      {/* 審核模態框 */}
      {moderationModal && (
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
            maxWidth: '500px',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            margin: '16px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              {moderationModal.action === 'APPROVE' ? '通過評論' :
               moderationModal.action === 'REJECT' ? '拒絕評論' :
               moderationModal.action === 'HIDE' ? '隱藏評論' : '標記評論'}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1f2937',
                marginBottom: '6px'
              }}>
                處理原因
              </label>
              <input
                type="text"
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="請輸入處理原因..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1f2937',
                marginBottom: '6px'
              }}>
                備註（可選）
              </label>
              <textarea
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="請輸入額外備註..."
                rows={3}
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
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setModerationModal(null)}
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
                onClick={() => handleModeration(moderationModal.action)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: moderationModal.action === 'APPROVE' ? '#10b981' :
                                  moderationModal.action === 'REJECT' ? '#ef4444' :
                                  moderationModal.action === 'HIDE' ? '#6b7280' : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                確認{moderationModal.action === 'APPROVE' ? '通過' :
                     moderationModal.action === 'REJECT' ? '拒絕' :
                     moderationModal.action === 'HIDE' ? '隱藏' : '標記'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 批量確認模態框 */}
      {showBatchConfirm && (
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
            borderRadius: '8px',
            padding: '24px',
            margin: '16px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              確認批量操作
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              確定要對 {selectedReviews.size} 則評論執行
              {batchActionType === 'approve' ? '通過' :
               batchActionType === 'reject' ? '拒絕' :
               batchActionType === 'hide' ? '隱藏' : '刪除'}
              操作嗎？
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowBatchConfirm(false)}
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
                onClick={handleBatchAction}
                style={{
                  padding: '8px 16px',
                  backgroundColor: batchActionType === 'approve' ? '#10b981' :
                                  batchActionType === 'reject' ? '#ef4444' :
                                  batchActionType === 'hide' ? '#6b7280' : '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                確認執行
              </button>
            </div>
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