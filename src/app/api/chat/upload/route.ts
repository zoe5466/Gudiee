import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getCurrentUser } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  validationErrorResponse 
} from '@/lib/api-response';

// File upload configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// POST /api/chat/upload - Upload file for chat
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const conversationId = formData.get('conversationId') as string;

    // Validation
    const errors: Record<string, string> = {};
    
    if (!file) {
      errors.file = '請選擇要上傳的檔案';
    } else {
      if (file.size > MAX_FILE_SIZE) {
        errors.file = `檔案大小不能超過 ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
      }
      
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        errors.file = '不支援的檔案類型';
      }
    }
    
    if (!conversationId) {
      errors.conversationId = '對話 ID 為必填';
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || '';
    const filename = `${timestamp}-${randomString}.${fileExtension}`;

    // Create upload directory path
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'chat', conversationId);
    const filepath = join(uploadDir, filename);

    try {
      // Ensure upload directory exists
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Generate file URL
      const fileUrl = `/uploads/chat/${conversationId}/${filename}`;
      
      // Generate thumbnail for images
      let thumbnailUrl = undefined;
      if (file.type.startsWith('image/')) {
        // In a real implementation, you would generate a thumbnail here
        // For now, we'll use the original image as thumbnail
        thumbnailUrl = fileUrl;
      }

      // Create file record in database (optional)
      // You could store file metadata in a database table here
      
      const fileData = {
        id: `file-${timestamp}-${randomString}`,
        name: file.name,
        originalName: file.name,
        url: fileUrl,
        thumbnailUrl,
        size: file.size,
        mimeType: file.type,
        uploadedBy: user.id,
        conversationId,
        uploadedAt: new Date().toISOString()
      };

      return successResponse(fileData, '檔案上傳成功');

    } catch (fileError) {
      console.error('File write error:', fileError);
      return errorResponse('檔案上傳失敗', 500);
    }

  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('檔案上傳失敗', 500);
  }
}

// GET /api/chat/upload/[filename] - Serve uploaded files (if needed)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Extract filename from URL
    const url = new URL(request.url);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop();

    if (!filename) {
      return errorResponse('檔案名稱無效', 400);
    }

    // In a production environment, you would:
    // 1. Verify user has access to this file
    // 2. Check if file belongs to a conversation the user is part of
    // 3. Serve the file with appropriate headers
    
    // For now, return a simple response
    return successResponse({ filename }, '檔案存在');

  } catch (error) {
    console.error('File access error:', error);
    return errorResponse('檔案存取失敗', 500);
  }
}