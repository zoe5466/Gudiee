'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Star, ThumbsUp, MessageCircle, MoreHorizontal, User } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/store/auth';

interface Review {
  id: string;
  rating: number;
  comment: string;
  photos: string[];
  pros: string[];
  cons: string[];
  tags: string[];
  isAnonymous: boolean;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
  };
  service?: {
    id: string;
    title: string;
    location: string;
    guide: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  booking?: {
    id: string;
    bookingDate: string;
    guests: number;
  };
  responses?: Array<{
    id: string;
    content: string;
    authorType: 'GUIDE' | 'ADMIN';
    createdAt: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      role: string;
    };
  }>;
  helpful?: Array<{
    userId: string;
  }>;
}

interface ReviewCardProps {
  review: Review;
  showService?: boolean;
  onHelpful?: (reviewId: string) => void;
  onUnhelpful?: (reviewId: string) => void;
  onReply?: (reviewId: string) => void;
}

export default function ReviewCard({ 
  review, 
  showService = false,
  onHelpful,
  onUnhelpful,
  onReply
}: ReviewCardProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  const isHelpful = user ? review.helpful?.some(h => h.userId === user.id) : false;
  const canReply = user && (
    (review.service && user.id === review.service.guide.id) ||
    user.role === 'admin'
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: zhTW
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      {/* 評論頭部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {review.isAnonymous ? (
              <User className="w-6 h-6 text-gray-500" />
            ) : review.reviewer.avatar ? (
              <Image
                src={review.reviewer.avatar}
                alt={review.reviewer.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {review.reviewer.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {review.isAnonymous ? '匿名用戶' : review.reviewer.name}
              </span>
              {review.isVerified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  已驗證
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{formatDate(review.createdAt)}</span>
              {review.booking && (
                <span>
                  {new Date(review.booking.bookingDate).toLocaleDateString('zh-TW')} • 
                  {review.booking.guests} 人參與
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 服務信息（如果需要顯示） */}
      {showService && review.service && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {review.service.guide.avatar ? (
                <Image
                  src={review.service.guide.avatar}
                  alt={review.service.guide.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                  {review.service.guide.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{review.service.title}</h4>
              <p className="text-sm text-gray-600">
                {review.service.location} • 嚮導：{review.service.guide.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 評分和評論內容 */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex space-x-1">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm text-gray-600">{review.rating}/5</span>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <p className={`text-gray-800 ${!isExpanded && review.comment.length > 200 ? 'line-clamp-3' : ''}`}>
            {review.comment}
          </p>
          {review.comment.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isExpanded ? '收起' : '查看更多'}
            </button>
          )}
        </div>
      </div>

      {/* 優缺點 */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {review.pros.length > 0 && (
            <div>
              <h5 className="font-medium text-green-800 mb-2">優點</h5>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start">
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div>
              <h5 className="font-medium text-red-800 mb-2">缺點</h5>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start">
                    <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 標籤 */}
      {review.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 照片 */}
      {review.photos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {review.photos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={photo}
                  alt={`評論照片 ${index + 1}`}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 互動按鈕 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => isHelpful ? onUnhelpful?.(review.id) : onHelpful?.(review.id)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isHelpful
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
            <span>有用 ({review.helpfulCount})</span>
          </button>

          {canReply && (
            <button
              onClick={() => onReply?.(review.id)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>回復</span>
            </button>
          )}

          {review.responses && review.responses.length > 0 && (
            <button
              onClick={() => setShowResponses(!showResponses)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showResponses ? '隱藏回復' : `查看回復 (${review.responses.length})`}
            </button>
          )}
        </div>
      </div>

      {/* 回復列表 */}
      {showResponses && review.responses && review.responses.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-100">
          {review.responses.map((response) => (
            <div key={response.id} className="mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {response.author.avatar ? (
                    <Image
                      src={response.author.avatar}
                      alt={response.author.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white text-xs font-semibold ${
                      response.authorType === 'GUIDE' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {response.author.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{response.author.name}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      response.authorType === 'GUIDE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {response.authorType === 'GUIDE' ? '嚮導' : '管理員'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(response.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{response.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}