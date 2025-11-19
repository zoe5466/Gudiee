'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/components/providers/i18n-provider';
import { BarChart3, FileText, Users, Eye, TrendingUp, Calendar, Settings } from 'lucide-react';
import { PageNavigation } from '@/components/layout/page-navigation';
import { ContentManagement } from '@/components/cms/content-management';
import { useAuth } from '@/store/auth';

export default function CMSPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // 檢查用戶權限
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin/cms');
      return;
    }

    // 檢查是否為管理員或編輯者
    if (user?.role !== 'admin' && user?.role !== 'guide') {
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  // 模擬統計數據
  const stats = {
    totalContent: 247,
    publishedContent: 189,
    draftContent: 58,
    monthlyViews: 12589,
    monthlyViewsGrowth: 15.3,
    topContent: [
      { title: '台北101導覽服務', views: 1249, type: '服務' },
      { title: '台灣旅遊安全指南', views: 987, type: '文章' },
      { title: '九份老街文化之旅', views: 834, type: '服務' },
      { title: '關於 Guidee 平台', views: 756, type: '頁面' },
      { title: '如何成為認證導遊', views: 623, type: '指南' }
    ]
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 統計卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
                  </div>
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {stats.totalContent}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
{t('admin.cms.total_content')}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#dcfce7',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Eye style={{ width: '1.5rem', height: '1.5rem', color: '#10b981' }} />
                  </div>
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {stats.publishedContent}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
{t('admin.cms.published_content')}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
                  </div>
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {stats.draftContent}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
{t('admin.cms.draft_content')}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#fce7f3',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: '#ec4899' }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#10b981',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    <TrendingUp style={{ width: '1rem', height: '1rem' }} />
                    +{stats.monthlyViewsGrowth}%
                  </div>
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {stats.monthlyViews.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
{t('admin.cms.monthly_views')}
                </div>
              </div>
            </div>

            {/* 熱門內容 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
{t('admin.cms.popular_content')}
                </h3>
              </div>
              <div style={{ padding: '1rem' }}>
                {stats.topContent.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      marginBottom: index < stats.topContent.length - 1 ? '0.5rem' : 0
                    }}
                    className="hover:bg-[#cfdbe9]"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280'
                      }}>
                        {index + 1}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#111827'
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          {item.type}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <Eye style={{ width: '0.875rem', height: '0.875rem' }} />
                      {item.views.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <ContentManagement 
            userRole={user?.role === 'admin' ? 'admin' : 'editor'} 
          />
        );

      case 'analytics':
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <BarChart3 style={{
              width: '4rem',
              height: '4rem',
              color: '#d1d5db',
              margin: '0 auto 1rem'
            }} />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
{t('admin.cms.analytics_coming_soon')}
            </h3>
            <p style={{
              color: '#6b7280'
            }}>
{t('admin.cms.analytics_description')}
            </p>
          </div>
        );

      case 'settings':
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <Settings style={{
              width: '4rem',
              height: '4rem',
              color: '#d1d5db',
              margin: '0 auto 1rem'
            }} />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
{t('admin.cms.settings_coming_soon')}
            </h3>
            <p style={{
              color: '#6b7280'
            }}>
{t('admin.cms.settings_description')}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* 標題區域 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
{t('admin.cms.title')}
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0
              }}>
{t('admin.cms.description')}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <Calendar style={{ width: '1rem', height: '1rem' }} />
                {new Date().toLocaleDateString('zh-TW')}
              </div>
              <div style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {user?.role === 'admin' ? '管理員' : '編輯者'}
              </div>
            </div>
          </div>

          {/* 導航標籤 */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1rem'
          }}>
            {[
              { key: 'overview', label: t('admin.cms.overview'), icon: BarChart3 },
              { key: 'content', label: t('admin.cms.content_management'), icon: FileText },
              { key: 'analytics', label: t('admin.cms.analytics'), icon: TrendingUp },
              { key: 'settings', label: t('admin.cms.system_settings'), icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: activeTab === key ? '#3b82f6' : 'transparent',
                  color: activeTab === key ? 'white' : '#6b7280',
                  border: '1px solid',
                  borderColor: activeTab === key ? '#3b82f6' : '#e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-[#cfdbe9]"
              >
                <Icon style={{ width: '1rem', height: '1rem' }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 主要內容 */}
        <div style={{ marginBottom: '2rem' }}>
          {renderTabContent()}
        </div>

        {/* 返回按鈕 */}
        <PageNavigation showBackButton={true} backButtonText="返回首頁" />
      </div>
    </div>
  );
}