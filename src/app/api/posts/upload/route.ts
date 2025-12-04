import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Media upload configuration
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_IMAGES_PER_POST = 20

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
]

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime' // .mov files
]

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov']

// Validate file extension
function isValidImageExtension(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return ALLOWED_IMAGE_EXTENSIONS.includes(ext) && ext.length > 0
}

function isValidVideoExtension(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return ALLOWED_VIDEO_EXTENSIONS.includes(ext) && ext.length > 0
}

// Sanitize filename to prevent path traversal
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\.\./g, '')
    .replace(/\//g, '')
    .replace(/\\/g, '')
    .replace(/[<>:"|?*]/g, '')
    .trim()
}

/**
 * POST /api/posts/upload
 * 上傳貼文媒體（圖片和影片）
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授權的請求' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    // Validation
    const errors: string[] = []

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: '請選擇要上傳的檔案' },
        { status: 400 }
      )
    }

    if (files.length > MAX_IMAGES_PER_POST) {
      return NextResponse.json(
        {
          success: false,
          error: `最多只能上傳 ${MAX_IMAGES_PER_POST} 個檔案`
        },
        { status: 400 }
      )
    }

    const uploadedFiles: any[] = []

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file) continue

      // Determine file type
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

      if (!isImage && !isVideo) {
        errors.push(`檔案 ${i + 1} (${file.name}): 不支援的檔案類型`)
        continue
      }

      // Validate file extension
      if (isImage && !isValidImageExtension(file.name)) {
        errors.push(`檔案 ${i + 1} (${file.name}): 不支援的圖片副檔名`)
        continue
      }

      if (isVideo && !isValidVideoExtension(file.name)) {
        errors.push(`檔案 ${i + 1} (${file.name}): 不支援的影片副檔名`)
        continue
      }

      // Validate file size
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
      if (file.size > maxSize) {
        const maxSizeMB = Math.floor(maxSize / (1024 * 1024))
        errors.push(
          `檔案 ${i + 1} (${file.name}): 檔案大小不能超過 ${maxSizeMB}MB`
        )
        continue
      }

      try {
        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
        const sanitizedOriginalName = sanitizeFilename(file.name)
        const filename = `${timestamp}-${randomString}.${fileExtension}`

        // Create upload directory path
        const mediaType = isImage ? 'images' : 'videos'
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'posts', mediaType)
        const filepath = join(uploadDir, filename)

        // Ensure upload directory exists
        const fs = require('fs')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        // Security check: ensure filepath is within uploadDir
        const resolvedPath = require('path').resolve(filepath)
        const resolvedUploadDir = require('path').resolve(uploadDir)
        if (!resolvedPath.startsWith(resolvedUploadDir)) {
          errors.push(`檔案 ${i + 1} (${file.name}): 上傳路徑無效`)
          continue
        }

        // Write file to disk
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Generate file URL
        const fileUrl = `/uploads/posts/${mediaType}/${filename}`

        uploadedFiles.push({
          id: `file-${timestamp}-${randomString}`,
          name: sanitizedOriginalName,
          url: fileUrl,
          type: isImage ? 'image' : 'video',
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString()
        })
      } catch (fileError) {
        console.error(`Error processing file ${i + 1}:`, fileError)
        errors.push(`檔案 ${i + 1} (${file.name}): 上傳失敗`)
      }
    }

    // Return response
    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '沒有檔案成功上傳',
          details: errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `成功上傳 ${uploadedFiles.length} 個檔案`,
      data: {
        files: uploadedFiles,
        successCount: uploadedFiles.length,
        failureCount: errors.length,
        errors: errors.length > 0 ? errors : undefined
      }
    })
  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json(
      { success: false, error: '媒體上傳失敗' },
      { status: 500 }
    )
  }
}
