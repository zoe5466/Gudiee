'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Mail, Check } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });
  
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordFormErrors = {};
    
    if (!formData.email) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除錯誤當用戶開始輸入
    if (errors[name as keyof ForgotPasswordFormErrors]) {
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
    
    setIsLoading(true);
    
    try {
      // TODO: 實際 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模擬 API 延遲
      
      setIsEmailSent(true);
      success('重設郵件已發送', '請檢查您的電子郵件收件匣');
      
    } catch (err) {
      error('發送失敗', '無法發送重設郵件，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
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
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          {/* Success Icon */}
          <div 
            style={{
              margin: '0 auto 1.5rem',
              height: '4rem',
              width: '4rem',
              background: 'linear-gradient(to right, #10b981, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Check style={{ width: '2rem', height: '2rem', color: 'white' }} />
          </div>

          <h1 
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem'
            }}
          >
            郵件已發送
          </h1>
          
          <p 
            style={{
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}
          >
            我們已將密碼重設連結發送到：
            <br />
            <strong style={{ color: '#111827' }}>{formData.email}</strong>
            <br />
            <br />
            請檢查您的電子郵件收件匣（包含垃圾郵件夾），並點擊連結重設密碼。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setIsEmailSent(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:shadow-lg"
            >
              重新發送郵件
            </button>
            
            <Link 
              href="/login"
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                color: '#374151',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              className="hover:bg-gray-50"
            >
              返回登入
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <Mail style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          
          <h1 
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}
          >
            忘記密碼
          </h1>
          
          <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.6' }}>
            請輸入您的電子郵件地址，我們將發送密碼重設連結給您
          </p>

          <div style={{ marginTop: '1rem' }}>
            <Link 
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#2563eb',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}
              className="hover:text-blue-700"
            >
              <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
              返回登入
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                發送中...
              </>
            ) : (
              '發送重設連結'
            )}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            記得密碼了？{' '}
            <Link 
              href="/login" 
              style={{ 
                color: '#2563eb', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
              className="hover:text-blue-700 hover:underline"
            >
              立即登入
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}