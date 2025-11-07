'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Upload, ArrowLeft, Calendar, Users, Clock, MapPin, DollarSign, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';

export default function CreateServicePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    location: '',
    duration: '4',
    maxGuests: '6',
    minGuests: '1',
    category: '',
    highlights: [''],
    included: [''],
    excluded: [''],
    images: [] as string[],
    cancellationPolicy: ''
  });

  // 檢查認證狀態和權限
  useEffect(() => {
    if (!authLoading) {
      // 檢查是否登入
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      // 檢查是否為導遊角色
      if (user?.role !== 'guide') {
        router.push('/');
        return;
      }

      // 檢查是否完成KYC驗證
      if (!user?.isKYCVerified) {
        router.push('/kyc');
        return;
      }

      // 檢查是否完成良民證驗證（新增）
      if (!user?.isCriminalRecordVerified) {
        // 暫時跳轉到KYC頁面，實際部署時應該有專門的良民證驗證頁面
        router.push('/kyc');
        return;
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'highlights' | 'included' | 'excluded', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: 'highlights' | 'included' | 'excluded') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'highlights' | 'included' | 'excluded', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          maxGuests: parseInt(formData.maxGuests),
          minGuests: parseInt(formData.minGuests),
          highlights: formData.highlights.filter(h => h.trim()),
          included: formData.included.filter(i => i.trim()),
          excluded: formData.excluded.filter(e => e.trim())
        })
      });

      if (response.ok) {
        router.push('/guide/dashboard');
      } else {
        alert('創建服務失敗，請稍後重試');
      }
    } catch (error) {
      console.error('創建服務錯誤:', error);
      alert('創建服務失敗，請稍後重試');
    }
  };

  const categories = [
    { id: 'sightseeing', name: '觀光導覽' },
    { id: 'food', name: '美食體驗' },
    { id: 'culture', name: '文化探索' },
    { id: 'nature', name: '自然探險' },
    { id: 'photography', name: '攝影導覽' },
    { id: 'shopping', name: '購物指南' }
  ];

  // 顯示載入狀態
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // 檢查認證狀態（額外保護）
  if (!isAuthenticated || user?.role !== 'guide' || !user?.isKYCVerified || !user?.isCriminalRecordVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            驗證未完成
          </h2>
          <p className="text-gray-600 mb-6">
            您需要完成身分驗證和良民證上傳才能創建服務
          </p>
          <button
            onClick={() => router.push('/kyc')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往驗證
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">創建新服務</h1>
              <p className="text-gray-600 mt-1">分享您的專業知識，為旅客提供獨特體驗</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: 基本資訊 */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">基本資訊</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  服務標題 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="例：台北101周邊深度導覽"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  簡短描述 *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="一句話描述您的服務"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  詳細描述 *
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="詳細介紹您的服務內容、行程安排、特色等..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    地點 *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="例：台北市信義區"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    服務分類 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選擇分類</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.description || !formData.location || !formData.category}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 服務詳情 */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">服務詳情</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    價格 (NT$) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="2000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    時長 (小時) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    最大人數 *
                  </label>
                  <input
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                    placeholder="6"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 服務亮點 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  服務亮點
                </label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      placeholder="例：專業攝影拍照"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('highlights', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('highlights')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  新增亮點
                </button>
              </div>

              {/* 包含項目 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  包含項目
                </label>
                {formData.included.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('included', index, e.target.value)}
                      placeholder="例：專業導覽服務"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.included.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('included', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('included')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  新增包含項目
                </button>
              </div>

              {/* 不包含項目 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  不包含項目
                </label>
                {formData.excluded.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('excluded', index, e.target.value)}
                      placeholder="例：個人餐費"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.excluded.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('excluded', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('excluded')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  新增不包含項目
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                上一步
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.price || !formData.duration || !formData.maxGuests}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 圖片與政策 */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">圖片與政策</h2>
            
            <div className="space-y-6">
              {/* 圖片上傳 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  服務圖片
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">點擊上傳或拖拽圖片至此</p>
                  <p className="text-sm text-gray-500">支援 JPG、PNG 格式，建議尺寸 1200x800</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      // Handle file upload logic here
                      console.log('Files selected:', e.target.files);
                    }}
                  />
                </div>
              </div>

              {/* 取消政策 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  取消政策
                </label>
                <textarea
                  rows={4}
                  value={formData.cancellationPolicy}
                  onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                  placeholder="請說明您的取消和退款政策..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 服務條款確認 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">服務條款</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• 確保提供的資訊真實準確</p>
                  <p>• 按時提供承諾的服務</p>
                  <p>• 遵守平台的服務規範</p>
                  <p>• 尊重客戶隱私和權益</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                上一步
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                創建服務
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}