'use client';

import React, { useState } from 'react';
import { X, Calendar, Users, Clock, MapPin, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/store/auth';

interface ServiceData {
  id: string;
  title: string;
  price: number;
  duration: number;
  maxGuests: number;
  location: string;
  guide: {
    id: string;
    name: string;
    avatar?: string;
  };
  availability: {
    availableDates: string[];
  };
}

interface BookingModalProps {
  service: ServiceData;
  onClose: () => void;
}

export default function BookingModal({ service, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: 日期選擇, 2: 詳細資料, 3: 付款, 4: 確認
  const [error, setError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const totalPrice = service.price * numberOfGuests;
  const serviceFee = Math.round(totalPrice * 0.05); // 5% 服務費
  const finalTotal = totalPrice + serviceFee;

  const handleSubmit = async () => {
    if (!user) {
      setError('請先登入才能預訂服務');
      return;
    }

    if (!selectedDate || !contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      setError('請填寫所有必要資訊');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          date: selectedDate,
          startTime: '09:00',
          participants: numberOfGuests,
          customer: {
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone
          },
          specialRequests: specialRequests || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('預訂失敗');
      }

      const result = await response.json();
      if (result.success) {
        const order = result.data;
        
        // 如果是信用卡支付，進行支付處理
        if (paymentMethod === 'credit_card') {
          setIsProcessingPayment(true);
          
          try {
            const paymentResponse = await fetch(`/api/orders/${order.id}/payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paymentMethod: 'CREDIT_CARD',
                paymentToken: 'mock_token_' + Date.now() // 模擬支付令牌
              }),
            });

            const paymentResult = await paymentResponse.json();
            
            if (paymentResult.success) {
              alert(`預訂和支付成功！\n訂單編號：${order.orderNumber}\n交易編號：${paymentResult.data.payment.transactionId}\n\n我們將盡快與您聯繫確認詳細資訊。`);
              onClose();
            } else {
              setError(`支付失敗：${paymentResult.error || '請稍後重試'}`);
              setIsProcessingPayment(false);
              // 不關閉對話框，讓用戶重試
            }
          } catch (paymentError) {
            console.error('Payment error:', paymentError);
            setError('支付處理失敗，請檢查網路連接後重試');
            setIsProcessingPayment(false);
          }
        } else {
          alert(`預訂成功！\n訂單編號：${order.orderNumber}\n\n我們將盡快與您聯繫確認詳細資訊。`);
          onClose();
        }
      } else {
        throw new Error(result.error || '預訂失敗');
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : '預訂失敗，請稍後再試';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">選擇日期和人數</h3>
            
            {/* 日期選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-1" />
                選擇日期
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {service.availability.availableDates.slice(0, 10).map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 text-left border rounded-lg transition-colors touch-manipulation ${
                      selectedDate === date
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    style={{minHeight: '44px'}}
                  >
                    <div className="text-sm">
                      {new Date(date).toLocaleDateString('zh-TW', { 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 人數選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 inline mr-1" />
                參加人數
              </label>
              <select
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                style={{minHeight: '44px'}}
              >
                {Array.from({ length: service.maxGuests }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? '人' : '人'}
                  </option>
                ))}
              </select>
            </div>

            {/* 價格預覽 */}
            {selectedDate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>{formatDate(selectedDate)}</span>
                  <span>{numberOfGuests} 人</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold mt-2">
                  <span>總計</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">聯絡資訊</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                  style={{minHeight: '44px'}}
                  placeholder="請輸入您的姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電子信箱 *
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                  style={{minHeight: '44px'}}
                  placeholder="請輸入您的電子信箱"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手機號碼 *
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                style={{minHeight: '44px'}}
                placeholder="請輸入您的手機號碼"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                特殊需求（選填）
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                style={{minHeight: '80px'}}
                placeholder="請說明任何特殊需求或備註..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">付款方式</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 touch-manipulation" style={{minHeight: '60px'}}>
                <input
                  type="radio"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="flex-1">信用卡付款</span>
                <span className="text-sm text-green-600">推薦</span>
              </label>

              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 touch-manipulation" style={{minHeight: '60px'}}>
                <input
                  type="radio"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="w-5 h-5 bg-gray-400 rounded flex items-center justify-center text-white text-xs">
                  銀
                </div>
                <span className="flex-1">銀行轉帳</span>
              </label>

              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 touch-manipulation" style={{minHeight: '60px'}}>
                <input
                  type="radio"
                  value="line_pay"
                  checked={paymentMethod === 'line_pay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                  L
                </div>
                <span className="flex-1">LINE Pay</span>
              </label>
            </div>

            {/* 費用明細 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">費用明細</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{service.title} × {numberOfGuests}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>服務費</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>總計</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">預訂確認</h3>
              <p className="text-gray-600">
                請確認以下預訂資訊無誤後，點擊確認預訂
              </p>
            </div>

            {/* 預訂摘要 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {service.guide.avatar ? (
                    <img
                      src={service.guide.avatar}
                      alt={service.guide.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold">
                      {service.guide.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{service.title}</h4>
                  <p className="text-sm text-gray-600">嚮導: {service.guide.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">日期</div>
                  <div className="font-medium">{formatDate(selectedDate)}</div>
                </div>
                <div>
                  <div className="text-gray-600">人數</div>
                  <div className="font-medium">{numberOfGuests} 人</div>
                </div>
                <div>
                  <div className="text-gray-600">時長</div>
                  <div className="font-medium">{service.duration} 小時</div>
                </div>
                <div>
                  <div className="text-gray-600">地點</div>
                  <div className="font-medium">{service.location}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-semibold">
                  <span>總金額</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">聯絡資訊</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>姓名: {contactInfo.name}</div>
                <div>信箱: {contactInfo.email}</div>
                <div>電話: {contactInfo.phone}</div>
              </div>
            </div>

            {/* 重要提醒 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">預訂須知</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>預訂確認後，嚮導將在24小時內與您聯繫</li>
                    <li>請確保提供的聯絡方式正確無誤</li>
                    <li>取消政策將在確認後提供給您</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return selectedDate && numberOfGuests > 0;
      case 2:
        return contactInfo.name && contactInfo.email && contactInfo.phone;
      case 3:
        return paymentMethod;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto touch-manipulation">
      <div className="flex items-center justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-6">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative z-10 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 4 ? '確認預訂' : '預訂服務'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 -m-1 touch-manipulation"
              style={{minWidth: '44px', minHeight: '44px'}}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`flex items-center space-x-2 ${
                    step >= stepNumber ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}>
                      {stepNumber}
                    </div>
                    <span className="text-sm hidden sm:inline">
                      {stepNumber === 1 && '選擇'}
                      {stepNumber === 2 && '資訊'}
                      {stepNumber === 3 && '付款'}
                      {stepNumber === 4 && '確認'}
                    </span>
                  </div>
                  {stepNumber < 4 && (
                    <div className={`flex-1 h-px ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
            {/* 錯誤提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* 支付處理狀態 */}
            {isProcessingPayment && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-blue-800">正在處理支付，請稍候...</p>
                </div>
              </div>
            )}

            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              style={{minHeight: '44px'}}
            >
              {step === 1 ? '取消' : '上一步'}
            </button>

            <button
              onClick={() => {
                if (step < 4) {
                  setError(''); // 清除錯誤
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={!canProceedToNextStep() || isSubmitting || isProcessingPayment}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
              style={{minHeight: '44px'}}
            >
              {isProcessingPayment 
                ? '處理支付中...' 
                : isSubmitting 
                  ? '處理中...' 
                  : step === 4 
                    ? '確認預訂' 
                    : '下一步'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}