'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Shield, 
  Receipt, 
  Download,
  Star,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { Modal, useModal } from '@/components/ui/modal';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal' | 'bank';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName: string;
}

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  date: string;
  paymentMethod?: string;
}

export default function PaymentSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const { isOpen: isAddCardOpen, openModal: openAddCard, closeModal: closeAddCard } = useModal();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [newCard, setNewCard] = useState({
    number: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'card-1',
      type: 'credit',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
      holderName: '王小美'
    },
    {
      id: 'card-2',
      type: 'credit',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      holderName: '王小美'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn-1',
      type: 'payment',
      amount: 2800,
      currency: 'TWD',
      status: 'completed',
      description: '台北101 & 信義商圈深度導覽',
      date: '2024-01-15T14:30:00Z',
      paymentMethod: 'Visa •••• 4242'
    },
    {
      id: 'txn-2',
      type: 'payout',
      amount: 3500,
      currency: 'TWD',
      status: 'completed',
      description: '導遊服務收入',
      date: '2024-01-10T09:15:00Z'
    },
    {
      id: 'txn-3',
      type: 'payment',
      amount: 1800,
      currency: 'TWD',
      status: 'pending',
      description: '夜市美食文化體驗',
      date: '2024-01-08T16:45:00Z',
      paymentMethod: 'Mastercard •••• 5555'
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/settings/payment');
      return;
    }
    
    // 模擬載入付款資料
    const loadPaymentData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (err) {
        error('載入失敗', '無法載入付款設定');
        setIsLoading(false);
      }
    };

    loadPaymentData();
  }, [isAuthenticated, router, error]);

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const setDefaultPaymentMethod = async (cardId: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === cardId
      })));
      
      success('設定成功', '預設付款方式已更新');
    } catch (err) {
      error('設定失敗', '無法更新預設付款方式');
    } finally {
      setIsSaving(false);
    }
  };

  const removePaymentMethod = async (cardId: string) => {
    if (paymentMethods.find(m => m.id === cardId)?.isDefault) {
      error('無法刪除', '無法刪除預設付款方式');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(prev => prev.filter(method => method.id !== cardId));
      
      success('刪除成功', '付款方式已移除');
    } catch (err) {
      error('刪除失敗', '無法移除付款方式');
    } finally {
      setIsSaving(false);
    }
  };

  const addPaymentMethod = async () => {
    if (!newCard.number || !newCard.holderName || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      error('資料不完整', '請填寫所有卡片資訊');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPaymentMethod: PaymentMethod = {
        id: `card-${Date.now()}`,
        type: 'credit',
        last4: newCard.number.slice(-4),
        brand: newCard.number.startsWith('4') ? 'Visa' : 'Mastercard',
        expiryMonth: parseInt(newCard.expiryMonth),
        expiryYear: parseInt(newCard.expiryYear),
        isDefault: newCard.isDefault,
        holderName: newCard.holderName
      };

      setPaymentMethods(prev => {
        if (newCard.isDefault) {
          return [newPaymentMethod, ...prev.map(m => ({ ...m, isDefault: false }))];
        }
        return [...prev, newPaymentMethod];
      });
      
      setNewCard({
        number: '',
        holderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
      });
      
      closeAddCard();
      success('新增成功', '付款方式已新增');
    } catch (err) {
      error('新增失敗', '無法新增付款方式');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadInvoice = (transactionId: string) => {
    // 模擬下載發票
    success('下載中', '發票正在準備下載...');
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency === 'TWD' ? 'TWD' : 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCardIcon = (brand: string) => {
    return <CreditCard className="w-6 h-6" />;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-5 h-5 text-red-500" />;
      case 'payout':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'refund':
        return <Receipt className="w-5 h-5 text-blue-500" />;
      default:
        return <Receipt className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'pending':
        return '處理中';
      case 'failed':
        return '失敗';
      default:
        return '未知';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">付款設定</h1>
          <p className="text-lg text-gray-600">管理您的付款方式和帳單資訊</p>
        </div>

        <div className="space-y-8">
          {/* 付款方式 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">付款方式</h2>
                  <p className="text-gray-600">管理您的信用卡和其他付款方式</p>
                </div>
              </div>
              <button
                onClick={openAddCard}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                新增卡片
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-lg ${
                    method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        {getCardIcon(method.brand)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {method.brand} •••• {showCardNumbers[method.id] ? '4242 4242 4242 ' : ''}
                            {method.last4}
                          </span>
                          <button
                            onClick={() => toggleCardVisibility(method.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showCardNumbers[method.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {method.holderName} • 到期 {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </p>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            預設付款方式
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          disabled={isSaving}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          設為預設
                        </button>
                      )}
                      <button
                        onClick={() => removePaymentMethod(method.id)}
                        disabled={isSaving || method.isDefault}
                        className={`text-sm font-medium ${
                          method.isDefault 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-red-600 hover:text-red-800'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 帳單與交易記錄 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Receipt className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">交易記錄</h2>
                <p className="text-gray-600">查看您的付款和收入記錄</p>
              </div>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(transaction.date)}</span>
                        {transaction.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'payout' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'payout' ? '+' : '-'}
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                    <button
                      onClick={() => downloadInvoice(transaction.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                查看完整交易記錄
              </button>
            </div>
          </div>

          {/* 安全提醒 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">安全提醒</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 我們使用業界標準的 SSL 加密保護您的付款資訊</li>
                  <li>• 卡片資訊經過加密存儲，符合 PCI DSS 安全標準</li>
                  <li>• 我們不會儲存您的 CVV 安全碼</li>
                  <li>• 如有任何可疑活動，我們會立即通知您</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 新增卡片 Modal */}
        <Modal
          isOpen={isAddCardOpen}
          onClose={closeAddCard}
          title="新增付款方式"
          size="md"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                卡片號碼 *
              </label>
              <input
                type="text"
                value={newCard.number}
                onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                className="input w-full"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                持卡人姓名 *
              </label>
              <input
                type="text"
                value={newCard.holderName}
                onChange={(e) => setNewCard(prev => ({ ...prev, holderName: e.target.value }))}
                className="input w-full"
                placeholder="如卡片上所示"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月份 *
                </label>
                <select
                  value={newCard.expiryMonth}
                  onChange={(e) => setNewCard(prev => ({ ...prev, expiryMonth: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">月</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {(i + 1).toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年份 *
                </label>
                <select
                  value={newCard.expiryYear}
                  onChange={(e) => setNewCard(prev => ({ ...prev, expiryYear: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">年</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
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
                  value={newCard.cvv}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                  className="input w-full"
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="setDefault"
                checked={newCard.isDefault}
                onChange={(e) => setNewCard(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700">
                設為預設付款方式
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={closeAddCard}
                className="btn btn-ghost"
                disabled={isSaving}
              >
                取消
              </button>
              <button
                type="button"
                onClick={addPaymentMethod}
                disabled={isSaving}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
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