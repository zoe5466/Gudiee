'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, Globe, Users } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { HomeButton } from '@/components/layout/page-navigation';
import { useToast } from '@/components/ui/toast';

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessages: 'everyone' | 'verified' | 'none';
  shareDataWithPartners: boolean;
  allowMarketing: boolean;
  showOnlineStatus: boolean;
  shareBookingHistory: boolean;
}

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: 'verified',
    shareDataWithPartners: false,
    allowMarketing: false,
    showOnlineStatus: true,
    shareBookingHistory: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/settings/privacy');
      return;
    }
    
    // 模擬載入設定
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        // 這裡應該從 API 載入實際設定
        setIsLoading(false);
      } catch (err) {
        error('載入失敗', '無法載入隱私設定');
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, router, error]);

  const handleSettingChange = <K extends keyof PrivacySettings>(
    setting: K, 
    value: PrivacySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('儲存成功', '隱私設定已成功更新');
    } catch (err) {
      error('儲存失敗', '無法更新隱私設定');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隱私設定</h1>
          <p className="text-lg text-gray-600">控制您的個人資料可見性和隱私偏好</p>
        </div>

        <div className="space-y-8">
          {/* 個人資料可見性 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">個人資料可見性</h2>
                <p className="text-gray-600">控制誰可以查看您的個人資料</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">個人資料可見範圍</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="public"
                      checked={settings.profileVisibility === 'public'}
                      onChange={(e) => handleSettingChange('profileVisibility', e.target.value as 'public')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <div className="font-medium text-gray-900">公開</div>
                      <div className="text-sm text-gray-500">所有人都可以查看您的個人資料</div>
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="private"
                      checked={settings.profileVisibility === 'private'}
                      onChange={(e) => handleSettingChange('profileVisibility', e.target.value as 'private')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">
                      <div className="font-medium text-gray-900">私人</div>
                      <div className="text-sm text-gray-500">只有您自己可以查看完整資料</div>
                    </span>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium text-gray-900 mb-4">顯示的資訊</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">電子郵件</h4>
                      <p className="text-sm text-gray-500">在個人資料中顯示電子郵件</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showEmail}
                        onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">手機號碼</h4>
                      <p className="text-sm text-gray-500">在個人資料中顯示手機號碼</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showPhone}
                        onChange={(e) => handleSettingChange('showPhone', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">所在地區</h4>
                      <p className="text-sm text-gray-500">在個人資料中顯示地區資訊</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showLocation}
                        onChange={(e) => handleSettingChange('showLocation', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">線上狀態</h4>
                      <p className="text-sm text-gray-500">顯示您目前是否在線上</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showOnlineStatus}
                        onChange={(e) => handleSettingChange('showOnlineStatus', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 聯絡方式 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">聯絡方式</h2>
                <p className="text-gray-600">控制誰可以與您聯絡</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">允許接收訊息的對象</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allowMessages"
                    value="everyone"
                    checked={settings.allowMessages === 'everyone'}
                    onChange={(e) => handleSettingChange('allowMessages', e.target.value as 'everyone')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">
                    <div className="font-medium text-gray-900">所有人</div>
                    <div className="text-sm text-gray-500">任何人都可以傳送訊息給您</div>
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allowMessages"
                    value="verified"
                    checked={settings.allowMessages === 'verified'}
                    onChange={(e) => handleSettingChange('allowMessages', e.target.value as 'verified')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">
                    <div className="font-medium text-gray-900">已驗證用戶</div>
                    <div className="text-sm text-gray-500">只有通過驗證的用戶可以聯絡您</div>
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allowMessages"
                    value="none"
                    checked={settings.allowMessages === 'none'}
                    onChange={(e) => handleSettingChange('allowMessages', e.target.value as 'none')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">
                    <div className="font-medium text-gray-900">關閉</div>
                    <div className="text-sm text-gray-500">不接受任何訊息</div>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 資料使用 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-purple-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">資料使用</h2>
                <p className="text-gray-600">控制您的資料如何被使用</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">與合作夥伴分享資料</h3>
                  <p className="text-sm text-gray-500">允許我們與可信賴的合作夥伴分享匿名統計資料</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.shareDataWithPartners}
                    onChange={(e) => handleSettingChange('shareDataWithPartners', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">個人化行銷</h3>
                  <p className="text-sm text-gray-500">根據您的使用行為提供個人化推薦和廣告</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowMarketing}
                    onChange={(e) => handleSettingChange('allowMarketing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">分享預訂歷史</h3>
                  <p className="text-sm text-gray-500">在公開個人資料中顯示部分預訂歷史</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.shareBookingHistory}
                    onChange={(e) => handleSettingChange('shareBookingHistory', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 資料下載和刪除 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">資料控制</h2>
                <p className="text-gray-600">管理您的個人資料</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">下載您的資料</h3>
                <p className="text-sm text-gray-500 mb-4">下載所有與您帳戶相關的資料副本</p>
                <button className="btn btn-secondary">
                  請求資料下載
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium text-red-600 mb-2">刪除帳戶</h3>
                <p className="text-sm text-gray-500 mb-4">
                  永久刪除您的帳戶和所有相關資料。此操作無法復原。
                </p>
                <button className="btn btn-danger">
                  刪除我的帳戶
                </button>
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