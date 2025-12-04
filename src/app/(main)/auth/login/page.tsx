'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/store/auth';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Redirect authenticated users to home page
  useEffect(() => {
    setIsReady(true);
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Don't render the login form until we've checked authentication
  if (!isReady) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const redirectUrl = searchParams.get('redirect') || '/';

  // 驗證表單
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 6) {
      newErrors.password = '密碼至少需要6個字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 處理登入
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push(redirectUrl);
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      setErrors({ 
        general: loginAttempts >= 2 
          ? '登入失敗次數過多，請稍後再試或使用忘記密碼功能' 
          : '電子郵件或密碼錯誤' 
      });
    }
  };

  // 社交登入
  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    // 模擬社交登入
    alert(`${provider} 登入功能開發中`);
  };

  // 輸入處理
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      {/* 返回按鈕 */}
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
        返回首頁
      </button>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 標題 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            歡迎回來
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            登入您的 Guidee 帳戶
          </p>
        </div>

        {/* 錯誤訊息 */}
        {errors.general && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
            <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>
              {errors.general}
            </span>
          </div>
        )}

        {/* 登入表單 */}
        <form onSubmit={handleLogin} style={{ marginBottom: '1.5rem' }}>
          {/* 電子郵件 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              電子郵件
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: `1px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            {errors.email && (
              <p style={{
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                color: '#ef4444'
              }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* 密碼 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              密碼
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="輸入您的密碼"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  border: `1px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '1rem', height: '1rem', color: '#9ca3af' }} />
                ) : (
                  <Eye style={{ width: '1rem', height: '1rem', color: '#9ca3af' }} />
                )}
              </button>
            </div>
            {errors.password && (
              <p style={{
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                color: '#ef4444'
              }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* 記住我和忘記密碼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '0.25rem'
                }}
              />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                記住我
              </span>
            </label>
            <button
              onClick={() => alert('忘記密碼功能開發中，請聯繫客服：support@guidee.com')}
              style={{
                fontSize: '0.875rem',
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              className="hover:underline"
            >
              忘記密碼？
            </button>
          </div>

          {/* 登入按鈕 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            className="hover:bg-blue-700"
          >
            {isLoading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                登入中...
              </div>
            ) : (
              '登入'
            )}
          </button>
        </form>

        {/* 分隔線 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#e5e7eb'
          }} />
          <span style={{
            padding: '0 1rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            或
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#e5e7eb'
          }} />
        </div>

        {/* 社交登入 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => handleSocialLogin('google')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            className="hover:bg-[#cfdbe9]"
          >
            <div style={{
              width: '1.25rem',
              height: '1.25rem',
              backgroundColor: '#4285f4',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              G
            </div>
            使用 Google 登入
          </button>

          <button
            onClick={() => handleSocialLogin('facebook')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            className="hover:bg-[#cfdbe9]"
          >
            <div style={{
              width: '1.25rem',
              height: '1.25rem',
              backgroundColor: '#1877f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              f
            </div>
            使用 Facebook 登入
          </button>
        </div>

        {/* 註冊連結 */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          還沒有帳戶？{' '}
          <Link
            href="/auth/register"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            className="hover:underline"
          >
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}