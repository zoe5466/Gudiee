'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar, User, Tag } from 'lucide-react';
import { ContentEditor } from './content-editor';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'page' | 'service' | 'guide';
  status: 'draft' | 'published' | 'archived';
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  tags: string[];
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

interface ContentManagementProps {
  userRole: 'admin' | 'editor' | 'author';
  className?: string;
}

export function ContentManagement({ userRole, className = '' }: ContentManagementProps) {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [filteredContents, setFilteredContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 搜尋和篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 模擬內容數據
  useEffect(() => {
    const mockContents: ContentItem[] = [
      {
        id: '1',
        title: '台北101導覽服務介紹',
        content: '# 台北101導覽服務\n\n台北101是台北最著名的地標建築...',
        type: 'service',
        status: 'published',
        author: { id: 'u1', name: '張小明' },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        publishedAt: new Date('2024-01-20'),
        tags: ['台北', '觀光', '地標'],
        slug: 'taipei-101-tour',
        excerpt: '專業地陪帶您深度探索台北101...',
        featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
      },
      {
        id: '2',
        title: '台灣旅遊安全指南',
        content: '# 台灣旅遊安全指南\n\n在台灣旅遊時，安全是最重要的...',
        type: 'article',
        status: 'published',
        author: { id: 'u2', name: '李美麗' },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        publishedAt: new Date('2024-01-15'),
        tags: ['安全', '旅遊', '指南'],
        slug: 'taiwan-travel-safety-guide',
        excerpt: '旅遊安全須知和注意事項...'
      },
      {
        id: '3',
        title: '關於 Guidee 平台',
        content: '# 關於我們\n\nGuidee 是台灣首創的地陪媒合平台...',
        type: 'page',
        status: 'published',
        author: { id: 'u3', name: '王大華' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-12'),
        publishedAt: new Date('2024-01-05'),
        tags: ['公司', '介紹'],
        slug: 'about-guidee',
        excerpt: 'Guidee 平台介紹和使命...'
      },
      {
        id: '4',
        title: '如何成為認證導遊',
        content: '# 成為認證導遊的步驟\n\n想要成為 Guidee 認證導遊嗎？...',
        type: 'guide',
        status: 'draft',
        author: { id: 'u1', name: '張小明' },
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        tags: ['導遊', '認證', '教學'],
        slug: 'how-to-become-certified-guide',
        excerpt: '詳細介紹導遊認證流程...'
      }
    ];

    setContents(mockContents);
    setFilteredContents(mockContents);
    setIsLoading(false);
  }, []);

  // 搜尋和篩選
  useEffect(() => {
    let filtered = contents.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           content.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || content.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updatedAt':
        default:
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredContents(filtered);
  }, [contents, searchQuery, typeFilter, statusFilter, sortBy, sortOrder]);

  // 處理內容保存
  const handleSaveContent = async (content: string, title: string) => {
    if (isCreating) {
      // 創建新內容
      const newContent: ContentItem = {
        id: Date.now().toString(),
        title,
        content,
        type: 'article',
        status: 'draft',
        author: { id: 'current-user', name: '當前用戶' },
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        slug: title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-'),
        excerpt: content.substring(0, 100) + '...'
      };
      
      setContents(prev => [newContent, ...prev]);
      setIsCreating(false);
    } else if (selectedContent) {
      // 更新現有內容
      setContents(prev => prev.map(item => 
        item.id === selectedContent.id 
          ? { ...item, title, content, updatedAt: new Date() }
          : item
      ));
      setIsEditing(false);
      setSelectedContent(null);
    }
  };

  // 刪除內容
  const handleDeleteContent = (id: string) => {
    if (confirm('確定要刪除這個內容嗎？')) {
      setContents(prev => prev.filter(item => item.id !== id));
    }
  };

  // 更改內容狀態
  const handleStatusChange = (id: string, newStatus: ContentItem['status']) => {
    setContents(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: newStatus, 
            publishedAt: newStatus === 'published' ? new Date() : item.publishedAt,
            updatedAt: new Date()
          }
        : item
    ));
  };

  // 獲取狀態顏色
  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return '#10b981';
      case 'draft': return '#f59e0b';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // 獲取類型標籤
  const getTypeLabel = (type: ContentItem['type']) => {
    switch (type) {
      case 'article': return '文章';
      case 'page': return '頁面';
      case 'service': return '服務';
      case 'guide': return '指南';
      default: return type;
    }
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (isCreating || isEditing) {
    return (
      <ContentEditor
        initialContent={selectedContent?.content || ''}
        title={selectedContent?.title || ''}
        onSave={handleSaveContent}
        onCancel={() => {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedContent(null);
        }}
        className={className}
      />
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }} className={className}>
      {/* 標題和操作區 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            內容管理
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0.25rem 0 0'
          }}>
            管理網站內容，包括文章、頁面、服務和指南
          </p>
        </div>
        
        {(userRole === 'admin' || userRole === 'editor') && (
          <button
            onClick={() => setIsCreating(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            className="hover:bg-blue-600"
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            新增內容
          </button>
        )}
      </div>

      {/* 搜尋和篩選區 */}
      <div style={{
        padding: '1rem 1.5rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* 搜尋框 */}
          <div style={{ position: 'relative' }}>
            <Search style={{
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
              placeholder="搜尋標題、內容或標籤..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 類型篩選 */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">所有類型</option>
            <option value="article">文章</option>
            <option value="page">頁面</option>
            <option value="service">服務</option>
            <option value="guide">指南</option>
          </select>

          {/* 狀態篩選 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">所有狀態</option>
            <option value="published">已發布</option>
            <option value="draft">草稿</option>
            <option value="archived">已封存</option>
          </select>

          {/* 排序 */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="updatedAt-desc">最近更新</option>
            <option value="createdAt-desc">最近創建</option>
            <option value="title-asc">標題 A-Z</option>
            <option value="title-desc">標題 Z-A</option>
          </select>
        </div>
      </div>

      {/* 內容列表 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{
                padding: '0.75rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                標題
              </th>
              <th style={{
                padding: '0.75rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                類型
              </th>
              <th style={{
                padding: '0.75rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                狀態
              </th>
              <th style={{
                padding: '0.75rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                作者
              </th>
              <th style={{
                padding: '0.75rem 1.5rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                更新時間
              </th>
              <th style={{
                padding: '0.75rem 1.5rem',
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContents.map((content) => (
              <tr key={content.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '0.25rem'
                    }}>
                      {content.title}
                    </div>
                    {content.excerpt && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {content.excerpt}
                      </div>
                    )}
                    {content.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        gap: '0.25rem',
                        marginTop: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {content.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '0.125rem 0.375rem',
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280',
                              borderRadius: '0.25rem',
                              fontSize: '0.625rem'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {content.tags.length > 3 && (
                          <span style={{
                            fontSize: '0.625rem',
                            color: '#9ca3af'
                          }}>
                            +{content.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f0f9ff',
                    color: '#0369a1',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {getTypeLabel(content.type)}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: getStatusColor(content.status),
                      borderRadius: '50%'
                    }} />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#374151'
                    }}>
                      {content.status === 'published' ? '已發布' :
                       content.status === 'draft' ? '草稿' : '已封存'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#6b7280'
                    }}>
                      {content.author.name.charAt(0)}
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#374151'
                    }}>
                      {content.author.name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {formatDate(content.updatedAt)}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'flex-end'
                  }}>
                    {/* 查看按鈕 */}
                    <button
                      style={{
                        padding: '0.375rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                      className="hover:bg-gray-100"
                      title="查看"
                    >
                      <Eye style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                    </button>

                    {/* 編輯按鈕 */}
                    {(userRole === 'admin' || userRole === 'editor' || content.author.id === 'current-user') && (
                      <button
                        onClick={() => {
                          setSelectedContent(content);
                          setIsEditing(true);
                        }}
                        style={{
                          padding: '0.375rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                        className="hover:bg-gray-100"
                        title="編輯"
                      >
                        <Edit style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      </button>
                    )}

                    {/* 狀態切換 */}
                    {(userRole === 'admin' || userRole === 'editor') && (
                      <select
                        value={content.status}
                        onChange={(e) => handleStatusChange(content.id, e.target.value as ContentItem['status'])}
                        style={{
                          padding: '0.25rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="draft">草稿</option>
                        <option value="published">發布</option>
                        <option value="archived">封存</option>
                      </select>
                    )}

                    {/* 刪除按鈕 */}
                    {(userRole === 'admin' || content.author.id === 'current-user') && (
                      <button
                        onClick={() => handleDeleteContent(content.id)}
                        style={{
                          padding: '0.375rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                        className="hover:bg-red-50"
                        title="刪除"
                      >
                        <Trash2 style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredContents.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              📄
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              找不到內容
            </h3>
            <p>嘗試調整搜尋條件或篩選器</p>
          </div>
        )}
      </div>
    </div>
  );
}