'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, Send, User, HelpCircle, FileText, Headphones } from 'lucide-react';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });

  const categories = [
    { id: 'general', label: '一般詢問', icon: HelpCircle },
    { id: 'account', label: '帳號問題', icon: User },
    { id: 'booking', label: '預訂相關', icon: FileText },
    { id: 'technical', label: '技術支援', icon: Headphones }
  ];

  const faqItems = [
    {
      question: '如何成為認證地陪？',
      answer: '完成身分驗證和良民證上傳，通過審核後即可開始提供服務。'
    },
    {
      question: '如何修改訂單？',
      answer: '在訂單確認前，您可以直接聯繫地陪修改詳細內容。'
    },
    {
      question: '退款政策為何？',
      answer: '根據取消時間不同，退款比例會有所差異。詳細請參考服務條款。'
    },
    {
      question: '如何聯繫地陪？',
      answer: '預訂成功後，系統會提供地陪聯繫方式，您也可以透過平台訊息功能溝通。'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 實際提交邏輯
    alert('您的訊息已送出，我們會盡快回覆！');
    setFormData({
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#cfdbe9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">客戶支援中心</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我們提供全天候支援服務，隨時為您解決問題
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">聯繫方式</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">即時客服</p>
                    <p className="text-sm text-gray-600">平均回應時間 5 分鐘</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">電話客服</p>
                    <p className="text-sm text-gray-600">02-1234-5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">電子郵件</p>
                    <p className="text-sm text-gray-600">support@guidee.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">服務時間</p>
                    <p className="text-sm text-gray-600">24小時全年無休</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">常見問題</h2>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">發送訊息</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="請輸入您的姓名"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      電子郵件
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="請輸入您的電子郵件"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    問題類別
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setFormData(prev => ({ ...prev, category: category.id }));
                          }}
                          className={`p-3 border rounded-lg text-sm transition-colors ${
                            selectedCategory === category.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1" />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    問題標題
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="簡短描述您的問題"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    詳細描述
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="請詳細描述您遇到的問題，我們會盡快為您解決..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>發送訊息</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}