'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Eye,
  Users,
  ChevronDown,
  Plus,
  Star
} from 'lucide-react';
import { SimpleNavigation } from '@/components/layout/page-navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    city: string;
    district?: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    estimatedHours: number;
  };
  skills: string[];
  languages?: string[];
  client: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedTasks: number;
    isVerified: boolean;
  };
  tags: string[];
  views: number;
  applications: number;
  createdAt: string;
}

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || 'OPEN',
    priority: searchParams.get('priority') || '',
    location: searchParams.get('location') || '',
    budgetMin: searchParams.get('budgetMin') || '',
    budgetMax: searchParams.get('budgetMax') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: '', name: '全部分類' },
    { id: 'delivery', name: '送件配送' },
    { id: 'guide', name: '導遊服務' },
    { id: 'translation', name: '翻譯服務' },
    { id: 'photography', name: '攝影服務' },
    { id: 'other', name: '其他服務' }
  ];

  const types = [
    { id: '', name: '全部類型' },
    { id: 'urgent', name: '緊急任務' },
    { id: 'normal', name: '一般任務' },
    { id: 'long_term', name: '長期任務' }
  ];

  const priorities = [
    { id: '', name: '全部優先級' },
    { id: 'low', name: '低優先級', color: 'text-gray-600' },
    { id: 'medium', name: '中優先級', color: 'text-blue-600' },
    { id: 'high', name: '高優先級', color: 'text-orange-600' },
    { id: 'urgent', name: '緊急', color: 'text-red-600' }
  ];

  const sortOptions = [
    { id: 'newest', name: '最新發佈' },
    { id: 'oldest', name: '最早發佈' },
    { id: 'budget_high', name: '預算由高到低' },
    { id: 'budget_low', name: '預算由低到高' },
    { id: 'deadline', name: '截止日期' }
  ];

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const response = await fetch(`/api/tasks?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data || []);
      } else {
        console.error('Failed to fetch tasks:', data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getPriorityColor = (priority: string) => {
    return priorities.find(p => p.id === priority)?.color || 'text-gray-600';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-700',
      'normal': 'bg-blue-100 text-blue-700',
      'long_term': 'bg-green-100 text-green-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">任務市場</h1>
            <p className="text-gray-600 mt-1">探索各種工作機會，展現您的專業技能</p>
          </div>
          <button
            onClick={() => router.push('/tasks/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            發佈任務
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                placeholder="搜尋任務標題、描述或技能"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              篩選
              <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </form>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先級</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地點</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="城市或區域"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最低預算</label>
                <input
                  type="number"
                  value={filters.budgetMin}
                  onChange={(e) => handleFilterChange('budgetMin', e.target.value)}
                  placeholder="TWD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最高預算</label>
                <input
                  type="number"
                  value={filters.budgetMax}
                  onChange={(e) => handleFilterChange('budgetMax', e.target.value)}
                  placeholder="TWD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">沒有找到任務</h3>
            <p className="text-gray-600 mb-6">試試調整搜尋條件或發佈新任務</p>
            <button
              onClick={() => router.push('/tasks/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              發佈第一個任務
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(task.type)}`}>
                          {task.type === 'urgent' ? '緊急' : task.type === 'normal' ? '一般' : '長期'}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'urgent' ? '🔥 緊急' : 
                           task.priority === 'high' ? '⚡ 高' :
                           task.priority === 'medium' ? '📋 中' : '📝 低'}
                        </span>
                      </div>
                      <h3 
                        className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getCategoryName(task.category)}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Budget */}
                  <div className="flex items-center mb-4">
                    <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                    <span className="font-semibold text-green-600">
                      NT$ {task.budget.min.toLocaleString()} - {task.budget.max.toLocaleString()}
                    </span>
                  </div>

                  {/* Location and Time */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {task.location.city}
                      {task.location.district && `, ${task.location.district}`}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(task.timeline.startDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {task.timeline.estimatedHours}小時
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {task.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {task.skills.length > 3 && (
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        +{task.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={task.client.avatar || '/default-avatar.png'}
                        alt={task.client.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="text-sm">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{task.client.name}</span>
                          {task.client.isVerified && (
                            <span className="ml-1 text-blue-500">✓</span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          {task.client.rating} ({task.client.completedTasks})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {task.views}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {task.applications}
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      截止: {formatDate(task.timeline.endDate)}
                      {calculateDaysLeft(task.timeline.endDate) > 0 && (
                        <span className="ml-2 text-blue-600 font-medium">
                          ({calculateDaysLeft(task.timeline.endDate)} 天後)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/tasks/${task.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}