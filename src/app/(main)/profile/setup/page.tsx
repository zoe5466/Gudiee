'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Upload, X, AlertCircle, CheckCircle, Camera, User, Phone, MapPin, FileText, CreditCard } from 'lucide-react';
import { useAuth } from '@/store/auth';

interface SetupFormData {
  // 基本資料
  name: string;
  phone: string;
  birthDate: string;
  address: string;
  bio: string;
  
  // 身分驗證
  idNumber: string;
  idCardFront: string;
  idCardBack: string;
  
  // 專業資料（地陪專用）
  languages: string[];
  specialties: string[];
  experienceYears: number;
  certifications: string[];
}

interface SetupFormErrors {
  [key: string]: string;
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SetupFormData>({
    name: '',
    phone: '',
    birthDate: '',
    address: '',
    bio: '',
    idNumber: '',
    idCardFront: '',
    idCardBack: '',
    languages: [],
    specialties: [],
    experienceYears: 0,
    certifications: []
  });
  
  const [errors, setErrors] = useState<SetupFormErrors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // 如果用戶已完成驗證，跳轉到 dashboard
    if (user?.isKYCVerified) {
      if (user.role === 'guide') {
        router.push('/guide/dashboard');
      } else {
        router.push('/');
      }
      return;
    }
    
