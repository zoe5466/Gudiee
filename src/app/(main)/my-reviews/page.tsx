'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Calendar, MapPin, MessageCircle, Edit, Trash2, Camera } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useReviews, Review } from '@/store/reviews';
import { Loading } from '@/components/ui/loading';
import { Modal, useModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function MyReviewsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { userReviews, isLoading, fetchUserReviews, updateReview, deleteReview } = useReviews();
  const { success, error } = useToast();
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editFormData, setEditFormData] = useState({
    rating: 5,
    comment: '',
    pros: '',
    cons: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/my-reviews');
      return;
    }
    
    if (user) {
      fetchUserReviews(user.id);
    }
  }, [isAuthenticated, user, router, fetchUserReviews]);

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setEditFormData({
      rating: review.rating,
      comment: review.comment,
      pros: review.pros?.join(', ') || '',
      cons: review.cons?.join(', ') || ''
    });
    openEditModal();
  };

  const handleSaveReview = async () => {
    if (!selectedReview) return;
    
    try {
      await updateReview(selectedReview.id, {
        rating: editFormData.rating,
        comment: editFormData.comment,
        pros: editFormData.pros.split(',').map(s => s.trim()).filter(Boolean),
        cons: editFormData.cons.split(',').map(s => s.trim()).filter(Boolean)
      });
      
      success('更新成功', '評論已成功更新');
      closeEditModal();
      setSelectedReview(null);
    } catch (err) {
      error('更新失敗', '無法更新評論，請稍後再試');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('確定要刪除這個評論嗎？此操作無法復原。')) {
      return;
    }
    
    try {
      await deleteReview(reviewId);
      success('刪除成功', '評論已成功刪除');
    } catch (err) {
      error('刪除失敗', '無法刪除評論，請稍後再試');
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`ml-2 font-medium ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {rating}.0
        </span>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的評價</h1>
          <p className="text-lg text-gray-600">管理您對地陪服務的評價和回饋</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loading size="lg" />
          </div>
        ) : userReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">還沒有評價</h3>
            <p className="text-gray-500 mb-6">
              完成服務體驗後，您可以在這裡管理您的評價
            </p>
            <button
              onClick={() => router.push('/search')}
              className="btn btn-primary"
            >
              探索地陪服務
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 服務信息 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      台北101深度導覽 {/* 這裡應該從實際的服務數據獲取 */}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString('zh-TW')}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        台北市信義區 {/* 這裡應該從實際的服務數據獲取 */}
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按鈕 */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="編輯評價"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="刪除評價"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 評分 */}
                <div className="mb-4">
                  {renderStars(review.rating, 'md')}
                </div>

                {/* 評論內容 */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* 優缺點 */}
                {(review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {review.pros && review.pros.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">優點</h4>
                        <div className="flex flex-wrap gap-2">
                          {review.pros.map((pro, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                            >
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {review.cons && review.cons.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">可改進</h4>
                        <div className="flex flex-wrap gap-2">
                          {review.cons.map((con, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                            >
                              {con}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 狀態和統計 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      review.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : review.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {review.status === 'approved' ? '已發布' : 
                       review.status === 'PENDING' ? '審核中' : '已隱藏'}
                    </span>
                    {review.isVerified && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        已驗證預訂
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{review.helpful} 個讚</span>
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        {review.photos.length} 張照片
                      </div>
                    )}
                  </div>
                </div>

                {/* 回覆 */}
                {review.response && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-900">地陪回覆</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.response.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.response.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 編輯評價 Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          title="編輯評價"
          size="lg"
        >
          <div className="space-y-6">
            {/* 評分 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評分
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= editFormData.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 hover:text-yellow-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-lg font-medium">{editFormData.rating}.0</span>
              </div>
            </div>

            {/* 評論內容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評論內容
              </label>
              <textarea
                value={editFormData.comment}
                onChange={(e) => setEditFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="input min-h-[120px] w-full"
                placeholder="分享您的體驗..."
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {editFormData.comment.length}/500
              </p>
            </div>

            {/* 優點 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優點（用逗號分隔）
              </label>
              <input
                type="text"
                value={editFormData.pros}
                onChange={(e) => setEditFormData(prev => ({ ...prev, pros: e.target.value }))}
                className="input w-full"
                placeholder="例：準時, 專業, 親切"
              />
            </div>

            {/* 可改進之處 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                可改進之處（用逗號分隔）
              </label>
              <input
                type="text"
                value={editFormData.cons}
                onChange={(e) => setEditFormData(prev => ({ ...prev, cons: e.target.value }))}
                className="input w-full"
                placeholder="例：時間安排緊湊"
              />
            </div>

            {/* 操作按鈕 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeEditModal}
                className="btn btn-ghost"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="btn btn-primary"
              >
                儲存變更
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}