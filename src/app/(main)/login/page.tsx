'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const isLoading = authLoading;

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    
    if (!formData.email) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }
    
    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 6) {
      newErrors.password = '密碼必須至少6個字元';
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
    if (errors[name as keyof LoginFormErrors]) {
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
      await login(formData.email, formData.password);
      success('登入成功', '歡迎回來！');
      
      // 導向到首頁或用戶指定的頁面
      router.push('/');
      
    } catch (err) {
      error('登入失敗', '電子郵件或密碼錯誤，請重新嘗試');
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
          maxWidth: '26rem',
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
            歡迎回來
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            登入您的 Guidee 帳號
          </p>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>還沒有帳號？</span>{' '}
            <Link 
              href="/register" 
              style={{ 
                color: '#2563eb', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
              className="hover:text-blue-700"
            >
              立即註冊
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 表單欄位 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                placeholder="輸入您的電子郵件地址"
              />
              {errors.email && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.email}</p>
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
                autoComplete="current-password"
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
                placeholder="輸入您的密碼"
              />
              {errors.password && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.password}</p>
              )}
            </div>
          </div>

          {/* 記住我和忘記密碼 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                style={{
                  width: '1rem',
                  height: '1rem',
                  accentColor: '#2563eb',
                  cursor: 'pointer'
                }}
              />
              <label 
                htmlFor="rememberMe" 
                style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
              >
                記住我
              </label>
            </div>

            <Link 
              href="/forgot-password" 
              style={{ 
                fontSize: '0.875rem', 
                color: '#2563eb', 
                textDecoration: 'none',
                fontWeight: '500' 
              }}
              className="hover:text-blue-700 hover:underline"
            >
              忘記密碼？
            </Link>
          </div>

          {/* 登入按鈕 */}
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
                登入中...
              </>
            ) : (
              '登入'
            )}
          </button>

          {/* 分隔線 */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                position: 'absolute',
                inset: '0',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{ width: '100%', borderTop: '1px solid #e5e7eb' }}></div>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span 
                style={{ 
                  padding: '0 0.5rem', 
                  backgroundColor: 'white', 
                  color: '#6b7280', 
                  fontSize: '0.875rem' 
                }}
              >
                或
              </span>
            </div>
          </div>

          {/* 社交登入按鈕 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}
              className="hover:bg-gray-50 hover:border-gray-400"
            >
              Google
            </button>
            <button
              type="button"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}
              className="hover:bg-gray-50 hover:border-gray-400"
            >
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}