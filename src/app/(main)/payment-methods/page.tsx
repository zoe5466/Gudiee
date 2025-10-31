'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Plus, Trash2, Edit, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { Modal, useModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_account';
  cardNumber: string; // 只顯示後四位
  cardHolder: string;
  expiryDate: string;
  brand: 'visa' | 'mastercard' | 'jcb' | 'amex';
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const { isOpen: isAddModalOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCardForm, setNewCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/payment-methods');
      return;
    }
    
    // 模擬載入付款方式
    const loadPaymentMethods = async () => {
      setIsLoading(true);
      try {
        // 模擬 API 調用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'credit_card',
            cardNumber: '**** **** **** 1234',
            cardHolder: '張小明',
            expiryDate: '12/25',
            brand: 'visa',
            isDefault: true,
            isVerified: true,
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
          },
          {
            id: '2',
            type: 'credit_card',
            cardNumber: '**** **** **** 5678',
            cardHolder: '張小明',
            expiryDate: '08/26',
            brand: 'mastercard',
            isDefault: false,
            isVerified: true,
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
          }
        ];
        
        setPaymentMethods(mockPaymentMethods);
      } catch (err) {
        error('載入失敗', '無法載入付款方式');
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentMethods();
  }, [isAuthenticated, router, error]);

  const handleAddCard = async () => {
    if (!newCardForm.cardNumber || !newCardForm.cardHolder || !newCardForm.expiryMonth || !newCardForm.expiryYear || !newCardForm.cvv) {
      error('資料不完整', '請填寫所有必填欄位');
      return;
    }

    setIsSubmitting(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: 'credit_card',
        cardNumber: `**** **** **** ${newCardForm.cardNumber.slice(-4)}`,
        cardHolder: newCardForm.cardHolder,
        expiryDate: `${newCardForm.expiryMonth}/${newCardForm.expiryYear.slice(-2)}`,
        brand: 'visa', // 這裡應該根據卡號判斷
        isDefault: newCardForm.isDefault || paymentMethods.length === 0,
        isVerified: false,
        createdAt: new Date().toISOString()
      };

      setPaymentMethods(prev => [newCard, ...prev]);
      
      // 如果設為預設卡片，更新其他卡片狀態
      if (newCard.isDefault) {
        setPaymentMethods(prev => prev.map(card => 
          card.id === newCard.id ? card : { ...card, isDefault: false }
        ));
      }

      success('新增成功', '信用卡已成功新增');
      closeAddModal();
      setNewCardForm({
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
      });
    } catch (err) {
      error('新增失敗', '無法新增信用卡，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      setPaymentMethods(prev => prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      })));
      
      success('設定成功', '已更新預設付款方式');
    } catch (err) {
      error('設定失敗', '無法更新預設付款方式');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('確定要刪除這張信用卡嗎？此操作無法復原。')) {
      return;
    }

    try {
      setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
      success('刪除成功', '信用卡已成功刪除');
    } catch (err) {
      error('刪除失敗', '無法刪除信用卡，請稍後再試');
    }
  };

  const getBrandIcon = (brand: string) => {
    const brandStyles = {
      visa: 'bg-blue-600 text-white',
      mastercard: 'bg-red-600 text-white',
      jcb: 'bg-green-600 text-white',
      amex: 'bg-gray-800 text-white'
    };
    
    return (
      <div className={`px-3 py-1 rounded text-sm font-bold ${brandStyles[brand as keyof typeof brandStyles] || brandStyles.visa}`}>
        {brand.toUpperCase()}
      </div>
    );
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)' 
    }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">付款方式</h1>
            <p className="text-lg text-gray-600">管理您的信用卡和付款設定</p>
          </div>
          <button
            onClick={openAddModal}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增卡片
          </button>
        </div>

        {/* 安全提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">安全保護</h3>
              <p className="text-sm text-blue-700">
                您的付款資訊經過加密保護，我們不會儲存完整的信用卡號碼。所有交易都通過安全的第三方支付系統處理。
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loading size="lg" />
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">還沒有付款方式</h3>
            <p className="text-gray-500 mb-6">
              新增信用卡以便快速完成預訂付款
            </p>
            <button
              onClick={openAddModal}
              className="btn btn-primary"
            >
              新增第一張卡片
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {method.cardNumber}
                        </h3>
                        {getBrandIcon(method.brand)}
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            預設
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{method.cardHolder}</span>
                        <span>到期 {method.expiryDate}</span>
                        <div className="flex items-center">
                          {method.isVerified ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              已驗證
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                              待驗證
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        設為預設
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteCard(method.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="刪除卡片"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 新增卡片 Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          title="新增信用卡"
          size="lg"
        >
          <form className="space-y-6">
            {/* 卡號 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                信用卡號 *
              </label>
              <input
                type="text"
                value={formatCardNumber(newCardForm.cardNumber)}
                onChange={(e) => setNewCardForm(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                className="input w-full"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            {/* 持卡人姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                持卡人姓名 *
              </label>
              <input
                type="text"
                value={newCardForm.cardHolder}
                onChange={(e) => setNewCardForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                className="input w-full"
                placeholder="張小明"
                required
              />
            </div>

            {/* 到期日和 CVV */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月份 *
                </label>
                <select
                  value={newCardForm.expiryMonth}
                  onChange={(e) => setNewCardForm(prev => ({ ...prev, expiryMonth: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">月</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, '0');
                    return (
                      <option key={month} value={month}>{month}</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年份 *
                </label>
                <select
                  value={newCardForm.expiryYear}
                  onChange={(e) => setNewCardForm(prev => ({ ...prev, expiryYear: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">年</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>{year}</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={newCardForm.cvv}
                  onChange={(e) => setNewCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                  className="input w-full"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            {/* 設為預設 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={newCardForm.isDefault}
                onChange={(e) => setNewCardForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                設為預設付款方式
              </label>
            </div>

            {/* 操作按鈕 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeAddModal}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddCard}
                disabled={isSubmitting}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    新增中...
                  </div>
                ) : (
                  '新增卡片'
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}