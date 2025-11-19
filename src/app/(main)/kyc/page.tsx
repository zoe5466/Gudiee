'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';
import { ImageUpload } from '@/components/ui/image-upload';

interface KYCFormData {
  idNumber: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  idFrontImage: string;
  idBackImage: string;
  selfieImage: string;
  criminalRecordCheck: string; // 良民證
}

interface KYCFormErrors {
  idNumber?: string;
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  idFrontImage?: string;
  idBackImage?: string;
  selfieImage?: string;
  criminalRecordCheck?: string;
}

type KYCStep = 1 | 2 | 3 | 4;

export default function KYCPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error } = useToast();
  
  const [currentStep, setCurrentStep] = useState<KYCStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<KYCFormData>({
    idNumber: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    idFrontImage: '',
    idBackImage: '',
    selfieImage: '',
    criminalRecordCheck: ''
  });
  
  const [errors, setErrors] = useState<KYCFormErrors>({});

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Redirect if already verified
    if (user?.isKYCVerified) {
      router.push('/profile');
      return;
    }
  }, [isAuthenticated, authLoading, user, router]);

  const validateStep1 = (): boolean => {
    const newErrors: KYCFormErrors = {};
    
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = '請輸入身分證字號';
    } else if (!/^[A-Z][1-2]\d{8}$/.test(formData.idNumber.toUpperCase())) {
      newErrors.idNumber = '請輸入有效的身分證字號格式';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = '請選擇出生日期';
    } else {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear < 18) {
        newErrors.birthDate = '必須年滿18歲';
      }
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '請輸入聯絡地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: KYCFormErrors = {};
    
    if (!formData.idFrontImage) {
      newErrors.idFrontImage = '請上傳身分證正面照片';
    }
    
    if (!formData.idBackImage) {
      newErrors.idBackImage = '請上傳身分證背面照片';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: KYCFormErrors = {};
    
    if (!formData.selfieImage) {
      newErrors.selfieImage = '請上傳手持身分證的自拍照';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: KYCFormErrors = {};
    
    // 只有導遊需要上傳良民證
    if (user?.role === 'guide') {
      if (!formData.criminalRecordCheck) {
        newErrors.criminalRecordCheck = '請上傳良民證（警察刑事紀錄證明書）';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = () => {
    let isValid = false;
    const maxStep = user?.role === 'guide' ? 4 : 3;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
    }
    
    if (isValid && currentStep < maxStep) {
      setCurrentStep((prev) => (prev + 1) as KYCStep);
    } else if (isValid && currentStep === maxStep) {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as KYCStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual KYC submission API
      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('提交失敗');
      }

      success('提交成功', '您的KYC申請已提交，我們將在24-48小時內完成審核');
      router.push('/profile');
      
    } catch (err) {
      error('提交失敗', '無法提交KYC申請，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  const stepTitles = {
    1: '個人基本資料',
    2: '身分證明文件',
    3: '本人驗證照片',
    4: '良民證上傳（導遊專用）'
  };

  const getProgressWidth = () => {
    const maxStep = user?.role === 'guide' ? 4 : 3;
    return `${(currentStep / maxStep) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-[#cfdbe9] py-12">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002C56] to-[#001f3f] px-6 py-8">
            <h1 className="text-3xl font-bold text-white">身分驗證 (KYC)</h1>
            <p className="text-red-100 mt-2">
              為了確保平台安全，請完成身分驗證程序
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">驗證進度</span>
              <span className="text-sm text-gray-500">第 {currentStep} 步，共 {user?.role === 'guide' ? 4 : 3} 步</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#002C56] h-2 rounded-full transition-all duration-300"
                style={{ width: getProgressWidth() }}
              ></div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                第{currentStep}步：{stepTitles[currentStep]}
              </h2>
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                        身分證字號 *
                      </label>
                      <input
                        type="text"
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={(e) => handleInputChange('idNumber', e.target.value.toUpperCase())}
                        className={`input mt-1 w-full ${errors.idNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="例：A123456789"
                        maxLength={10}
                      />
                      {errors.idNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                        出生日期 *
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className={`input mt-1 w-full ${errors.birthDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      />
                      {errors.birthDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        聯絡地址 *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`input mt-1 w-full ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="請輸入詳細地址（包含郵遞區號）"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                        緊急聯絡人
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="input mt-1 w-full"
                        placeholder="姓名 + 電話 (選填)"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        身分證正面 *
                      </label>
                      <ImageUpload
                        value={formData.idFrontImage}
                        onChange={(url) => handleInputChange('idFrontImage', url as string)}
                        accept="image/jpeg,image/png"
                        maxSize={5} // 5MB
                        className="h-48"
                      />
                      {errors.idFrontImage && (
                        <p className="mt-1 text-sm text-red-600">{errors.idFrontImage}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        身分證背面 *
                      </label>
                      <ImageUpload
                        value={formData.idBackImage}
                        onChange={(url) => handleInputChange('idBackImage', url as string)}
                        accept="image/jpeg,image/png"
                        maxSize={5} // 5MB
                        className="h-48"
                      />
                      {errors.idBackImage && (
                        <p className="mt-1 text-sm text-red-600">{errors.idBackImage}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          注意事項
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>請確保照片清晰，文字可清楚讀取</li>
                            <li>照片中不得有反光或陰影遮擋</li>
                            <li>支援格式：JPG、PNG，檔案大小不超過5MB</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Selfie Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                      手持身分證的自拍照 *
                    </label>
                    <ImageUpload
                      value={formData.selfieImage}
                      onChange={(url) => handleInputChange('selfieImage', url as string)}
                      accept="image/jpeg,image/png"
                      maxSize={5} // 5MB
                      className="h-64"
                    />
                    {errors.selfieImage && (
                      <p className="mt-1 text-sm text-red-600 text-center">{errors.selfieImage}</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          拍照指引
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>請手持身分證於胸前，確保身分證資訊清楚可見</li>
                            <li>請確保您的臉部完整入鏡，表情自然</li>
                            <li>光線充足，背景簡潔，避免反光或陰影</li>
                            <li>請勿戴帽子、口罩或太陽眼鏡</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Criminal Record Check (Guide Only) */}
              {currentStep === 4 && user?.role === 'guide' && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                          導遊專用 - 良民證上傳
                        </h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            為確保旅客安全，所有導遊必須提供有效的警察刑事紀錄證明書（良民證）。
                            此為政府規定之必要文件，用於驗證導遊身分的合法性與安全性。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      警察刑事紀錄證明書（良民證）*
                    </label>
                    <ImageUpload
                      value={formData.criminalRecordCheck}
                      onChange={(url) => handleInputChange('criminalRecordCheck', url as string)}
                      accept="image/jpeg,image/png,application/pdf"
                      maxSize={10} // 10MB for documents
                      className="h-64"
                      label="點擊上傳或拖拽檔案至此"
                      description="支援 JPG、PNG、PDF 格式，檔案大小不超過 10MB"
                    />
                    {errors.criminalRecordCheck && (
                      <p className="mt-1 text-sm text-red-600 text-center">{errors.criminalRecordCheck}</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          良民證申請指引
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>可至各地警察局、戶政事務所或線上申請</li>
                            <li>申請時請備妥身分證正本及印章</li>
                            <li>申請費用約新台幣100元</li>
                            <li>有效期限為申請日起3個月內</li>
                            <li>請確保文件內容清晰可見，無遮擋或模糊</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Notice - Show on all steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      隱私保護承諾
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        您的個人資料將採用 SSL 加密傳輸，並嚴格遵循個人資料保護法規。
                        我們不會將您的資料用於身分驗證以外的用途。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-ghost btn-md"
                    >
                      上一步
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/profile')}
                    className="btn btn-ghost btn-md"
                  >
                    稍後完成
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        提交中...
                      </div>
                    ) : (currentStep === 3 && user?.role !== 'guide') || (currentStep === 4 && user?.role === 'guide') ? '提交驗證' : '下一步'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}