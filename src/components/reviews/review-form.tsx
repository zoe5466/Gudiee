'use client';

import React, { useState } from 'react';
import { Star, Upload, X, Plus } from 'lucide-react';
import { useAuth } from '@/store/auth';

interface ReviewFormProps {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  guideName: string;
  onSubmit: (reviewData: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ReviewForm({
  bookingId,
  serviceId,
  serviceName,
  guideName,
  onSubmit,
  onCancel,
  isLoading = false
}: ReviewFormProps) {
  const { user } = useAuth();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [pros, setPros] = useState<string[]>(['']);
  const [cons, setCons] = useState<string[]>(['']);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableTags = [
    '專業', '準時', '親切', '知識豐富', '溝通良好', '行程豐富',
    '價格合理', '服務周到', '安全可靠', '幽默風趣', '攝影技術好', '語言能力強'
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + photos.length > 5) {
      error('上傳失敗', '最多只能上傳 5 張照片');
      return;
    }
    
    setPhotos(prev => [...prev, ...imageFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const addProCon = (type: 'pros' | 'cons') => {
    if (type === 'pros') {
      setPros(prev => [...prev, '']);
    } else {
      setCons(prev => [...prev, '']);
    }
  };

  const removeProCon = (type: 'pros' | 'cons', index: number) => {
    if (type === 'pros') {
      setPros(prev => prev.filter((_, i) => i !== index));
    } else {
      setCons(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateProCon = (type: 'pros' | 'cons', index: number, value: string) => {
    if (type === 'pros') {
      setPros(prev => prev.map((item, i) => i === index ? value : item));
    } else {
      setCons(prev => prev.map((item, i) => i === index ? value : item));
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      error('提交失敗', '請先登入');
      return;
    }
    
    if (rating === 0) {
      error('提交失敗', '請選擇評分');
      return;
    }
    
    if (comment.trim().length < 10) {
      error('提交失敗', '評論內容至少需要 10 個字符');
      return;
    }

    try {
      await submitReview({
        serviceId,
        guideId,
        userId: user.id,
        bookingId,
        rating,
        comment: comment.trim(),
        photos: photos.map(f => URL.createObjectURL(f)), // 實際應上傳到雲端
        pros: pros.filter(p => p.trim()).length > 0 ? pros.filter(p => p.trim()) : undefined,
        cons: cons.filter(c => c.trim()).length > 0 ? cons.filter(c => c.trim()) : undefined,
        isVerified: true, // 來自真實預訂
        isAnonymous,
        helpful: 0,
        reported: 0,
        tags: selectedTags.length > 0 ? selectedTags : undefined
      });
      
      success('評論提交成功', '感謝您的寶貴意見！');
      onClose?.();
      
    } catch (err) {
      // 錯誤已在 store 中處理
    }
  };

  const canSubmit = rating > 0 && comment.trim().length >= 10 && !isSubmitting;

  return (
    <div className={`bg-white rounded-lg shadow-lg border p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">撰寫評論</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 評分 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            整體評分 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {rating > 0 && (
                <>
                  {rating} 星 - {
                    rating === 5 ? '極好' :
                    rating === 4 ? '很好' :
                    rating === 3 ? '一般' :
                    rating === 2 ? '不好' : '很差'
                  }
                </>
              )}
            </span>
          </div>
        </div>

        {/* 詳細評論 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            詳細評論 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="請分享您的體驗，幫助其他旅客了解這項服務..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            minLength={10}
            maxLength={1000}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>最少 10 個字符</span>
            <span>{comment.length}/1000</span>
          </div>
        </div>

        {/* 標籤選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            服務特色標籤
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 優點 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              服務優點
            </label>
            <button
              type="button"
              onClick={() => addProCon('pros')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>
          <div className="space-y-2">
            {pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => updateProCon('pros', index, e.target.value)}
                  placeholder="例如：導遊很專業"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {pros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProCon('pros', index)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 缺點 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              改進建議
            </label>
            <button
              type="button"
              onClick={() => addProCon('cons')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>
          <div className="space-y-2">
            {cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => updateProCon('cons', index, e.target.value)}
                  placeholder="例如：時間安排可以更彈性"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {cons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProCon('cons', index)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 照片上傳 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            上傳照片 (最多 5 張)
          </label>
          
          <div className="space-y-3">
            {/* 照片預覽 */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`評論照片 ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* 上傳按鈕 */}
            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <span className="text-sm text-gray-600">
                  點擊上傳照片 ({photos.length}/5)
                </span>
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* 匿名選項 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            匿名發布評論
          </label>
        </div>

        {/* 提交按鈕 */}
        <div className="flex gap-3 pt-4 border-t">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              canSubmit
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '提交中...' : '發布評論'}
          </button>
        </div>
      </form>
    </div>
  );
}