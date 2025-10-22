// 任務詳情 API 路由
// 功能：處理單一任務的查詢、更新、申請等操作

import { NextRequest } from 'next/server';
import { taskStorage } from '@/lib/mock-tasks';

/**
 * GET /api/tasks/[id] - 獲取任務詳情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    
    // 增加瀏覽次數
    taskStorage.incrementViews(taskId);
    
    // 獲取任務詳情
    const task = taskStorage.getById(taskId);
    
    if (!task) {
      return Response.json({
        success: false,
        error: '任務不存在',
        message: '找不到指定的任務'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: task,
      message: '任務詳情獲取成功'
    });

  } catch (error) {
    console.error('Get task detail error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '獲取任務詳情失敗'
    }, { status: 500 });
  }
}

/**
 * PUT /api/tasks/[id] - 更新任務
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const body = await request.json();
    
    // 模擬用戶認證和權限檢查
    const mockUserId = 'client-123';
    const task = taskStorage.getById(taskId);
    
    if (!task) {
      return Response.json({
        success: false,
        error: '任務不存在',
        message: '找不到指定的任務'
      }, { status: 404 });
    }

    // 檢查是否為任務擁有者
    if (task.clientId !== mockUserId) {
      return Response.json({
        success: false,
        error: '權限不足',
        message: '您沒有權限修改此任務'
      }, { status: 403 });
    }

    // 更新任務
    const updatedTask = taskStorage.update(taskId, body);
    
    if (!updatedTask) {
      return Response.json({
        success: false,
        error: '更新失敗',
        message: '任務更新失敗'
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      data: updatedTask,
      message: '任務更新成功'
    });

  } catch (error) {
    console.error('Update task error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '更新任務失敗'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/tasks/[id] - 刪除任務
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    
    // 模擬用戶認證和權限檢查
    const mockUserId = 'client-123';
    const task = taskStorage.getById(taskId);
    
    if (!task) {
      return Response.json({
        success: false,
        error: '任務不存在',
        message: '找不到指定的任務'
      }, { status: 404 });
    }

    // 檢查是否為任務擁有者
    if (task.clientId !== mockUserId) {
      return Response.json({
        success: false,
        error: '權限不足',
        message: '您沒有權限刪除此任務'
      }, { status: 403 });
    }

    // 檢查任務狀態（進行中的任務不能刪除）
    if (task.status === 'IN_PROGRESS') {
      return Response.json({
        success: false,
        error: '無法刪除',
        message: '進行中的任務無法刪除'
      }, { status: 400 });
    }

    // 刪除任務
    const deleted = taskStorage.delete(taskId);
    
    if (!deleted) {
      return Response.json({
        success: false,
        error: '刪除失敗',
        message: '任務刪除失敗'
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: '任務刪除成功'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
      message: '刪除任務失敗'
    }, { status: 500 });
  }
}