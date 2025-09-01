'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';

interface RegisterFormData {
  userType: 'traveler' | 'guide';
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface RegisterFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    userType: 'traveler',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2個字元';
    }
    
    if (!formData.email) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }
    
    if (!formData.phone) {
      newErrors.phone = '請輸入手機號碼';
    } else if (!/^09\d{8}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = '請輸入有效的台灣手機號碼格式';
    }
    
    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 8) {
      newErrors.password = '密碼必須至少8個字元';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '密碼必須包含大小寫字母和數字';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認密碼';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '密碼確認不符';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '請同意服務條款和隱私政策';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除錯誤當用戶開始輸入
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType: formData.userType === 'traveler' ? 'customer' : formData.userType,
        phone: formData.phone
      });
      
      success('註冊成功', `歡迎加入 Guidee，${formData.name}！`);
      
      // 導向到個人資料完善頁面或首頁
      router.push('/');
      
    } catch (err) {
      error('註冊失敗', '請檢查輸入資料或稍後再試');
    }
  };
  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem'
      }}
    >
      {/* Back to Home Button */}
      <div 
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 10
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}
          className="hover:bg-white hover:shadow-md"
        >
          ← 回到首頁
        </button>
      </div>

      <div 
        style={{
          maxWidth: '28rem',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #f3f4f6',
          padding: '2rem',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div 
            style={{
              margin: '0 auto 1.5rem',
              height: '3rem',
              width: '3rem',
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>G</span>
          </div>
          <h1 
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem',
              lineHeight: '1.2'
            }}
          >
            加入 Guidee
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            開始您的台灣旅遊體驗之旅
          </p>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>已經有帳號？</span>{' '}
            <Link 
              href="/login" 
              style={{ 
                color: '#2563eb', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
              className="hover:text-blue-700"
            >
              立即登入
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 用戶類型選擇 */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.75rem' 
            }}>
              我想要成為
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label style={{ position: 'relative', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="userType"
                  value="traveler"
                  checked={formData.userType === 'traveler'}
                  onChange={handleInputChange}
                  style={{ position: 'absolute', opacity: 0 }}
                />
                <div 
                  style={{
                    border: formData.userType === 'traveler' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: formData.userType === 'traveler' ? '#eff6ff' : 'white',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  className="hover:border-blue-500"
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧳</div>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>旅客</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>尋找在地體驗</div>
                </div>
              </label>
              
              <label style={{ position: 'relative', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="userType"
                  value="guide"
                  checked={formData.userType === 'guide'}
                  onChange={handleInputChange}
                  style={{ position: 'absolute', opacity: 0 }}
                />
                <div 
                  style={{
                    border: formData.userType === 'guide' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    textAlign: 'center',
                    backgroundColor: formData.userType === 'guide' ? '#eff6ff' : 'white',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  className="hover:border-blue-500"
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👨‍🏫</div>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>地陪</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>分享在地知識</div>
                </div>
              </label>
            </div>
          </div>

          {/* 基本資料欄位 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label 
                htmlFor="name" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}
              >
                姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.name ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="請輸入您的真實姓名"
              />
              {errors.name && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.name}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}
              >
                電子郵件
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.email ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="請輸入電子郵件地址"
              />
              {errors.email && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="phone" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}
              >
                手機號碼
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.phone ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="請輸入手機號碼 (例：0912345678)"
              />
              {errors.phone && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.phone}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}
              >
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.password ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="至少 8 個字元，包含大小寫字母和數字"
              />
              {errors.password && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.password}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}
              >
                確認密碼
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="請再次輸入密碼"
              />
              {errors.confirmPassword && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* 條款同意 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                style={{
                  width: '1rem',
                  height: '1rem',
                  accentColor: '#2563eb',
                  cursor: 'pointer',
                  marginTop: '0.125rem'
                }}
              />
              <label 
                htmlFor="agreeTerms" 
                style={{ 
                  fontSize: '0.875rem', 
                  color: '#374151', 
                  lineHeight: '1.4',
                  cursor: 'pointer'
                }}
              >
                我同意{' '}
                <Link 
                  href="/terms" 
                  style={{ color: '#2563eb', textDecoration: 'none' }}
                  className="hover:text-blue-700 hover:underline"
                >
                  服務條款
                </Link>
                {' '}和{' '}
                <Link 
                  href="/privacy" 
                  style={{ color: '#2563eb', textDecoration: 'none' }}
                  className="hover:text-blue-700 hover:underline"
                >
                  隱私政策
                </Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p style={{ marginTop: '0.5rem', marginLeft: '1.75rem', fontSize: '0.875rem', color: '#ef4444' }}>
                {errors.agreeTerms}
              </p>
            )}
          </div>

          {/* 提交按鈕 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              background: isLoading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: isLoading ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            className={isLoading ? '' : 'hover:shadow-lg hover:scale-105'}
          >
            {isLoading ? (
              <>
                <div 
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}
                ></div>
                註冊中...
              </>
            ) : (
              '建立帳號'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}