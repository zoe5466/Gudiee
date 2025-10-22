// 任務分配 API 路由
// 功能：處理任務分配給工作者

import { NextRequest } from 'next/server';
import { taskStorage } from '@/lib/mock-tasks';

/**
 * POST /api/tasks/[id]/assign - 分配任務給工作者
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const body = await request.json();
    
    // 模擬用戶認證
    const mockClientId = 'client-123';

    const { workerId } = body;

    // 輸入驗證
    if (!workerId) {
      return Response.json({
        success: false,
        error: '缺少工作者ID',
        message: '請指定要分配的工作者'
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

    // 檢查權限（只有任務發佈者可以分配）
    if (task.clientId !== mockClientId) {
      return Response.json({
        success: false,
        error: '權限不足',
        message: '您沒有權限分配此任務'
      }, { status: 403 });
    }

    // 檢查任務狀態
    if (task.status !== 'OPEN') {
      return Response.json({
        success: false,
        error: '任務不可分配',
        message: '此任務目前不可分配'
      }, { status: 400 });
    }

    // 檢查工作者是否有申請此任務
    const applicant = task.applicants.find(app => app.workerId === workerId);
    if (!applicant) {
      return Response.json({
        success: false,
        error: '工作者未申請',
        message: '指定的工作者未申請此任務'
      }, { status: 400 });
    }

    // 分配任務
    const success = taskStorage.assignTask(taskId, workerId);

    if (!success) {
      return Response.json({
        success: false,
        error: '分配失敗',
        message: '任務分配失敗'
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: '任務分配成功'
    });

  } catch (error) {
    console.error('Assign task error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '分配任務失敗'
    }, { status: 500 });
  }
}