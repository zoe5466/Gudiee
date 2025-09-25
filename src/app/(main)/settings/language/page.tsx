'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { HomeButton } from '@/components/layout/page-navigation';
import { useToast } from '@/components/ui/toast';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
];

export default function LanguageSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('zh-TW');
  const [autoDetect, setAutoDetect] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/settings/language');
      return;
    }
    
    // 模擬載入設定
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        // 這裡應該從 API 載入實際設定
        setIsLoading(false);
      } catch (err) {
        error('載入失敗', '無法載入語言設定');
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, router, error]);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setAutoDetect(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('儲存成功', '語言設定已成功更新');
    } catch (err) {
      error('儲存失敗', '無法更新語言設定');
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
        <HomeButton />
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
      <HomeButton />
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">語言設定</h1>
          <p className="text-lg text-gray-600">選擇您偏好的語言和地區設定</p>
        </div>

        <div className="space-y-8">
          {/* 自動偵測 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">語言偵測</h2>
                <p className="text-gray-600">自動根據您的瀏覽器語言設定顯示內容</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">自動偵測語言</h3>
                <p className="text-sm text-gray-500">
                  根據您的瀏覽器設定自動選擇最適合的語言
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={(e) => setAutoDetect(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* 手動選擇語言 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">選擇語言</h2>
                <p className="text-gray-600">
                  {autoDetect ? '關閉自動偵測來手動選擇語言' : '選擇您偏好的語言'}
                </p>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${autoDetect ? 'opacity-50 pointer-events-none' : ''}`}>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  disabled={autoDetect}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                    selectedLanguage === language.code && !autoDetect
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{language.flag}</span>
                    {selectedLanguage === language.code && !autoDetect && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{language.nativeName}</h3>
                    <p className="text-sm text-gray-500">{language.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 地區設定 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">地區格式</h2>
                <p className="text-gray-600">選擇日期、時間和數字的顯示格式</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* 日期格式 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">日期格式</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateFormat"
                      value="YYYY/MM/DD"
                      defaultChecked
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">2024/12/31</span>
                      <span className="text-sm text-gray-500 ml-2">(YYYY/MM/DD)</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateFormat"
                      value="DD/MM/YYYY"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">31/12/2024</span>
                      <span className="text-sm text-gray-500 ml-2">(DD/MM/YYYY)</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateFormat"
                      value="MM/DD/YYYY"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">12/31/2024</span>
                      <span className="text-sm text-gray-500 ml-2">(MM/DD/YYYY)</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* 時間格式 */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-medium text-gray-900 mb-3">時間格式</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="timeFormat"
                      value="24"
                      defaultChecked
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">14:30</span>
                      <span className="text-sm text-gray-500 ml-2">(24 小時制)</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="timeFormat"
                      value="12"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">2:30 PM</span>
                      <span className="text-sm text-gray-500 ml-2">(12 小時制)</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* 貨幣格式 */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-medium text-gray-900 mb-3">貨幣格式</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currencyFormat"
                      value="TWD"
                      defaultChecked
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">NT$1,200</span>
                      <span className="text-sm text-gray-500 ml-2">(新台幣)</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currencyFormat"
                      value="USD"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">$40</span>
                      <span className="text-sm text-gray-500 ml-2">(美元)</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currencyFormat"
                      value="JPY"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <span className="font-medium">¥5,400</span>
                      <span className="text-sm text-gray-500 ml-2">(日幣)</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 儲存按鈕 */}
        <div className="mt-8 flex justify-end">
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
              '儲存設定'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}