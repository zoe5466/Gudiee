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
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    photos: [] as string[],
    pros: [] as string[],
    cons: [] as string[],
    tags: [] as string[],
    isAnonymous: false
  });
  
  const [currentPro, setCurrentPro] = useState('');
  const [currentCon, setCurrentCon] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonTags = [
    '專業', '友善', '準時', '有趣', '知識豐富', '耐心',
    '風景美', '物超所值', '推薦', '體驗佳', '安全',
    '服務好', '講解詳細', '路線規劃好'
  ];

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  const handleCommentChange = (comment: string) => {
    setFormData({ ...formData, comment });
    if (errors.comment) {
      setErrors({ ...errors, comment: '' });
    }
  };

  const addPro = () => {
    if (currentPro.trim() && !formData.pros.includes(currentPro.trim())) {
      setFormData({
        ...formData,
        pros: [...formData.pros, currentPro.trim()]
      });
      setCurrentPro('');
    }
  };

  const removePro = (index: number) => {
    setFormData({
      ...formData,
      pros: formData.pros.filter((_, i) => i !== index)
    });
  };

  const addCon = () => {
    if (currentCon.trim() && !formData.cons.includes(currentCon.trim())) {
      setFormData({
        ...formData,
        cons: [...formData.cons, currentCon.trim()]
      });
      setCurrentCon('');
    }
  };

  const removeCon = (index: number) => {
    setFormData({
      ...formData,
      cons: formData.cons.filter((_, i) => i !== index)
    });
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const addCustomTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = '請選擇評分';
    }

    if (formData.comment.trim().length < 10) {
      newErrors.comment = '評論內容至少需要 10 個字元';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        bookingId,
        serviceId,
        ...formData
      });
    } catch (error) {
      console.error('Submit review error:', error);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingChange(i + 1)}
        className={`w-8 h-8 ${
          i < formData.rating 
            ? 'text-yellow-400' 
            : 'text-gray-300 hover:text-yellow-300'
        } transition-colors`}
      >
        <Star className="w-full h-full fill-current" />
      </button>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">撰寫評論</h2>
          <p className="text-sm text-gray-600 mt-1">
            對 &ldquo;{serviceName}&rdquo; 的體驗評價 • 嚮導：{guideName}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 評分 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            整體評分 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            {formData.rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating}/5 分
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* 評論內容 */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            評論內容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            rows={4}
            value={formData.comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            placeholder="分享您的體驗，幫助其他旅行者了解這個服務..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.comment ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.comment && (
              <p className="text-sm text-red-600">{errors.comment}</p>
            )}
            <p className="text-sm text-gray-500">
              {formData.comment.length} 字元
            </p>
          </div>
        </div>

        {/* 優點 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            服務優點
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={currentPro}
              onChange={(e) => setCurrentPro(e.target.value)}
              placeholder="例如：嚮導很專業"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
            />
            <button
              type="button"
              onClick={addPro}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.pros.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.pros.map((pro, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {pro}
                  <button
                    type="button"
                    onClick={() => removePro(index)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 缺點 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            改進建議
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={currentCon}
              onChange={(e) => setCurrentCon(e.target.value)}
              placeholder="例如：集合時間可以更彈性"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
            />
            <button
              type="button"
              onClick={addCon}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.cons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.cons.map((con, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                >
                  {con}
                  <button
                    type="button"
                    onClick={() => removeCon(index)}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 標籤 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            標籤
          </label>
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">選擇相關標籤：</p>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => formData.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="添加自定義標籤"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 匿名選項 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
            匿名發表評論
          </label>
        </div>

        {/* 提交按鈕 */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '提交中...' : '發表評論'}
          </button>
        </div>
      </form>
    </div>
  );
}