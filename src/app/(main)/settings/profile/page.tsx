'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Camera, 
  MapPin, 
  Globe, 
  Briefcase, 
  Calendar,
  Star,
  Award,
  Plus,
  X,
  Upload
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';

interface ProfileFormData {
  name: string;
  bio: string;
  phone: string;
  location: string;
  birthDate: string;
  languages: string[];
  specialties: string[];
  experienceYears: number;
  certifications: string[];
  socialLinks: {
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { success, error } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    phone: '',
    location: '',
    birthDate: '',
    languages: [],
    specialties: [],
    experienceYears: 0,
    certifications: [],
    socialLinks: {}
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/settings/profile');
      return;
    }
    
    // 載入用戶資料
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 填入現有用戶資料
        if (user) {
          setFormData({
            name: user.name || '',
            bio: user.profile?.bio || '',
            phone: user.profile?.phone || '',
            location: user.profile?.location || '',
            birthDate: user.profile?.birthDate || '',
            languages: user.profile?.languages || [],
            specialties: user.profile?.specialties || [],
            experienceYears: user.profile?.experienceYears || 0,
            certifications: user.profile?.certifications || [],
            socialLinks: user.profile?.socialLinks || {}
          });
          setAvatar(user.avatar || null);
        }
        
        setIsLoading(false);
      } catch (err) {
        error('載入失敗', '無法載入個人資料');
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, router, user, error]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(spec => spec !== specialty)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certification)
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      error('姓名必填', '請輸入您的姓名');
      return;
    }

    setIsSaving(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 更新用戶資料
      await updateProfile({
        name: formData.name,
        avatar: avatar || undefined,
        profile: {
          bio: formData.bio,
          phone: formData.phone,
          location: formData.location,
          birthDate: formData.birthDate,
          languages: formData.languages,
          specialties: formData.specialties,
          experienceYears: formData.experienceYears,
          certifications: formData.certifications,
          socialLinks: formData.socialLinks
        }
      });
      
      success('更新成功', '個人資料已成功更新');
    } catch (err) {
      error('更新失敗', '無法更新個人資料');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
      }}>
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          <div className="text-center py-12">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">個人資料</h1>
          <p className="text-lg text-gray-600">編輯您的基本資料和個人介紹</p>
        </div>

        <div className="space-y-8">
          {/* 大頭照 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">大頭照</h2>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <label className="block w-8 h-8 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Camera className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">更換大頭照</h3>
                <p className="text-sm text-gray-500 mb-3">
                  支援 JPG、PNG 格式，建議尺寸 400x400 像素
                </p>
                <label className="btn btn-secondary btn-sm cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  上傳照片
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 基本資料 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">基本資料</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input w-full"
                  placeholder="請輸入您的姓名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手機號碼
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input w-full"
                  placeholder="請輸入手機號碼"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所在地區
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="input w-full pl-10"
                    placeholder="例：台北市"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生日
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個人介紹
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="input w-full resize-none"
                placeholder="簡單介紹一下自己..."
              />
            </div>
          </div>

          {/* 專業資訊 */}
          {user?.role === 'guide' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">專業資訊</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    經驗年數
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                      className="input w-full pl-10"
                      placeholder="年"
                    />
                  </div>
                </div>
              </div>

              {/* 語言能力 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  語言能力
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {language}
                      <button
                        onClick={() => removeLanguage(language)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                    className="input flex-1"
                    placeholder="新增語言..."
                  />
                  <button
                    onClick={addLanguage}
                    className="btn btn-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 專業領域 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  專業領域
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {specialty}
                      <button
                        onClick={() => removeSpecialty(specialty)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                    className="input flex-1"
                    placeholder="新增專業領域..."
                  />
                  <button
                    onClick={addSpecialty}
                    className="btn btn-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 認證資格 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  認證資格
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.certifications.map((certification, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      {certification}
                      <button
                        onClick={() => removeCertification(certification)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                    className="input flex-1"
                    placeholder="新增認證資格..."
                  />
                  <button
                    onClick={addCertification}
                    className="btn btn-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 社群連結 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">社群連結</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  個人網站
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.website || ''}
                  onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                  className="input w-full"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.instagram || ''}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  className="input w-full"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.facebook || ''}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  className="input w-full"
                  placeholder="Facebook 個人檔案網址"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  className="input w-full"
                  placeholder="LinkedIn 個人檔案網址"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 儲存按鈕 */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost"
            disabled={isSaving}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                儲存中...
              </div>
            ) : (
              '儲存變更'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}