'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Settings, Heart, History, CreditCard, Shield, Bell, Globe, Camera, Star, MapPin, Calendar } from 'lucide-react';
import { useAuth, User } from '@/store/auth';
import { AvatarUpload } from '@/components/ui/image-upload';
import { Modal, useModal } from '@/components/ui/modal';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { SimpleNavigation } from '@/components/layout/page-navigation';

interface ProfileFormData {
  name: string;
  phone: string;
  bio: string;
  location: string;
  languages: string[];
  specialties: string[];
  avatar: string;
}

interface ProfileFormErrors {
  name?: string;
  phone?: string;
  bio?: string;
  location?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, isLoading, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    bio: '',
    location: '',
    languages: [],
    specialties: [],
    avatar: ''
  });
  
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Wait for authentication initialization
  useEffect(() => {
    // Give some time for auth initialization
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000); // Wait 1 second for auth to initialize

    return () => clearTimeout(timer);
  }, []);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
      return;
    }
  }, [isInitializing, isAuthenticated, router]);

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        languages: user.profile?.languages || [],
        specialties: user.profile?.specialties || [],
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2個字元';
    }
    
    if (formData.phone && !/^09\d{8}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = '請輸入有效的台灣手機號碼格式';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = '自我介紹不能超過500個字元';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof ProfileFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update user in store (which will call API)
      await updateUser({
        name: formData.name,
        avatar: formData.avatar,
        profile: {
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          languages: formData.languages,
          specialties: formData.specialties
        }
      });
      
      success('更新成功', '您的個人資料已成功更新');
      closeEditModal();
      
    } catch (err) {
      error('更新失敗', '無法更新個人資料，請稍後再試');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (avatar: string) => {
    handleInputChange('avatar', avatar);
  };

  // Show loading while initializing or checking authentication
  if (isInitializing || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <SimpleNavigation />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }} className="sm:p-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="heading-1 text-gray-900 mb-2">個人中心</h1>
          <p className="body-large">管理您的個人資料和偏好設定</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-3">
          {/* 主要內容 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="lg:col-span-2">
            {/* 用戶資訊卡片 */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-start justify-between mb-6">
                <h2 className="heading-3">個人資料</h2>
                <button 
                  onClick={openEditModal}
                  className="btn btn-secondary btn-sm flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  編輯
                </button>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* 驗證徽章 */}
                  <div className="absolute -bottom-1 -right-1 flex space-x-1">
                    {user.isEmailVerified && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                  <p className="text-gray-600 mb-2">{user.profile?.bio || '還沒有自我介紹'}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.profile?.location || '未設定地區'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      加入於 {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                  
                  {/* 會員狀態 */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'guide' 
                        ? 'bg-[#FF5A5F] text-white' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'guide' ? '地陪' : '旅客'}
                    </span>
                    
                    {!user.isKYCVerified && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        待驗證
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 技能標籤 */}
              {user.profile?.specialties && user.profile.specialties.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">專長領域</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 語言能力 */}
              {user.profile?.languages && user.profile.languages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">語言能力</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.languages.map((language, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 統計數據 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="md:grid-cols-4">
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1rem', textAlign: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">完成預訂</div>
              </div>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1rem', textAlign: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">平均評分</div>
              </div>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1rem', textAlign: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">收藏地陪</div>
              </div>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1rem', textAlign: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">本月預訂</div>
              </div>
            </div>
          </div>

          {/* 側邊欄 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 快速操作 */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h3 className="heading-3 mb-4">快速操作</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/my-bookings')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <History className="w-5 h-5 text-gray-400" />
                  <span>預訂歷史</span>
                </button>
                {user.role === 'guide' && (
                  <button 
                    onClick={() => router.push('/guide-dashboard')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span style={{ color: '#2563eb', fontWeight: '500' }}>導遊控制台</span>
                  </button>
                )}
                <button 
                  onClick={() => router.push('/my-favorites')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-400" />
                  <span>我的收藏</span>
                </button>
                <button 
                  onClick={() => router.push('/my-reviews')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5 text-gray-400" />
                  <span>我的評價</span>
                </button>
                <button 
                  onClick={() => router.push('/payment-methods')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span>付款方式</span>
                </button>
              </div>
            </div>

            {/* 設定 */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h3 className="heading-3 mb-4">設定</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/settings/notifications')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span>通知設定</span>
                </button>
                <button 
                  onClick={() => router.push('/settings/privacy')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span>隱私設定</span>
                </button>
                <button 
                  onClick={() => router.push('/settings/language')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span>語言設定</span>
                </button>
                <button 
                  onClick={() => router.push('/settings/account')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>帳戶設定</span>
                </button>
              </div>
            </div>

            {/* KYC 提醒 */}
            {!user.isKYCVerified && (
              <div className="card p-6 bg-yellow-50 border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">完成身分驗證</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  完成 KYC 驗證可以提升帳戶安全性並解鎖更多功能
                </p>
                <button 
                  onClick={() => router.push('/kyc')}
                  className="btn btn-primary btn-sm w-full"
                >
                  立即驗證
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 編輯資料 Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="編輯個人資料"
        size="lg"
      >
        <form className="space-y-6">
          {/* 頭像上傳 */}
          <AvatarUpload
            value={formData.avatar}
            onChange={handleAvatarChange}
            size="lg"
          />

          {/* 基本資料 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input w-full ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電子郵件 *
              </label>
              <input
                type="email"
                value={user.email}
                className="input bg-gray-50 w-full"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                手機號碼
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`input w-full ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="例：0912345678"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所在地區
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="input w-full"
                placeholder="例：台北市"
              />
            </div>
          </div>

          {/* 自我介紹 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              自我介紹
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className={`input min-h-[100px] w-full ${errors.bio ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
              placeholder="告訴大家關於您的故事..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.bio.length}/500
              </p>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeEditModal}
              className="btn btn-ghost btn-md"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  儲存中...
                </div>
              ) : (
                '儲存變更'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}