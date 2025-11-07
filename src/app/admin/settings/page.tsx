'use client';

import { useState } from 'react';
import { Save, Bell, Shield, Database, Mail, Globe, Users, FileText, AlertCircle, CheckCircle, Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Guidee',
      siteDescription: '專業地陪媒合平台',
      maintenanceMode: false,
      allowRegistration: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      adminAlerts: true
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5
    },
    kyc: {
      autoApproval: false,
      requireCriminalRecord: true,
      reviewTimeLimit: 72,
      requireManualReview: true
    }
  });

  const tabs = [
    { id: 'general', label: '一般設定', icon: SettingsIcon },
    { id: 'notifications', label: '通知設定', icon: Bell },
    { id: 'security', label: '安全設定', icon: Shield },
    { id: 'kyc', label: 'KYC 設定', icon: Users },
    { id: 'database', label: '資料庫', icon: Database },
    { id: 'email', label: '郵件設定', icon: Mail }
  ];

  const handleSave = () => {
    alert('設定已儲存');
  };

  const handleReset = () => {
    if (confirm('確定要重置所有設定嗎？')) {
      // Reset to default values
      setSettings({
        general: {
          siteName: 'Guidee',
          siteDescription: '專業地陪媒合平台',
          maintenanceMode: false,
          allowRegistration: true
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          adminAlerts: true
        },
        security: {
          requireEmailVerification: true,
          enableTwoFactorAuth: false,
          sessionTimeout: 30,
          maxLoginAttempts: 5
        },
        kyc: {
          autoApproval: false,
          requireCriminalRecord: true,
          reviewTimeLimit: 72,
          requireManualReview: true
        }
      });
    }
  };

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          網站名稱
        </label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          網站描述
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">維護模式</label>
            <p className="text-xs text-gray-500">啟用後一般用戶無法存取網站</p>
          </div>
          <input
            type="checkbox"
            checked={settings.general.maintenanceMode}
            onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">允許新用戶註冊</label>
            <p className="text-xs text-gray-500">關閉後新用戶無法註冊</p>
          </div>
          <input
            type="checkbox"
            checked={settings.general.allowRegistration}
            onChange={(e) => updateSetting('general', 'allowRegistration', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">電子郵件通知</label>
            <p className="text-xs text-gray-500">系統自動發送的郵件通知</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">推播通知</label>
            <p className="text-xs text-gray-500">網頁和手機 App 推播</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.pushNotifications}
            onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">簡訊通知</label>
            <p className="text-xs text-gray-500">重要事件的簡訊通知</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">管理員警報</label>
            <p className="text-xs text-gray-500">系統錯誤和重要事件通知</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.adminAlerts}
            onChange={(e) => updateSetting('notifications', 'adminAlerts', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">需要電子郵件驗證</label>
            <p className="text-xs text-gray-500">新用戶必須驗證電子郵件</p>
          </div>
          <input
            type="checkbox"
            checked={settings.security.requireEmailVerification}
            onChange={(e) => updateSetting('security', 'requireEmailVerification', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">啟用雙因子認證</label>
            <p className="text-xs text-gray-500">管理員帳號額外安全保護</p>
          </div>
          <input
            type="checkbox"
            checked={settings.security.enableTwoFactorAuth}
            onChange={(e) => updateSetting('security', 'enableTwoFactorAuth', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          登入逾時時間 (分鐘)
        </label>
        <input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
          min="5"
          max="480"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          最大登入嘗試次數
        </label>
        <input
          type="number"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
          min="3"
          max="20"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderKYCSettings = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">自動審核通過</label>
            <p className="text-xs text-gray-500">符合條件的申請自動通過</p>
          </div>
          <input
            type="checkbox"
            checked={settings.kyc.autoApproval}
            onChange={(e) => updateSetting('kyc', 'autoApproval', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">強制良民證上傳</label>
            <p className="text-xs text-gray-500">地陪申請時必須上傳良民證</p>
          </div>
          <input
            type="checkbox"
            checked={settings.kyc.requireCriminalRecord}
            onChange={(e) => updateSetting('kyc', 'requireCriminalRecord', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">強制人工審核</label>
            <p className="text-xs text-gray-500">所有申請都需要人工審核</p>
          </div>
          <input
            type="checkbox"
            checked={settings.kyc.requireManualReview}
            onChange={(e) => updateSetting('kyc', 'requireManualReview', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          審核時限 (小時)
        </label>
        <input
          type="number"
          value={settings.kyc.reviewTimeLimit}
          onChange={(e) => updateSetting('kyc', 'reviewTimeLimit', parseInt(e.target.value))}
          min="24"
          max="168"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">超過時限將自動提醒管理員</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'kyc':
        return renderKYCSettings();
      case 'database':
        return (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">資料庫設定功能開發中</p>
          </div>
        );
      case 'email':
        return (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">郵件設定功能開發中</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">系統設定</h1>
          <p className="mt-2 text-gray-600">管理平台的各項設定和配置</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      重置
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      儲存設定
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  設定變更將在儲存後立即生效。請確保您有適當的權限進行這些變更。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}