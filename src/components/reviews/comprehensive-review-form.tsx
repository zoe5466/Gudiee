// 綜合評論表單組件
// 功能：支援雙向評論、詳細評分類別、照片上傳、標籤選擇等完整功能
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Star, 
  Upload, 
  X, 
  Plus, 
  Minus, 
  Camera, 
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Tag
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import type { 
  ReviewFormData, 
  RatingDetails, 
  ReviewerType, 
  RatingDimension,
  TravelerRatingDimension 
} from '@/types/review';

// 組件屬性介面
interface ComprehensiveReviewFormProps {
  orderId: string;                    // 訂單 ID
  revieweeId: string;                 // 被評論者 ID
  reviewerType: ReviewerType;         // 評論者類型
  serviceName: string;                // 服務名稱
  revieweeName: string;               // 被評論者姓名
  onSubmit: (data: ReviewFormData) => Promise<void>; // 提交回調
  onCancel: () => void;               // 取消回調
  isLoading?: boolean;                // 載入狀態
  className?: string;                 // 自定義樣式
}

// 評分標籤對應
const RATING_LABELS = {
  1: '很差',
  2: '不好', 
  3: '一般',
  4: '很好',
  5: '優秀'
};

// 導遊評分維度
const GUIDE_RATING_DIMENSIONS: Array<{
  key: RatingDimension;
  label: string;
  description: string;
  icon: string;
}> = [
  { key: 'communication', label: '溝通能力', description: '清楚表達、及時回應', icon: '💬' },
  { key: 'punctuality', label: '準時性', description: '準時到達、遵守時間', icon: '⏰' },
  { key: 'knowledge', label: '專業知識', description: '對當地的了解程度', icon: '📚' },
  { key: 'friendliness', label: '友善度', description: '親切態度、服務精神', icon: '😊' },
  { key: 'value', label: '物有所值', description: '服務品質與價格匹配', icon: '💰' },
  { key: 'safety', label: '安全性', description: '注重安全、風險管控', icon: '🛡️' },
  { key: 'flexibility', label: '彈性配合', description: '靈活調整、滿足需求', icon: '🔄' },
  { key: 'professionalism', label: '專業性', description: '職業素養、服務態度', icon: '👔' }
];

// 旅客評分維度
const TRAVELER_RATING_DIMENSIONS: Array<{
  key: TravelerRatingDimension;
  label: string;
  description: string;
  icon: string;
}> = [
  { key: 'communication', label: '溝通配合', description: '溝通順暢、配合度高', icon: '💬' },
  { key: 'punctuality', label: '準時出席', description: '按時到達、不遲到', icon: '⏰' },
  { key: 'respect', label: '尊重態度', description: '禮貌待人、尊重文化', icon: '🤝' },
  { key: 'following_rules', label: '遵守規則', description: '配合安排、遵守規定', icon: '📋' }
];

// 預定義標籤
const PREDEFINED_TAGS = {
  GUIDE: [
    '專業知識豐富', '準時可靠', '親切友善', '溝通良好', '行程安排佳',
    '攝影技術好', '語言能力強', '安全意識高', '服務周到', '幽默風趣',
    '價格合理', '彈性配合', '責任心強', '文化介紹詳細', '推薦景點棒'
  ],
  TRAVELER: [
    '準時配合', '溝通順暢', '禮貌友善', '遵守規則', '配合度高',
    '尊重文化', '安全意識', '團隊合作', '積極參與', '感謝支持'
  ]
};

/**
 * 綜合評論表單主組件
 */
