// 任務管理 API 路由
// 功能：處理任務的創建、查詢、更新等操作

import { NextRequest } from 'next/server';
import { taskStorage } from '@/lib/mock-tasks';

export const dynamic = 'force-dynamic';

/**
 * GET /api/tasks - 獲取任務列表
 */
export async function GET(request: NextRequest) {
  try {
    // 模擬用戶認證
    const mockUserId = 'client-123';
    
    // 解析查詢參數
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const location = searchParams.get('location');
    const budgetMin = searchParams.get('budgetMin') ? parseFloat(searchParams.get('budgetMin')!) : undefined;
    const budgetMax = searchParams.get('budgetMax') ? parseFloat(searchParams.get('budgetMax')!) : undefined;
    const skills = searchParams.get('skills')?.split(',');
    const sortBy = (searchParams.get('sortBy') as any) || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const my = searchParams.get('my') === 'true'; // 檢查是否查詢我的任務

    // 搜尋任務
    const allTasks = taskStorage.search({
      query: query || undefined,
      category: category || undefined,
      type: type || undefined,
      status: status || undefined,
      priority: priority || undefined,
      location: location || undefined,
      budgetMin,
      budgetMax,
      skills,
      sortBy,
      clientId: my ? mockUserId : undefined // 如果是查詢我的任務，則按客戶ID過濾
    });

    // 分頁處理
    const total = allTasks.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const tasks = allTasks.slice(startIndex, endIndex);

    return Response.json({
      success: true,
      data: tasks,
      message: '任務列表獲取成功',
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '獲取任務列表失敗'
    }, { status: 500 });
  }
}

/**
 * POST /api/tasks - 創建新任務
 */
export async function POST(request: NextRequest) {
  try {
    // 模擬用戶認證
    const mockUserId = 'client-123';

    // 解析請求資料
    const body = await request.json();
    const {
      title,
      description,
      category,
      type,
      priority,
      budget,
      location,
      timeline,
      requirements,
      skills,
      languages,
      tags
    } = body;

    // 輸入驗證
    const errors: Record<string, string> = {};
    
    if (!title || title.trim().length < 5) {
      errors.title = '任務標題至少需要5個字元';
    }
    if (!description || description.trim().length < 20) {
      errors.description = '任務描述至少需要20個字元';
    }
    if (!category) {
      errors.category = '請選擇任務分類';
    }
    if (!budget || !budget.min || !budget.max || budget.min <= 0 || budget.max <= 0) {
      errors.budget = '請設定有效的預算範圍';
    }
    if (budget && budget.min > budget.max) {
      errors.budget = '最低預算不能大於最高預算';
    }
    if (!location || !location.city) {
      errors.location = '請提供任務地點';
    }
    if (!timeline || !timeline.startDate || !timeline.endDate) {
      errors.timeline = '請設定任務時間';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({
        success: false,
        errors,
        message: '輸入驗證失敗'
      }, { status: 400 });
    }

    // 創建新任務
    const newTask = taskStorage.add({
      title: title.trim(),
      description: description.trim(),
      category,
      type: type || 'normal',
      status: 'OPEN',
      priority: priority || 'medium',
      budget: {
        min: parseFloat(budget.min),
        max: parseFloat(budget.max),
        currency: budget.currency || 'TWD'
      },
      location: {
        city: location.city,
        district: location.district || undefined,
        address: location.address || undefined,
        coordinates: location.coordinates || undefined
      },
      timeline: {
        startDate: timeline.startDate,
        endDate: timeline.endDate,
        estimatedHours: parseInt(timeline.estimatedHours) || 8
      },
      requirements: Array.isArray(requirements) ? requirements.filter(r => r.trim()) : [],
      skills: Array.isArray(skills) ? skills.filter(s => s.trim()) : [],
      languages: Array.isArray(languages) ? languages.filter(l => l.trim()) : [],
      clientId: mockUserId,
      applicants: [],
      client: {
        id: mockUserId,
        name: '測試用戶',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        rating: 4.5,
        completedTasks: 12,
        isVerified: true,
        joinedAt: '2023-12-01T09:00:00Z'
      },
      attachments: [],
      tags: Array.isArray(tags) ? tags.filter(t => t.trim()) : []
    });

    return Response.json({
      success: true,
      data: newTask,
      message: '任務創建成功'
    });

  } catch (error) {
    console.error('Create task error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '創建任務失敗'
    }, { status: 500 });
  }
}