    // 初始化表單資料
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        languages: user.profile?.languages || [],
        specialties: user.profile?.specialties || [],
        experienceYears: user.profile?.experienceYears || 0
      }));
    }
  }, [isAuthenticated, user, router]);

  const totalSteps = user?.role === 'guide' ? 4 : 3;

  // 處理檔案上傳
  const handleFileUpload = (field: string, file: File) => {
    if (!file) return;
    
    // 檢查檔案大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [field]: '檔案大小不能超過 5MB'
      }));
      return;
    }
    
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        [field]: '請上傳圖片檔案'
      }));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        [field]: result
      }));
      
      // 設置預覽圖片
      setPreviewImage(result);
      
      // 清除錯誤
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    };
    reader.readAsDataURL(file);
  };

  // 驗證當前步驟
  const validateCurrentStep = (): boolean => {
    const newErrors: SetupFormErrors = {};
    
    switch (currentStep) {
      case 1: // 基本資料
        if (!formData.name.trim()) {
          newErrors.name = '請輸入姓名';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = '請輸入手機號碼';
        } else if (!/^09\d{8}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = '請輸入有效的台灣手機號碼格式';
        }
        if (!formData.birthDate) {
          newErrors.birthDate = '請選擇出生日期';
        }
        if (!formData.address.trim()) {
          newErrors.address = '請輸入地址';
        }
        break;
        
      case 2: // 身分驗證
        if (!formData.idNumber.trim()) {
          newErrors.idNumber = '請輸入身分證字號';
        } else if (!/^[A-Z]\d{9}$/.test(formData.idNumber.toUpperCase())) {
          newErrors.idNumber = '請輸入有效的身分證字號格式';
        }
        if (!formData.idCardFront) {
          newErrors.idCardFront = '請上傳身分證正面照片';
        }
        if (!formData.idCardBack) {
          newErrors.idCardBack = '請上傳身分證背面照片';
        }
        break;
        
      case 3: // 個人簡介
        if (!formData.bio.trim()) {
          newErrors.bio = '請輸入個人簡介';
        }
        break;
        
      case 4: // 專業資料（僅地陪）
        if (user?.role === 'guide') {
          if (formData.languages.length === 0) {
            newErrors.languages = '請至少選擇一種語言';
          }
          if (formData.specialties.length === 0) {
            newErrors.specialties = '請至少選擇一種專長';
          }
          if (formData.experienceYears < 0) {
            newErrors.experienceYears = '請輸入有效的經驗年數';
          }
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 下一步
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // 上一步
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // 提交表單
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 更新用戶資料
      await updateUser({
        name: formData.name,
        profile: {
          phone: formData.phone,
          bio: formData.bio,
          birthDate: formData.birthDate,
          location: formData.address,
          languages: formData.languages,
          specialties: formData.specialties,
          experienceYears: formData.experienceYears,
          certifications: formData.certifications
        },
        isKYCVerified: true // 標記為已驗證
      });
      
      // 成功提示
      alert('個人資料設置完成！歡迎使用 Guidee！');
      
      // 跳轉到對應頁面
      if (user?.role === 'guide') {
        router.push('/guide/dashboard');
      } else {
        router.push('/');
      }
      
    } catch (error) {
      console.error('設置失敗詳細錯誤:', error);
      
      // 顯示具體的錯誤訊息
      let errorMessage = '設置失敗，請稍後再試';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // 檢查是否是網路錯誤
      if (errorMessage.includes('fetch')) {
        errorMessage = '網路連線錯誤，請檢查網路連線後重試';
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 處理輸入變更
  const handleInputChange = (field: keyof SetupFormData, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除錯誤
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 關閉預覽
  const closePreview = () => {
    setPreviewImage(null);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">完善個人資料</h1>
          <p className="text-gray-600">
            請完整填寫以下資料以完成帳戶設置
          </p>
        </div>

        {/* 進度指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < totalSteps && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            步驟 {currentStep} / {totalSteps}
          </div>
        </div>

        {/* 表單內容 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 步驟 1: 基本資料 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">基本資料</h2>
                <p className="text-gray-600">請填寫您的基本個人資料</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="請輸入您的真實姓名"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手機號碼 *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="例：0912345678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出生日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    聯絡地址 *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="例：台北市信義區信義路五段7號"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 步驟 2: 身分驗證 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">身分驗證</h2>
                <p className="text-gray-600">請上傳身分證照片以完成身分驗證</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  身分證字號 *
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.idNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="例：A123456789"
                  maxLength={10}
                />
                {errors.idNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.idNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 身分證正面 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    身分證正面 *
                  </label>
                  <div className={`
                    relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors min-h-[160px] flex flex-col justify-center
                    ${errors.idCardFront ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}
                  `}>
                    {formData.idCardFront ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.idCardFront}
                          alt="身分證正面"
                          className="max-h-24 sm:max-h-32 mx-auto rounded cursor-pointer object-cover"
                          onClick={() => setPreviewImage(formData.idCardFront)}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputChange('idCardFront', '');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <p className="text-xs text-gray-500 mt-2">點擊圖片預覽</p>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">點擊上傳身分證正面</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="idCardFront"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('idCardFront', file);
                          }}
                        />
                        <label
                          htmlFor="idCardFront"
                          className="cursor-pointer bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block text-sm"
                        >
                          選擇檔案
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.idCardFront && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.idCardFront}
                    </p>
                  )}
                </div>

                {/* 身分證背面 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    身分證背面 *
                  </label>
                  <div className={`
                    relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors min-h-[160px] flex flex-col justify-center
                    ${errors.idCardBack ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}
                  `}>
                    {formData.idCardBack ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.idCardBack}
                          alt="身分證背面"
                          className="max-h-24 sm:max-h-32 mx-auto rounded cursor-pointer object-cover"
                          onClick={() => setPreviewImage(formData.idCardBack)}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputChange('idCardBack', '');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <p className="text-xs text-gray-500 mt-2">點擊圖片預覽</p>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">點擊上傳身分證背面</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="idCardBack"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('idCardBack', file);
                          }}
                        />
                        <label
                          htmlFor="idCardBack"
                          className="cursor-pointer bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block text-sm"
                        >
                          選擇檔案
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.idCardBack && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.idCardBack}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">上傳注意事項：</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>請確保照片清晰可辨識</li>
                      <li>檔案大小不超過 5MB</li>
                      <li>支援 JPG、PNG 格式</li>
                      <li>我們將嚴格保護您的個人資料</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 步驟 3: 個人簡介 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">個人簡介</h2>
                <p className="text-gray-600">告訴大家關於您的故事</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  個人簡介 * (至少50字)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] ${
                    errors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={user?.role === 'guide' 
                    ? "請介紹您的導遊經驗、專長領域、服務特色等，讓旅客更了解您..."
                    : "請簡單介紹自己，包括興趣愛好、旅遊經驗等..."
                  }
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.bio && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.bio}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.bio.length}/500 字
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 步驟 4: 專業資料（僅地陪） */}
          {currentStep === 4 && user?.role === 'guide' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900">專業資料</h2>
                <p className="text-gray-600">完善您的地陪專業資訊</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    語言能力 *
                  </label>
                  <div className="space-y-2">
                    {['中文', '英文', '日文', '韓文', '法文', '德文', '西班牙文'].map((lang) => (
                      <label key={lang} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(lang)}
                          onChange={(e) => {
                            const newLanguages = e.target.checked
                              ? [...formData.languages, lang]
                              : formData.languages.filter(l => l !== lang);
                            handleInputChange('languages', newLanguages);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                  {errors.languages && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.languages}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    專長領域 *
                  </label>
                  <div className="space-y-2">
                    {['文化導覽', '美食體驗', '自然景觀', '城市觀光', '歷史古蹟', '購物娛樂', '攝影指導'].map((specialty) => (
                      <label key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={(e) => {
                            const newSpecialties = e.target.checked
                              ? [...formData.specialties, specialty]
                              : formData.specialties.filter(s => s !== specialty);
                            handleInputChange('specialties', newSpecialties);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specialties && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.specialties}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  從業經驗年數
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.experienceYears ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="例：3"
                />
                {errors.experienceYears && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.experienceYears}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 按鈕區域 */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
                ${currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              上一步
            </button>

            {currentStep === totalSteps ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    設置中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    完成設置
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                下一步
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 圖片預覽 Modal */}
        {previewImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={closePreview}
          >
            <div 
              className="relative max-w-3xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">圖片預覽</h3>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={previewImage}
                  alt="預覽圖片"
                  className="max-w-full max-h-[70vh] object-contain mx-auto rounded"
                />
              </div>
              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={closePreview}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  關閉預覽
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}