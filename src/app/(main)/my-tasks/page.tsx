'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Filter,
  Star,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/store/auth';

interface MyTask {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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
  applicants: Array<{
    workerId: string;
    workerName: string;
    workerAvatar?: string;
    appliedAt: string;
    proposedPrice: number;
    message: string;
    rating: number;
    completedTasks: number;
  }>;
  assignedWorker?: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedTasks: number;
  };
  views: number;
  applications: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyTasksPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchMyTasks();
  }, [isAuthenticated, router]);

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks?my=true');
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data || []);
      } else {
        console.error('Failed to fetch my tasks:', data.message);
        setError(data.message || '獲取任務列表失敗');
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError('獲取任務列表失敗');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'OPEN': '招募中',
      'IN_PROGRESS': '進行中',
      'COMPLETED': '已完成',
      'CANCELLED': '已取消'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'OPEN': 'bg-blue-100 text-blue-700',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Eye className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    const categoryMap = {
      'delivery': '送件配送',
      'guide': '導遊服務',
      'translation': '翻譯服務',
      'photography': '攝影服務',
      'other': '其他服務'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const handleAssignWorker = async (taskId: string, workerId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workerId })
      });

      const data = await response.json();
      if (data.success) {
        fetchMyTasks(); // 重新載入任務列表
      } else {
        alert(data.message || '分配任務失敗');
      }
    } catch (error) {
      console.error('Assign worker error:', error);
      alert('分配任務失敗');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">請先登入</h2>
          <p className="text-gray-600 mb-4">您需要登入才能查看我的任務</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">我的任務</h1>
            <p className="text-gray-600 mt-1">管理您發佈的任務和工作進度</p>
          </div>
          <button
            onClick={() => router.push('/tasks/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            發佈新任務
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">總任務</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">招募中</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'OPEN').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">進行中</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">狀態篩選：</span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: '全部' },
                { value: 'OPEN', label: '招募中' },
                { value: 'IN_PROGRESS', label: '進行中' },
                { value: 'COMPLETED', label: '已完成' },
                { value: 'CANCELLED', label: '已取消' }
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    statusFilter === status.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'all' ? '還沒有任務' : `沒有${getStatusText(statusFilter)}的任務`}
            </h3>
            <p className="text-gray-600 mb-6">發佈您的第一個任務，開始尋找專業工作者！</p>
            <button
              onClick={() => router.push('/tasks/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              發佈任務
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{getStatusText(task.status)}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{getCategoryName(task.category)}</p>
                      <p className="text-gray-600 mb-4">{task.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/tasks/${task.id}/edit`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="編輯任務"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="刪除任務"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {task.location.city}
                      {task.location.district && `, ${task.location.district}`}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(task.timeline.startDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {task.timeline.estimatedHours} 小時
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      NT$ {task.budget.min.toLocaleString()} - {task.budget.max.toLocaleString()}
                    </div>
                  </div>

                  {/* Assigned Worker or Applicants */}
                  {task.assignedWorker ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-green-800 mb-2">已分配工作者</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={task.assignedWorker.avatar || '/default-avatar.png'}
                            alt={task.assignedWorker.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{task.assignedWorker.name}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
                              {task.assignedWorker.rating} ({task.assignedWorker.completedTasks} 任務)
                            </div>
                          </div>
                        </div>
                        <button
                          className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          聊天
                        </button>
                      </div>
                    </div>
                  ) : task.applicants.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">申請者 ({task.applicants.length})</h4>
                      <div className="space-y-3">
                        {task.applicants.map((applicant) => (
                          <div key={applicant.workerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center flex-1">
                              <img
                                src={applicant.workerAvatar || '/default-avatar.png'}
                                alt={applicant.workerName}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{applicant.workerName}</p>
                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                  {applicant.rating} ({applicant.completedTasks} 任務)
                                </div>
                                <p className="text-sm text-gray-600">報價: NT$ {applicant.proposedPrice.toLocaleString()}</p>
                                <p className="text-sm text-gray-600 line-clamp-1">{applicant.message}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleAssignWorker(task.id, applicant.workerId)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                              >
                                選擇
                              </button>
                              <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                                查看
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-yellow-800 text-sm">尚無申請者，請等待工作者申請您的任務。</p>
                    </div>
                  )}

                  {/* Stats and Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {task.views} 瀏覽
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {task.applications} 申請
                      </div>
                      <span>發佈於 {formatDate(task.createdAt)}</span>
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