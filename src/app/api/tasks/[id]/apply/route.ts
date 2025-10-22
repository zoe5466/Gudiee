// 任務申請 API 路由
// 功能：處理任務申請相關操作

import { NextRequest } from 'next/server';
import { taskStorage } from '@/lib/mock-tasks';

/**
 * POST /api/tasks/[id]/apply - 申請任務
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const body = await request.json();
    
    // 模擬用戶認證
    const mockWorkerId = 'worker-123';
    const mockWorkerName = '專業工作者';
    const mockWorkerAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
    const mockWorkerRating = 4.7;
    const mockWorkerCompletedTasks = 45;

    const { proposedPrice, message } = body;

    // 輸入驗證
    const errors: Record<string, string> = {};
    
    if (!proposedPrice || proposedPrice <= 0) {
      errors.proposedPrice = '請提供有效的報價';
    }
    if (!message || message.trim().length < 10) {
      errors.message = '申請訊息至少需要10個字元';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({
        success: false,
        errors,
        message: '輸入驗證失敗'
      }, { status: 400 });
    }

    // 檢查任務是否存在
    const task = taskStorage.getById(taskId);
    if (!task) {
      return Response.json({
        success: false,
        error: '任務不存在',
        message: '找不到指定的任務'
      }, { status: 404 });
    }

    // 檢查任務狀態
    if (task.status !== 'OPEN') {
      return Response.json({
        success: false,
        error: '任務不可申請',
        message: '此任務目前不接受申請'
      }, { status: 400 });
    }

    // 檢查是否已經申請過
    const alreadyApplied = task.applicants.some(app => app.workerId === mockWorkerId);
    if (alreadyApplied) {
      return Response.json({
        success: false,
        error: '重複申請',
        message: '您已經申請過此任務'
      }, { status: 400 });
    }

    // 檢查是否為任務發佈者
    if (task.clientId === mockWorkerId) {
      return Response.json({
        success: false,
        error: '不能申請自己的任務',
        message: '任務發佈者不能申請自己的任務'
      }, { status: 400 });
    }

    // 申請任務
    const success = taskStorage.applyToTask(taskId, {
      workerId: mockWorkerId,
      workerName: mockWorkerName,
      workerAvatar: mockWorkerAvatar,
      proposedPrice: parseFloat(proposedPrice),
      message: message.trim(),
      rating: mockWorkerRating,
      completedTasks: mockWorkerCompletedTasks
    });

    if (!success) {
      return Response.json({
        success: false,
        error: '申請失敗',
        message: '任務申請失敗'
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: '任務申請成功'
    });

  } catch (error) {
    console.error('Apply task error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '申請任務失敗'
    }, { status: 500 });
  }
}