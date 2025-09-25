// 圖片上傳組件
// 功能：提供通用的圖片上傳和頭像上傳功能，支援拖放、預覽、驗證等
'use client';

import * as React from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// 通用圖片上傳組件屬性
interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // MB
  accept?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
}

// 頭像上傳組件專用屬性
interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

// 檔案驗證工具函數
const validateFile = (file: File, maxSize: number) => {
  const errors: string[] = [];
  
  if (!file.type.startsWith('image/')) {
    errors.push('請選擇圖片檔案');
  }
  
  if (file.size > maxSize * 1024 * 1024) {
    errors.push(`檔案大小不能超過 ${maxSize}MB`);
  }
  
  return errors;
};

// 檔案轉換工具函數 - 跨平台相容
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 頭像上傳組件
 * 專用於用戶頭像上傳，提供圓形預覽和簡潔界面
 */
export function AvatarUpload({
  value,
  onChange,
  size = 'md',
  disabled = false,
  className
}: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string>(value || '');
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 同步外部值變化
  React.useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    const file = files[0];
    const errors = validateFile(file, 5); // 5MB 限制
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsUploading(true);

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onChange(base64);
    } catch (error) {
      console.error('Upload error:', error);
      alert('上傳失敗，請稍後再試');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-3', className)}>
      <div 
        className={cn(
          sizeClasses[size],
          'relative rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-gray-400 transition-colors',
          disabled && 'opacity-50 cursor-not-allowed',
          preview && 'border-solid border-gray-200'
        )}
        onClick={handleClick}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Avatar preview" 
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="移除頭像"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
            ) : (
              <>
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs text-center">
                  {size === 'lg' ? '點擊上傳' : '上傳'}
                </span>
              </>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {size === 'lg' && (
        <div className="text-center">
          <p className="text-sm text-gray-600">點擊上傳頭像</p>
          <p className="text-xs text-gray-500">支援 JPG、PNG 格式，檔案不超過 5MB</p>
        </div>
      )}
    </div>
  );
}

/**
 * 通用圖片上傳組件
 * 支援多檔案上傳、拖放、預覽等功能
 */
export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSize = 5,
  accept = 'image/*',
  className,
  disabled = false,
  label,
  description,
  required = false
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 初始化預覽
  React.useEffect(() => {
    if (value) {
      const urls = Array.isArray(value) ? value : [value];
      setPreviews(urls);
    } else {
      setPreviews([]);
    }
  }, [value]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || disabled) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // 驗證檔案
    for (const file of fileArray) {
      const fileErrors = validateFile(file, maxSize);
      if (fileErrors.length > 0) {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
        continue;
      }
      validFiles.push(file);
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      if (validFiles.length === 0) return;
    }

    // 檢查檔案數量限制
    const currentFiles = Array.isArray(value) ? value.length : (value ? 1 : 0);
    if (currentFiles + validFiles.length > maxFiles) {
      alert(`最多只能上傳 ${maxFiles} 個檔案`);
      return;
    }

    setIsUploading(true);

    try {
      // 轉換檔案為 base64
      const newUrls = await Promise.all(
        validFiles.map(file => fileToBase64(file))
      );

      if (multiple) {
        const existingUrls = Array.isArray(value) ? value : (value ? [value] : []);
        const allUrls = [...existingUrls, ...newUrls];
        onChange(allUrls);
      } else {
        onChange(newUrls[0] || '');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上傳失敗，請稍後再試');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (index: number) => {
    if (disabled) return;

    if (multiple && Array.isArray(value)) {
      const newUrls = value.filter((_, i) => i !== index);
      onChange(newUrls);
    } else {
      onChange('');
    }
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 標籤 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 上傳區域 */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-lg font-medium text-gray-900 mb-2">
            {isUploading ? '上傳中...' : '點擊上傳或拖放檔案'}
          </div>
          {description && (
            <div className="text-sm text-gray-500 mb-4">
              {description}
            </div>
          )}
          <div className="text-sm text-gray-500">
            支援 JPG, PNG, GIF（最大 {maxSize}MB）
            {multiple && ` · 最多 ${maxFiles} 個檔案`}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>

      {/* 預覽區域 */}
      {previews.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-gray-700">預覽</div>
          <div className={cn(
            'grid gap-4',
            multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          )}>
            {previews.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`預覽 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label={`移除圖片 ${index + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}