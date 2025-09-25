'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Key, Mail, Smartphone, Shield, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { HomeButton } from '@/components/layout/page-navigation';
import { Modal, useModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { success, error } = useToast();
  const { isOpen: isPasswordModalOpen, openModal: openPasswordModal, closeModal: closePasswordModal } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/settings/account');
      return;
    }
    
    // 模擬載入
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (err) {
        error('載入失敗', '無法載入帳戶設定');
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, router, error]);

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      error('資料不完整', '請填寫所有密碼欄位');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      error('密碼不符', '新密碼與確認密碼不一致');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      error('密碼太短', '新密碼至少需要8個字元');
      return;
    }

    setIsSaving(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      success('更新成功', '密碼已成功更新');
      closePasswordModal();
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      error('更新失敗', '無法更新密碼，請檢查舊密碼是否正確');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      error('確認失敗', '請輸入 DELETE 來確認刪除帳戶');
      return;
    }

    setIsSaving(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      success('帳戶已刪除', '您的帳戶已成功刪除，感謝您的使用');
      
      // 登出並重導向到首頁
      await logout();
      router.push('/');
    } catch (err) {
      error('刪除失敗', '無法刪除帳戶，請稍後再試');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      // 模擬發送驗證郵件
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('驗證郵件已發送', '請檢查您的信箱並點擊驗證連結');
    } catch (err) {
      error('發送失敗', '無法發送驗證郵件');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">帳戶設定</h1>
          <p className="text-lg text-gray-600">管理您的帳戶安全和登入資訊</p>
        </div>

        <div className="space-y-8">
          {/* 登入資訊 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Mail className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">登入資訊</h2>
                <p className="text-gray-600">管理您的登入方式</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">電子郵件</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    {user?.isEmailVerified ? (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        已驗證
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        待驗證
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!user?.isEmailVerified && (
                    <button
                      onClick={handleEmailVerification}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      重新發送驗證
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600 text-sm">
                    更改郵件
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900">密碼</h3>
                  <p className="text-sm text-gray-500">上次更新：3 個月前</p>
                </div>
                <button
                  onClick={openPasswordModal}
                  className="btn btn-secondary btn-sm"
                >
                  更改密碼
                </button>
              </div>
            </div>
          </div>

          {/* 兩步驟驗證 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Smartphone className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">兩步驟驗證</h2>
                <p className="text-gray-600">提升帳戶安全性</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">簡訊驗證</h3>
                  <p className="text-sm text-gray-500">
                    {user?.profile?.phone ? `已設定 ${user.profile.phone}` : '尚未設定'}
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm">
                  {user?.profile?.phone ? '管理' : '設定'}
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">驗證器應用程式</h3>
                  <p className="text-sm text-gray-500">使用 Google Authenticator 或其他驗證 App</p>
                </div>
                <button className="btn btn-secondary btn-sm">
                  設定
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900">備用驗證碼</h3>
                  <p className="text-sm text-gray-500">當無法使用主要驗證方式時的備用方案</p>
                </div>
                <button className="btn btn-secondary btn-sm">
                  產生備用碼
                </button>
              </div>
            </div>
          </div>

          {/* 活躍的工作階段 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Key className="w-6 h-6 text-purple-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">活躍的工作階段</h2>
                <p className="text-gray-600">管理已登入的裝置</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">目前的工作階段</h3>
                  <p className="text-sm text-gray-500">Chrome on macOS · 台北市 · 現在</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  目前
                </span>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">iPhone</h3>
                  <p className="text-sm text-gray-500">Safari on iOS · 台北市 · 2 小時前</p>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  登出
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-gray-900">Windows PC</h3>
                  <p className="text-sm text-gray-500">Chrome on Windows · 台北市 · 1 天前</p>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  登出
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                登出所有其他工作階段
              </button>
            </div>
          </div>

          {/* 帳戶資料 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-orange-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">帳戶資料</h2>
                <p className="text-gray-600">下載或刪除您的帳戶資料</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">下載資料</h3>
                  <p className="text-sm text-gray-500">下載您所有的個人資料和使用記錄</p>
                </div>
                <button className="btn btn-secondary btn-sm">
                  請求下載
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium text-red-600">刪除帳戶</h3>
                  <p className="text-sm text-gray-500">
                    永久刪除您的帳戶和所有資料。此操作無法復原。
                  </p>
                </div>
                <button
                  onClick={openDeleteModal}
                  className="btn btn-danger btn-sm"
                >
                  刪除帳戶
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 更改密碼 Modal */}
        <Modal
          isOpen={isPasswordModalOpen}
          onClose={closePasswordModal}
          title="更改密碼"
          size="md"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目前密碼 *
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新密碼 *
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="input w-full"
                placeholder="至少 8 個字元"
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                確認新密碼 *
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="input w-full"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closePasswordModal}
                className="btn btn-ghost"
                disabled={isSaving}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={isSaving}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    更新中...
                  </div>
                ) : (
                  '更新密碼'
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* 刪除帳戶 Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="刪除帳戶"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-1">警告：此操作無法復原</h3>
                  <p className="text-sm text-red-700">
                    刪除帳戶將永久移除您的所有資料，包括：
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                    <li>個人資料和偏好設定</li>
                    <li>預訂歷史和評價</li>
                    <li>收藏的地陪和服務</li>
                    <li>聊天記錄和訊息</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                請輸入 <strong>DELETE</strong> 來確認刪除帳戶
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="input w-full"
                placeholder="DELETE"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="btn btn-ghost"
                disabled={isSaving}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isSaving || deleteConfirmText !== 'DELETE'}
                className="btn btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    刪除中...
                  </div>
                ) : (
                  '永久刪除帳戶'
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}