export default function ComprehensiveReviewForm({
  orderId,
  revieweeId,
  reviewerType,
  serviceName,
  revieweeName,
  onSubmit,
  onCancel,
  isLoading = false,
  className = ''
}: ComprehensiveReviewFormProps) {
  const { user } = useAuth();
  
  // 表單狀態管理
  const [rating, setRating] = useState<RatingDetails>({ overall: 0 });
  const [hoverRating, setHoverRating] = useState<{ [key: string]: number }>({});
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState<string[]>(['']);
  const [cons, setCons] = useState<string[]>(['']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 根據評論者類型選擇評分維度
  const ratingDimensions = reviewerType === 'TRAVELER' ? GUIDE_RATING_DIMENSIONS : TRAVELER_RATING_DIMENSIONS;
  const availableTags = PREDEFINED_TAGS[reviewerType === 'TRAVELER' ? 'GUIDE' : 'TRAVELER'];

  /**
   * 評分星星組件
   */
  const StarRating = useCallback(({ 
    dimension, 
    value, 
    onChange, 
    label, 
    description,
    icon 
  }: {
    dimension: string;
    value: number;
    onChange: (value: number) => void;
    label: string;
    description: string;
    icon: string;
  }) => {
    const handleMouseEnter = (starValue: number) => {
      setHoverRating(prev => ({ ...prev, [dimension]: starValue }));
    };

    const handleMouseLeave = () => {
      setHoverRating(prev => ({ ...prev, [dimension]: 0 }));
    };

    const currentRating = hoverRating[dimension] || value;

    return (
      <div style={{
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>{icon}</span>
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0'
            }}>
              {label}
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0'
            }}>
              {description}
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => handleMouseEnter(star)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onChange(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Star
                  size={24}
                  color={star <= currentRating ? '#fbbf24' : '#d1d5db'}
                  fill={star <= currentRating ? '#fbbf24' : 'none'}
                />
              </button>
            ))}
          </div>
          
          {value > 0 && (
            <span style={{
              fontSize: '14px',
              color: '#6b7280',
              marginLeft: '8px'
            }}>
              {value} 星 - {RATING_LABELS[value as keyof typeof RATING_LABELS]}
            </span>
          )}
        </div>
      </div>
    );
  }, [hoverRating]);

  /**
   * 處理照片上傳
   */
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => {
      // 檢查檔案類型
      if (!file.type.startsWith('image/')) {
        return false;
      }
      // 檢查檔案大小（最大5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert(`檔案 ${file.name} 超過 5MB 限制`);
        return false;
      }
      return true;
    });
    
    // 檢查照片數量限制
    if (imageFiles.length + photos.length > 10) {
      alert('最多只能上傳 10 張照片');
      return;
    }
    
    setPhotos(prev => [...prev, ...imageFiles]);
  };

  /**
   * 移除照片
   */
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * 添加優缺點項目
   */
  const addProCon = (type: 'pros' | 'cons') => {
    if (type === 'pros') {
      setPros(prev => [...prev, '']);
    } else {
      setCons(prev => [...prev, '']);
    }
  };

  /**
   * 移除優缺點項目
   */
  const removeProCon = (type: 'pros' | 'cons', index: number) => {
    if (type === 'pros') {
      setPros(prev => prev.filter((_, i) => i !== index));
    } else {
      setCons(prev => prev.filter((_, i) => i !== index));
    }
  };

  /**
   * 更新優缺點內容
   */
  const updateProCon = (type: 'pros' | 'cons', index: number, value: string) => {
    if (type === 'pros') {
      setPros(prev => prev.map((item, i) => i === index ? value : item));
    } else {
      setCons(prev => prev.map((item, i) => i === index ? value : item));
    }
  };

  /**
   * 切換標籤選擇
   */
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  /**
   * 添加自定義標籤
   */
  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  /**
   * 表單驗證
   */
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 檢查整體評分
    if (rating.overall === 0) {
      newErrors.overall = '請選擇整體評分';
    }

    // 檢查評論內容
    if (comment.trim().length < 20) {
      newErrors.comment = '評論內容至少需要 20 個字符';
    }

    // 檢查是否有足夠的評分維度
    const dimensionKeys = ratingDimensions.map(d => d.key);
    const ratedDimensions = dimensionKeys.filter(key => (rating as any)[key] > 0);
    
    if (ratedDimensions.length < 3) {
      newErrors.dimensions = '請至少評分 3 個維度';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 處理表單提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('請先登入');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: ReviewFormData = {
        orderId,
        revieweeId,
        reviewerType,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        pros: pros.filter(p => p.trim()),
        cons: cons.filter(c => c.trim()),
        tags: selectedTags,
        isAnonymous,
        photos
      };

      await onSubmit(formData);
      alert('評論提交成功！感謝您的寶貴意見！');
      
    } catch (error) {
      console.error('提交評論失敗:', error);
      alert('提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 計算整體進度
  const totalSteps = 6; // 整體評分、維度評分、內容、優缺點、標籤、照片
  const completedSteps = [
    rating.overall > 0,
    Object.values(rating).filter(r => r > 0).length >= 4,
    comment.length >= 20,
    pros.some(p => p.trim()) || cons.some(c => c.trim()),
    selectedTags.length > 0,
    true // 照片是可選的
  ].filter(Boolean).length;

  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`} style={{ padding: '24px' }}>
      {/* 表單標題 */}
      <div style={{
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '16px',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          撰寫評論
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0'
        }}>
          評論{reviewerType === 'TRAVELER' ? '導遊' : '旅客'}：{revieweeName} - {serviceName}
        </p>
        
        {/* 進度條 */}
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>完成進度</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>{Math.round(progress)}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 整體評分 */}
        <div style={{ marginBottom: '32px' }}>
          <StarRating
            dimension="overall"
            value={rating.overall}
            onChange={(value) => setRating(prev => ({ ...prev, overall: value }))}
            label="整體滿意度"
            description="對整體服務體驗的評價"
            icon="⭐"
          />
          {errors.overall && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              <AlertCircle size={16} style={{ marginRight: '4px' }} />
              {errors.overall}
            </div>
          )}
        </div>

        {/* 詳細評分維度 */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            詳細評分
          </h3>
          <div style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {ratingDimensions.map(({ key, label, description, icon }) => (
              <StarRating
                key={key}
                dimension={key}
                value={(rating as any)[key] || 0}
                onChange={(value) => setRating(prev => ({ ...prev, [key]: value }))}
                label={label}
                description={description}
                icon={icon}
              />
            ))}
          </div>
          {errors.dimensions && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              <AlertCircle size={16} style={{ marginRight: '4px' }} />
              {errors.dimensions}
            </div>
          )}
        </div>

        {/* 評論標題（可選） */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            評論標題（可選）
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="簡短概括您的體驗..."
            maxLength={100}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'right',
            marginTop: '4px'
          }}>
            {title.length}/100
          </div>
        </div>

        {/* 詳細評論 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            詳細評論 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="請詳細分享您的體驗，幫助其他用戶了解這項服務..."
            rows={6}
            maxLength={2000}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.comment ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              if (!errors.comment) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.comment) {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4px'
          }}>
            {errors.comment ? (
              <span style={{ fontSize: '12px', color: '#ef4444' }}>
                {errors.comment}
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                最少 20 個字符
              </span>
            )}
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {comment.length}/2000
            </span>
          </div>
        </div>

        {/* 優點列表 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <label style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              <ThumbsUp size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              服務優點
            </label>
            <button
              type="button"
              onClick={() => addProCon('pros')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                color: '#059669',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              新增
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pros.map((pro, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => updateProCon('pros', index, e.target.value)}
                  placeholder="例如：導遊很專業，講解詳細"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                {pros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProCon('pros', index)}
                    style={{
                      padding: '8px',
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 缺點列表 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <label style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              <ThumbsDown size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              改進建議
            </label>
            <button
              type="button"
              onClick={() => addProCon('cons')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              新增
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cons.map((con, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={con}
                  onChange={(e) => updateProCon('cons', index, e.target.value)}
                  placeholder="例如：時間安排可以更彈性"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                {cons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProCon('cons', index)}
                    style={{
                      padding: '8px',
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 標籤選擇 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            <Tag size={16} style={{ marginRight: '8px' }} />
            服務特色標籤
          </label>
          
          {/* 預定義標籤 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: selectedTags.includes(tag) ? '#dbeafe' : '#f9fafb',
                  borderColor: selectedTags.includes(tag) ? '#3b82f6' : '#d1d5db',
                  color: selectedTags.includes(tag) ? '#1e40af' : '#374151'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* 自定義標籤輸入 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="輸入自定義標籤..."
              maxLength={20}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <button
              type="button"
              onClick={addCustomTag}
              disabled={!customTag.trim() || selectedTags.includes(customTag.trim())}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                opacity: !customTag.trim() || selectedTags.includes(customTag.trim()) ? 0.5 : 1
              }}
            >
              添加
            </button>
          </div>
          
          {/* 已選標籤 */}
          {selectedTags.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                已選標籤：
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        marginLeft: '4px',
                        background: 'none',
                        border: 'none',
                        color: '#1e40af',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 照片上傳 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            <Camera size={16} style={{ marginRight: '8px' }} />
            上傳照片（最多 10 張，每張最大 5MB）
          </label>
          
          {/* 照片預覽 */}
          {photos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '12px',
              marginBottom: '12px'
            }}>
              {photos.map((photo, index) => (
                <div key={index} style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '1'
                }}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`評論照片 ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* 上傳按鈕 */}
          {photos.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '24px',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
            >
              <Upload size={24} />
              <span>點擊上傳照片 ({photos.length}/10)</span>
              <span style={{ fontSize: '12px' }}>
                支援 JPG、PNG、GIF 格式
              </span>
            </button>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* 匿名選項 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            style={{
              width: '16px',
              height: '16px'
            }}
          />
          <label htmlFor="anonymous" style={{
            fontSize: '14px',
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
            匿名發布評論
          </label>
          <span style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            勾選後您的姓名將不會顯示在評論中
          </span>
        </div>

        {/* 提交按鈕 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: isSubmitting ? 0.5 : 1
            }}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting || rating.overall === 0 || comment.length < 20}
            style={{
              flex: 2,
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: isSubmitting || rating.overall === 0 || comment.length < 20 ? '#9ca3af' : '#3b82f6',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isSubmitting || rating.overall === 0 || comment.length < 20 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                提交中...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                發布評論
              </>
            )}
          </button>
        </div>
      </form>

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