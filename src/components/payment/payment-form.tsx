'use client';

import { useState } from 'react';
import { CreditCard, Lock, Calendar, User, Building, AlertCircle, Check } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
  isLoading?: boolean;
  className?: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'apple_pay' | 'google_pay' | 'line_pay';
  name: string;
  icon: string;
}

interface CreditCardForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    country: string;
    city: string;
    address: string;
    postalCode: string;
  };
}

const paymentMethods: PaymentMethod[] = [
  { id: 'credit_card', type: 'credit_card', name: '信用卡/金融卡', icon: '💳' },
  { id: 'apple_pay', type: 'apple_pay', name: 'Apple Pay', icon: '🍎' },
  { id: 'google_pay', type: 'google_pay', name: 'Google Pay', icon: '🅖' },
  { id: 'line_pay', type: 'line_pay', name: 'LINE Pay', icon: '💬' }
];

export function PaymentForm({ 
  amount, 
  currency = 'TWD', 
  onPaymentSuccess, 
  onPaymentError, 
  isLoading = false,
  className = ''
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0]!);
  const [cardForm, setCardForm] = useState<CreditCardForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      country: 'TW',
      city: '',
      address: '',
      postalCode: ''
    }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

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

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (selectedMethod.type === 'credit_card') {
      if (!cardForm.cardNumber || cardForm.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = '請輸入有效的卡號';
      }
      
      if (!cardForm.expiryDate || !/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
        newErrors.expiryDate = '請輸入有效的到期日 (MM/YY)';
      }
      
      if (!cardForm.cvv || cardForm.cvv.length < 3) {
        newErrors.cvv = '請輸入有效的安全碼';
      }
      
      if (!cardForm.cardholderName.trim()) {
        newErrors.cardholderName = '請輸入持卡人姓名';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardFormChange = (field: string, value: string) => {
    setCardForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除對應欄位的錯誤
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // 模擬支付處理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模擬支付成功
      const mockTransactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      onPaymentSuccess(mockTransactionId);
    } catch (error) {
      onPaymentError('支付處理失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={className}>
      {/* 付款金額 */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '1.5rem', 
        borderRadius: '0.75rem', 
        marginBottom: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.125rem', fontWeight: '500', color: '#475569' }}>
            應付金額
          </span>
          <span style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>
            {currency} {amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 付款方式選擇 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
          選擇付款方式
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem',
                border: `2px solid ${selectedMethod.id === method.id ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: '0.5rem',
                backgroundColor: selectedMethod.id === method.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                minHeight: '48px',
                touchAction: 'manipulation'
              }}
              className="hover:border-blue-300"
            >
              <span style={{ fontSize: '1.25rem' }}>{method.icon}</span>
              <span>{method.name}</span>
              {selectedMethod.id === method.id && (
                <Check style={{ width: '1rem', height: '1rem', color: '#3b82f6', marginLeft: 'auto' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 信用卡表單 */}
      {selectedMethod.type === 'credit_card' && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
            <CreditCard style={{ width: '1.25rem', height: '1.25rem', display: 'inline', marginRight: '0.5rem' }} />
            信用卡資訊
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 卡號 */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                卡號 *
              </label>
              <input
                type="text"
                value={cardForm.cardNumber}
                onChange={(e) => handleCardFormChange('cardNumber', formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: `1px solid ${errors.cardNumber ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  minHeight: '48px',
                  touchAction: 'manipulation'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {errors.cardNumber && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle style={{ width: '0.875rem', height: '0.875rem' }} />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* 到期日 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  到期日 *
                </label>
                <input
                  type="text"
                  value={cardForm.expiryDate}
                  onChange={(e) => handleCardFormChange('expiryDate', formatExpiryDate(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: `1px solid ${errors.expiryDate ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    minHeight: '48px',
                    touchAction: 'manipulation'
                  }}
                  className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                {errors.expiryDate && (
                  <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              {/* CVV */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  安全碼 *
                </label>
                <input
                  type="text"
                  value={cardForm.cvv}
                  onChange={(e) => handleCardFormChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: `1px solid ${errors.cvv ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    minHeight: '48px',
                    touchAction: 'manipulation'
                  }}
                  className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                {errors.cvv && (
                  <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            {/* 持卡人姓名 */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                持卡人姓名 *
              </label>
              <input
                type="text"
                value={cardForm.cardholderName}
                onChange={(e) => handleCardFormChange('cardholderName', e.target.value)}
                placeholder="如卡片上所示"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: `1px solid ${errors.cardholderName ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  minHeight: '48px',
                  touchAction: 'manipulation'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {errors.cardholderName && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
                  {errors.cardholderName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 其他付款方式 */}
      {selectedMethod.type !== 'credit_card' && (
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{selectedMethod.icon}</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
            {selectedMethod.name}
          </h3>
          <p style={{ color: '#64748b' }}>
            點擊「確認付款」後將跳轉到 {selectedMethod.name} 付款頁面
          </p>
        </div>
      )}

      {/* 安全保證 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        padding: '1rem', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '0.5rem', 
        marginBottom: '2rem',
        border: '1px solid #bbf7d0'
      }}>
        <Lock style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />
        <span style={{ fontSize: '0.875rem', color: '#166534', fontWeight: '500' }}>
          您的付款資訊受到 SSL 加密保護
        </span>
      </div>

      {/* 確認付款按鈕 */}
      <button
        onClick={handlePayment}
        disabled={isLoading || isProcessing}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '1rem 1.5rem',
          backgroundColor: isLoading || isProcessing ? '#9ca3af' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.75rem',
          fontSize: '1.125rem',
          fontWeight: '600',
          cursor: isLoading || isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: isLoading || isProcessing ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          minHeight: '56px',
          touchAction: 'manipulation'
        }}
        className={!isLoading && !isProcessing ? 'hover:bg-blue-700 hover:shadow-lg' : ''}
      >
        {isProcessing ? (
          <>
            <div style={{
              width: '1.25rem',
              height: '1.25rem',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            處理中...
          </>
        ) : (
          <>
            <Lock style={{ width: '1.25rem', height: '1.25rem' }} />
            確認付款 {currency} {amount.toLocaleString()}
          </>
        )}
      </button>
    </div>
  );
}