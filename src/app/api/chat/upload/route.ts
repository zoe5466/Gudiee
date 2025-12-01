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

// Whitelist of allowed file extensions (lowercase)
const ALLOWED_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  'pdf',
  'txt',
  'doc', 'docx'
];

// Validate file extension
function isValidFileExtension(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return ALLOWED_EXTENSIONS.includes(ext) && ext.length > 0;
}

// Sanitize filename to prevent path traversal
function sanitizeFilename(filename: string): string {
  // Remove any path separators and dangerous characters
  return filename
    .replace(/\.\./g, '')     // Remove .. for directory traversal prevention
    .replace(/\//g, '')       // Remove forward slashes
    .replace(/\\/g, '')       // Remove backslashes
    .replace(/[<>:"|?*]/g, '') // Remove invalid filename characters
    .trim();
}

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

      // Validate file extension
      if (!isValidFileExtension(file.name)) {
        errors.file = '不支援的檔案副檔名';
      }
    }

    if (!conversationId) {
      errors.conversationId = '對話 ID 為必填';
    }

    // Validate conversationId format (prevent directory traversal)
    if (conversationId && (conversationId.includes('..') || conversationId.includes('/') || conversationId.includes('\\'))) {
      errors.conversationId = '對話 ID 格式無效';
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    // Generate unique filename with sanitization
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const sanitizedOriginalName = sanitizeFilename(file.name);
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

      // Security check: ensure filepath is within uploadDir
      const resolvedPath = require('path').resolve(filepath);
      const resolvedUploadDir = require('path').resolve(uploadDir);
      if (!resolvedPath.startsWith(resolvedUploadDir)) {
        return errorResponse('檔案上傳路徑無效', 400);
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
        name: sanitizedOriginalName,
        originalName: sanitizedOriginalName,
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
      return errorResponse('檔案上傳失敗', 500);
    }

  } catch (error) {
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
    return errorResponse('檔案存取失敗', 500);
  }
}