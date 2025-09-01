'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Tag,
  MessageCircle,
  Eye,
  Edit3,
  Trash2,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  Globe,
  Star
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  dateRange: {
    start: string;
    end: string;
    flexible: boolean;
  };
  duration: string;
  maxApplicants: number;
  currentApplicants: number;
  requirements: string[];
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  applicants?: TaskApplicant[];
  selectedGuide?: string;
  priority: 'low' | 'medium' | 'high';
  isUrgent: boolean;
  tags: string[];
}

interface TaskApplicant {
  id: string;
  guideId: string;
  guideName: string;
  guideAvatar: string;
  guideRating: number;
  message: string;
  proposedPrice: number;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

type TaskStatus = 'all' | 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
type ViewMode = 'my-tasks' | 'browse-tasks' | 'create-task';

export default function TasksPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>('my-tasks');
  const [statusFilter, setStatusFilter] = useState<TaskStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 檢查認證狀態
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadTasks();
  }, [isAuthenticated, router]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // TODO: 實際 API 調用
      const mockTasks: Task[] = [
        {
          id: 'task-1',
          title: '台北古蹟文化深度導覽',
          description: '希望找到一位熟悉台北歷史文化的地陪，帶我們參觀故宮、中正紀念堂等重要景點，並深入了解背後的歷史故事。',
          category: '文化導覽',
          location: '台北市',
          budget: { min: 1500, max: 2500, currency: 'TWD' },
          dateRange: { start: '2024-01-25', end: '2024-01-27', flexible: true },
          duration: '6小時',
          maxApplicants: 5,
          currentApplicants: 3,
          requirements: ['熟悉台北歷史', '中英文流利', '有導遊證照'],
          status: 'active',
          createdBy: user?.id || '',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          priority: 'high',
          isUrgent: false,
          tags: ['文化', '歷史', '故宮', '古蹟']
        },
        {
          id: 'task-2',
          title: '夜市美食探索之旅',
          description: '想要體驗正宗的台灣夜市文化，尋找道地的小吃和隱藏版美食。',
          category: '美食體驗',
          location: '台北市',
          budget: { min: 800, max: 1200, currency: 'TWD' },
          dateRange: { start: '2024-01-20', end: '2024-01-22', flexible: false },
          duration: '4小時',
          maxApplicants: 3,
          currentApplicants: 1,
          requirements: ['熟悉夜市', '美食達人'],
          status: 'in_progress',
          createdBy: user?.id || '',
          createdAt: '2024-01-12T15:30:00Z',
          updatedAt: '2024-01-14T09:15:00Z',
          priority: 'medium',
          isUrgent: true,
          tags: ['美食', '夜市', '小吃', '在地體驗']
        },
        {
          id: 'task-3',
          title: '九份金瓜石攝影之旅',
          description: '專業攝影師陪同拍攝九份老街和金瓜石的美景，包含日落和夜景。',
          category: '攝影服務',
          location: '新北市瑞芳區',
          budget: { min: 2000, max: 3500, currency: 'TWD' },
          dateRange: { start: '2024-02-01', end: '2024-02-03', flexible: true },
          duration: '8小時',
          maxApplicants: 2,
          currentApplicants: 0,
          requirements: ['攝影技能', '熟悉九份', '有專業設備'],
          status: 'draft',
          createdBy: user?.id || '',
          createdAt: '2024-01-16T11:20:00Z',
          updatedAt: '2024-01-16T11:20:00Z',
          priority: 'low',
          isUrgent: false,
          tags: ['攝影', '九份', '金瓜石', '日落', '夜景']
        }
      ];
      
      setTasks(mockTasks);
    } catch (err) {
      error('載入失敗', '無法載入任務列表');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['全部', '文化導覽', '美食體驗', '攝影服務', '購物助手', '交通協助', '其他'];

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || selectedCategory === '全部' || task.category === selectedCategory;
    
    return matchesStatus && matchesSearch && matchesCategory;
  });

  const getStatusText = (status: Task['status']) => {
    const statusMap = {
      draft: '草稿',
      active: '進行中',
      in_progress: '執行中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return statusMap[status];
  };

  const getStatusColor = (status: Task['status']) => {
    const colorMap = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status];
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Edit3 className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="flex justify-center items-center py-20">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">任務管理</h1>
          <p className="text-gray-600">發布任務需求，找到完美的旅遊協助</p>
        </div>

        {/* 導航選項卡 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setViewMode('my-tasks')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                viewMode === 'my-tasks'
                  ? 'text-[#FF5A5F] border-b-2 border-[#FF5A5F]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              我的任務
            </button>
            <button
              onClick={() => setViewMode('browse-tasks')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                viewMode === 'browse-tasks'
                  ? 'text-[#FF5A5F] border-b-2 border-[#FF5A5F]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              瀏覽任務
            </button>
            <button
              onClick={() => setViewMode('create-task')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                viewMode === 'create-task'
                  ? 'text-[#FF5A5F] border-b-2 border-[#FF5A5F]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              發布任務
            </button>
          </div>
        </div>

        {viewMode === 'my-tasks' && (
          <>
            {/* 統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">總任務</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">進行中</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks.filter(t => t.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">已完成</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">申請者</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks.reduce((sum, task) => sum + task.currentApplicants, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* 搜尋和篩選 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="搜尋任務..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                  >
                    {categories.map(category => (
                      <option key={category} value={category === '全部' ? 'all' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#FF5A5F] transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    篩選
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => setViewMode('create-task')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E1464A] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    發布任務
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <h3 className="text-sm font-medium text-gray-700 w-full mb-2">狀態篩選：</h3>
                    {(['all', 'draft', 'active', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          statusFilter === status
                            ? 'bg-[#FF5A5F] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'all' ? '全部' : getStatusText(status)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 任務列表 */}
            {filteredTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                              {task.isUrgent && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                  緊急
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {getStatusIcon(task.status)}
                                {getStatusText(task.status)}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {task.category}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{task.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(task.dateRange.start).toLocaleDateString('zh-TW')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{task.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>NT$ {task.budget.min.toLocaleString()} - {task.budget.max.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{task.currentApplicants}/{task.maxApplicants} 申請者</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:min-w-[150px]">
                        {task.status === 'active' && (
                          <>
                            <button className="btn btn-primary btn-sm flex items-center justify-center gap-2">
                              <Eye className="w-4 h-4" />
                              查看申請
                            </button>
                            <button className="btn btn-secondary btn-sm flex items-center justify-center gap-2">
                              <Edit3 className="w-4 h-4" />
                              編輯
                            </button>
                          </>
                        )}
                        
                        {task.status === 'draft' && (
                          <>
                            <button className="btn btn-primary btn-sm">
                              發布任務
                            </button>
                            <button className="btn btn-secondary btn-sm flex items-center justify-center gap-2">
                              <Edit3 className="w-4 h-4" />
                              編輯
                            </button>
                          </>
                        )}
                        
                        {task.status === 'in_progress' && (
                          <button className="btn btn-primary btn-sm flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            聊天
                          </button>
                        )}
                        
                        {task.status === 'completed' && (
                          <button className="btn btn-secondary btn-sm flex items-center justify-center gap-2">
                            <Star className="w-4 h-4" />
                            評價
                          </button>
                        )}
                        
                        <button className="btn btn-ghost btn-sm flex items-center justify-center gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {statusFilter === 'all' ? '還沒有任何任務' : `沒有${getStatusText(statusFilter)}的任務`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter === 'all' 
                    ? '發布您的第一個任務，找到完美的旅遊協助！' 
                    : '試試調整篩選條件或發布新任務'
                  }
                </p>
                <button
                  onClick={() => setViewMode('create-task')}
                  className="btn btn-primary"
                >
                  發布任務
                </button>
              </div>
            )}
          </>
        )}

        {viewMode === 'browse-tasks' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">瀏覽任務功能</h3>
            <p className="text-gray-600 mb-6">此功能開發中，即將為您提供豐富的任務瀏覽體驗</p>
            <p className="text-sm text-gray-500">
              未來您可以在這裡瀏覽其他旅客發布的任務，並申請成為他們的地陪
            </p>
          </div>
        )}

        {viewMode === 'create-task' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">發布任務功能</h3>
            <p className="text-gray-600 mb-6">此功能開發中，即將為您提供完整的任務發布流程</p>
            <p className="text-sm text-gray-500">
              未來您可以在這裡詳細描述您的需求，設定預算和時間，找到最適合的地陪
            </p>
          </div>
        )}
      </div>
    </div>
  );
}