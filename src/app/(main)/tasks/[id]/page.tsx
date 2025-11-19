'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Eye,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  User,
  ArrowLeft,
  Send,
  MessageCircle,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '@/store/auth';

interface TaskDetail {
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
    address?: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    estimatedHours: number;
  };
  requirements: string[];
  skills: string[];
  languages: string[];
  client: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedTasks: number;
    isVerified: boolean;
    joinedAt: string;
  };
  tags: string[];
  views: number;
  applications: number;
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
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyForm, setApplyForm] = useState({
    proposedPrice: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTaskDetail();
  }, [params.id]);

  const fetchTaskDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setTask(data.data);
      } else {
        setError(data.message || '獲取任務詳情失敗');
      }
    } catch (error) {
      console.error('Error fetching task detail:', error);
      setError('獲取任務詳情失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!applyForm.proposedPrice || !applyForm.message.trim()) {
      alert('請填寫完整的申請資訊');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${params.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposedPrice: parseFloat(applyForm.proposedPrice),
          message: applyForm.message.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('申請成功！');
        setShowApplyForm(false);
        setApplyForm({ proposedPrice: '', message: '' });
        fetchTaskDetail(); // 重新載入任務詳情
      } else {
        alert(data.message || '申請失敗');
      }
    } catch (error) {
      console.error('Apply error:', error);
      alert('申請失敗，請稍後重試');
    } finally {
      setSubmitting(false);
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

  const getTypeColor = (type: string) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-700',
      'normal': 'bg-blue-100 text-blue-700',
      'long_term': 'bg-green-100 text-green-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'urgent': 'text-red-600',
      'high': 'text-orange-600',
      'medium': 'text-blue-600',
      'low': 'text-gray-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#cfdbe9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-[#cfdbe9] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">任務不存在</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/tasks')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回任務列表
          </button>
        </div>
      </div>
    );
  }

  const canApply = task.status === 'OPEN' && 
                   isAuthenticated && 
                   task.client.id !== user?.id &&
                   !task.applicants.some(app => app.workerId === user?.id);

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(task.type)}`}>
                      {task.type === 'urgent' ? '緊急' : task.type === 'normal' ? '一般' : '長期'}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'urgent' ? '🔥 緊急' : 
                       task.priority === 'high' ? '⚡ 高' :
                       task.priority === 'medium' ? '📋 中' : '📝 低'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
                  <p className="text-gray-600 mb-3">{getCategoryName(task.category)}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-xl font-bold text-green-600">
                  NT$ {task.budget.min.toLocaleString()} - {task.budget.max.toLocaleString()}
                </span>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {task.location.city}
                  {task.location.district && `, ${task.location.district}`}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(task.timeline.startDate)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {task.timeline.estimatedHours} 小時
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {task.views} 瀏覽
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">任務描述</h2>
              <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
            </div>

            {/* Requirements */}
            {task.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">需求條件</h2>
                <ul className="space-y-2">
                  {task.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {task.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">所需技能</h2>
                <div className="flex flex-wrap gap-2">
                  {task.skills.map((skill, index) => (
                    <span key={index} className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {task.languages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">語言要求</h2>
                <div className="flex flex-wrap gap-2">
                  {task.languages.map((lang, index) => (
                    <span key={index} className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Form */}
            {canApply && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                {!showApplyForm ? (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">對這個任務感興趣？</h3>
                    <p className="text-gray-600 mb-4">提交您的申請，展示您的專業能力</p>
                    <button
                      onClick={() => setShowApplyForm(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      申請此任務
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">申請任務</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          您的報價 (TWD)
                        </label>
                        <input
                          type="number"
                          value={applyForm.proposedPrice}
                          onChange={(e) => setApplyForm(prev => ({ ...prev, proposedPrice: e.target.value }))}
                          placeholder={`建議範圍: ${task.budget.min} - ${task.budget.max}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          申請訊息
                        </label>
                        <textarea
                          value={applyForm.message}
                          onChange={(e) => setApplyForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="介紹您的經驗、優勢，以及如何完成這個任務..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleApply}
                          disabled={submitting}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {submitting ? '提交中...' : '提交申請'}
                        </button>
                        <button
                          onClick={() => setShowApplyForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#cfdbe9] transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">任務發佈者</h3>
              <div className="flex items-center mb-4">
                <img
                  src={task.client.avatar || '/default-avatar.png'}
                  alt={task.client.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{task.client.name}</span>
                    {task.client.isVerified && (
                      <span className="ml-2 text-blue-500">✓</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    {task.client.rating} ({task.client.completedTasks} 個任務)
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                加入時間: {formatDate(task.client.joinedAt)}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <MessageCircle className="w-4 h-4 mr-2 inline" />
                聯繫發佈者
              </button>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">時間安排</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">開始日期:</span>
                  <div className="font-medium">{formatDate(task.timeline.startDate)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">結束日期:</span>
                  <div className="font-medium">{formatDate(task.timeline.endDate)}</div>
                  {calculateDaysLeft(task.timeline.endDate) > 0 && (
                    <div className="text-sm text-blue-600">
                      ({calculateDaysLeft(task.timeline.endDate)} 天後截止)
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600">預估工時:</span>
                  <div className="font-medium">{task.timeline.estimatedHours} 小時</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">任務統計</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">瀏覽次數</span>
                  <span className="font-medium">{task.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">申請人數</span>
                  <span className="font-medium">{task.applications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">發佈時間</span>
                  <span className="font-medium">{formatDate(task.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            {task.location.address && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細地點</h3>
                <div className="text-gray-700">
                  <div className="font-medium mb-1">
                    {task.location.city}
                    {task.location.district && `, ${task.location.district}`}
                  </div>
                  <div className="text-sm">{task.location.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}