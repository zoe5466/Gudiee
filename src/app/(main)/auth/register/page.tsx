'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/store/auth';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'customer' | 'guide';
  agreeTerms: boolean;
  subscribeNewsletter: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
    agreeTerms: false,
    subscribeNewsletter: false
  });
  
  // 檢查 URL 參數並設置預設用戶類型
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'guide') {
      setFormData(prev => ({ ...prev, userType: 'guide' }));
    }
  }, [searchParams]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  // 密碼強度檢查
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  // 驗證表單
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2個字符';
    }

    if (!formData.email) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!formData.phone) {
      newErrors.phone = '請輸入手機號碼';
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone = '請輸入有效的台灣手機號碼格式 (09xxxxxxxx)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = '請輸入密碼';
    } else if (formData.password.length < 8) {
      newErrors.password = '密碼至少需要8個字符';
    } else if (passwordStrength.score < 3) {
      newErrors.password = '密碼強度不足，請包含大小寫字母、數字或特殊字符';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認密碼';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '密碼確認不一致';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '請同意服務條款和隱私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 處理註冊
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        subscribeNewsletter: formData.subscribeNewsletter
      });
      
      // 註冊成功，跳轉到個人資料設置頁面
      alert('註冊成功！請完善個人資料以完成帳戶設置。');
      router.push('/profile/setup');
    } catch (error: any) {
      setErrors({ 
        general: error.message || '註冊失敗，請稍後再試' 
      });
    }
  };

  // 下一步
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  // 輸入處理
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  // 獲取密碼強度顏色
  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return '#ef4444';
    if (score <= 3) return '#f59e0b';
    return '#10b981';
  };

  // 獲取密碼強度文字
  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return '弱';
    if (score <= 3) return '中等';
    return '強';
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
        maxWidth: '450px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 進度指示器 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: currentStep >= 1 ? '#3b82f6' : '#e5e7eb',
              color: currentStep >= 1 ? 'white' : '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {currentStep > 1 ? <Check style={{ width: '1rem', height: '1rem' }} /> : '1'}
            </div>
            <div style={{
              width: '3rem',
              height: '2px',
              backgroundColor: currentStep >= 2 ? '#3b82f6' : '#e5e7eb'
            }} />
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: currentStep >= 2 ? '#3b82f6' : '#e5e7eb',
              color: currentStep >= 2 ? 'white' : '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              2
            </div>
          </div>
        </div>

        {/* 標題 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {currentStep === 1 ? '建立帳戶' : '設定密碼'}
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            {currentStep === 1 
              ? '填寫基本資料以開始使用 Guidee' 
              : '設定安全密碼保護您的帳戶'
            }
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

        <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleRegister}>
          {currentStep === 1 && (
            <>
              {/* 用戶類型選擇 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  我想要
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem'
                }}>
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'customer')}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${formData.userType === 'customer' ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      backgroundColor: formData.userType === 'customer' ? '#eff6ff' : 'white',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧳</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      尋找地陪
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      我是旅客
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'guide')}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${formData.userType === 'guide' ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      backgroundColor: formData.userType === 'guide' ? '#eff6ff' : 'white',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      成為地陪
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      提供服務
                    </div>
                  </button>
                </div>
              </div>

              {/* 姓名 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  姓名 *
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="請輸入您的姓名"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: `1px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                {errors.name && (
                  <p style={{
                    marginTop: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#ef4444'
                  }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* 電子郵件 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  電子郵件 *
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

              {/* 手機號碼 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  手機號碼 *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="09xxxxxxxx"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: `1px solid ${errors.phone ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                {errors.phone && (
                  <p style={{
                    marginTop: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#ef4444'
                  }}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* 密碼 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  密碼 *
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
                    placeholder="設定您的密碼"
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
                
                {/* 密碼強度指示器 */}
                {formData.password && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          height: '100%',
                          backgroundColor: getPasswordStrengthColor(passwordStrength.score),
                          transition: 'all 0.3s'
                        }} />
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: getPasswordStrengthColor(passwordStrength.score)
                      }}>
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: passwordStrength.checks.length ? '#10b981' : '#ef4444'
                      }}>
                        {passwordStrength.checks.length ? '✓' : '✗'} 至少8個字符
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: passwordStrength.checks.uppercase ? '#10b981' : '#ef4444'
                      }}>
                        {passwordStrength.checks.uppercase ? '✓' : '✗'} 包含大寫字母
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: passwordStrength.checks.lowercase ? '#10b981' : '#ef4444'
                      }}>
                        {passwordStrength.checks.lowercase ? '✓' : '✗'} 包含小寫字母
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: passwordStrength.checks.number ? '#10b981' : '#ef4444'
                      }}>
                        {passwordStrength.checks.number ? '✓' : '✗'} 包含數字
                      </div>
                    </div>
                  </div>
                )}
                
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

              {/* 確認密碼 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  確認密碼 *
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="再次輸入密碼"
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                      border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? (
                      <EyeOff style={{ width: '1rem', height: '1rem', color: '#9ca3af' }} />
                    ) : (
                      <Eye style={{ width: '1rem', height: '1rem', color: '#9ca3af' }} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p style={{
                    marginTop: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#ef4444'
                  }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* 服務條款 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    style={{
                      width: '1rem',
                      height: '1rem',
                      marginTop: '0.125rem'
                    }}
                  />
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    lineHeight: '1.4'
                  }}>
                    我同意{' '}
                    <Link href="/terms" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      服務條款
                    </Link>
                    {' '}和{' '}
                    <Link href="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      隱私政策
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p style={{
                    marginTop: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#ef4444'
                  }}>
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* 電子報訂閱 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.subscribeNewsletter}
                    onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                    style={{
                      width: '1rem',
                      height: '1rem'
                    }}
                  />
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}>
                    訂閱電子報，接收最新旅遊資訊和優惠
                  </span>
                </label>
              </div>
            </>
          )}

          {/* 按鈕 */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-[#cfdbe9]"
              >
                上一步
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
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
                  {currentStep === 1 ? '驗證中...' : '註冊中...'}
                </div>
              ) : (
                currentStep === 1 ? '下一步' : '建立帳戶'
              )}
            </button>
          </div>
        </form>

        {/* 登入連結 */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          已經有帳戶？{' '}
          <Link
            href="/auth/login"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            className="hover:underline"
          >
            立即登入
          </Link>
        </p>
      </div>
    </div>
  );
}