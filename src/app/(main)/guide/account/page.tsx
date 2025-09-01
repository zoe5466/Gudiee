'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Star, 
  Languages, 
  Shield, 
  CreditCard, 
  Bell, 
  Lock,
  Globe,
  Award,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';

interface GuideProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: string;
  languages: string[];
  experience: number;
  specialties: string[];
  certifications: Certification[];
  rating: number;
  reviewCount: number;
  totalEarnings: number;
  completedBookings: number;
  responseTime: string;
  isVerified: boolean;
  joinedAt: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  imageUrl?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  maxGuests: number;
  images: string[];
  isActive: boolean;
  totalBookings: number;
  rating: number;
  createdAt: string;
}

type TabType = 'profile' | 'services' | 'certifications' | 'settings' | 'security';

export default function GuideAccountPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    languages: [] as string[],
    specialties: [] as string[]
  });

  // 檢查認證狀態
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadAccountData();
  }, [isAuthenticated, router]);

  const loadAccountData = async () => {
    setIsLoading(true);
    try {
      // TODO: 實際 API 調用
      const mockProfile: GuideProfile = {
        id: user?.id || 'guide-1',
        name: '張小明',
        email: 'zhang@example.com',
        phone: '+886 912-345-678',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        bio: '我是台北在地的導遊，有10年的旅遊業經驗。擅長文化導覽和美食推薦，能說流利的中英日文。',
        location: '台北市',
        languages: ['中文', '英文', '日文'],
        experience: 10,
        specialties: ['文化導覽', '美食體驗', '攝影服務'],
        certifications: [
          {
            id: 'cert-1',
            name: '導遊執業證',
            issuer: '交通部觀光局',
            issueDate: '2020-03-15',
            credentialId: 'TG-2020-001234'
          },
          {
            id: 'cert-2',
            name: '急救員證書',
            issuer: '紅十字會',
            issueDate: '2022-01-10',
            expiryDate: '2025-01-10'
          }
        ],
        rating: 4.9,
        reviewCount: 156,
        totalEarnings: 285000,
        completedBookings: 98,
        responseTime: '30分鐘',
        isVerified: true,
        joinedAt: '2020-01-15'
      };

      const mockServices: Service[] = [
        {
          id: 'service-1',
          title: '台北101 & 信義區深度導覽',
          description: '帶您深度探索台北最精華的信義區，從台北101觀景台俯瞰整個台北盆地',
          category: '文化導覽',
          price: 800,
          duration: '4小時',
          maxGuests: 6,
          images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
          isActive: true,
          totalBookings: 42,
          rating: 4.8,
          createdAt: '2023-06-15'
        },
        {
          id: 'service-2',
          title: '夜市美食探索之旅',
          description: '體驗正宗的台灣夜市文化，尋找道地的小吃和隱藏版美食',
          category: '美食體驗',
          price: 600,
          duration: '3小時',
          maxGuests: 4,
          images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
          isActive: true,
          totalBookings: 28,
          rating: 4.9,
          createdAt: '2023-08-20'
        }
      ];

      setProfile(mockProfile);
      setServices(mockServices);
      setFormData({
        name: mockProfile.name,
        email: mockProfile.email,
        phone: mockProfile.phone,
        bio: mockProfile.bio,
        location: mockProfile.location,
        languages: mockProfile.languages,
        specialties: mockProfile.specialties
      });
    } catch (err) {
      error('載入失敗', '無法載入帳戶資料');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: 實際 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (profile) {
        setProfile({
          ...profile,
          ...formData
        });
      }
      
      success('儲存成功', '個人資料已更新');
    } catch (err) {
      error('儲存失敗', '無法更新個人資料');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleService = async (serviceId: string) => {
    try {
      setServices(prev => 
        prev.map(service => 
          service.id === serviceId 
            ? { ...service, isActive: !service.isActive }
            : service
        )
      );
      success('更新成功', '服務狀態已更新');
    } catch (err) {
      error('更新失敗', '無法更新服務狀態');
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: '個人資料', icon: User },
    { id: 'services' as TabType, label: '服務管理', icon: BarChart3 },
    { id: 'certifications' as TabType, label: '證照認證', icon: Award },
    { id: 'settings' as TabType, label: '帳戶設定', icon: Settings },
    { id: 'security' as TabType, label: '安全設定', icon: Shield }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="flex justify-center items-center py-20">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">帳戶管理</h1>
          <p className="text-gray-600">管理您的個人資料和服務檔案</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 側邊導航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* 用戶頭像和基本信息 */}
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <img
                    src={profile?.avatar}
                    alt={profile?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {profile?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{profile?.name}</h3>
                <p className="text-sm text-gray-600 flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  {profile?.rating} ({profile?.reviewCount} 評價)
                </p>
              </div>

              {/* 導航選項 */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#FF5A5F] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* 主要內容區域 */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">個人資料</h2>
                
                <div className="space-y-6">
                  {/* 頭像上傳 */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={profile?.avatar}
                      alt={profile?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-[#FF5A5F] transition-colors">
                        <Camera className="w-4 h-4 mr-2" />
                        更換頭像
                      </button>
                      <p className="text-xs text-gray-500 mt-1">支援 JPG, PNG 格式，最大 5MB</p>
                    </div>
                  </div>

                  {/* 基本資料表單 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">電話號碼</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">所在地區</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                      />
                    </div>
                  </div>

                  {/* 自我介紹 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">自我介紹</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                      placeholder="介紹您的專業背景和服務特色..."
                    />
                  </div>

                  {/* 語言能力 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">語言能力</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#FF5A5F] text-white rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                      <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:border-[#FF5A5F] transition-colors">
                        + 新增語言
                      </button>
                    </div>
                  </div>

                  {/* 專業領域 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">專業領域</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                      <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:border-[#FF5A5F] transition-colors">
                        + 新增專業
                      </button>
                    </div>
                  </div>

                  {/* 儲存按鈕 */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center px-6 py-3 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E1464A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <Loading size="sm" className="mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? '儲存中...' : '儲存變更'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">服務管理</h2>
                  <button
                    onClick={() => router.push('/guide/services/create')}
                    className="flex items-center px-4 py-2 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E1464A] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    新增服務
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{service.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {service.isActive ? '啟用中' : '已停用'}
                            </span>
                            <button
                              onClick={() => handleToggleService(service.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{service.category} • {service.duration} • 最多 {service.maxGuests} 人</span>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              {service.rating}
                            </span>
                            <span>{service.totalBookings} 次預訂</span>
                            <span className="font-medium text-[#FF5A5F]">NT$ {service.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certifications' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">證照認證</h2>
                  <button className="flex items-center px-4 py-2 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E1464A] transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    新增證照
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile?.certifications.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <Award className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{cert.name}</h3>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>發證日期：{new Date(cert.issueDate).toLocaleDateString('zh-TW')}</p>
                        {cert.expiryDate && (
                          <p>到期日期：{new Date(cert.expiryDate).toLocaleDateString('zh-TW')}</p>
                        )}
                        {cert.credentialId && (
                          <p>證照編號：{cert.credentialId}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">通知設定</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">新預訂通知</h3>
                        <p className="text-sm text-gray-600">有新的預訂請求時通知我</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5A5F]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A5F]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">訊息通知</h3>
                        <p className="text-sm text-gray-600">收到新訊息時通知我</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5A5F]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A5F]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">收款設定</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                          <div>
                            <h3 className="font-medium text-gray-900">銀行帳戶</h3>
                            <p className="text-sm text-gray-600">玉山銀行 ****1234</p>
                          </div>
                        </div>
                        <button className="text-sm text-[#FF5A5F] hover:text-[#E1464A]">
                          編輯
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">密碼設定</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">目前密碼</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">新密碼</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">確認新密碼</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                      />
                    </div>
                    
                    <button className="w-full py-2 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E1464A] transition-colors">
                      更新密碼
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">帳戶安全</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900">身分驗證</h3>
                          <p className="text-sm text-gray-600">已驗證</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        已完成
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Lock className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900">兩步驟驗證</h3>
                          <p className="text-sm text-gray-600">未啟用</p>
                        </div>
                      </div>
                      <button className="text-sm text-[#FF5A5F] hover:text-[#E1464A]">
                        設定
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}