'use client';

import * as React from 'react';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize previews
  React.useEffect(() => {
    if (value) {
      const urls = Array.isArray(value) ? value : [value];
      setPreviews(urls);
    } else {
      setPreviews([]);
    }
  }, [value]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || disabled) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    // Validate files
    for (const file of fileArray) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`檔案 ${file.name} 超過 ${maxSize}MB 限制`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        alert(`檔案 ${file.name} 不是有效的圖片格式`);
        continue;
      }

      validFiles.push(file);
    }

    // Check max files limit
    const currentFiles = Array.isArray(value) ? value.length : (value ? 1 : 0);
    if (currentFiles + validFiles.length > maxFiles) {
      alert(`最多只能上傳 ${maxFiles} 個檔案`);
      return;
    }

    // Convert files to URLs (in real app, upload to server)
    const newUrls: string[] = [];
    validFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      newUrls.push(url);
    });

    if (multiple) {
      const existingUrls = Array.isArray(value) ? value : (value ? [value] : []);
      const allUrls = [...existingUrls, ...newUrls];
      onChange(allUrls);
    } else {
      onChange(newUrls[0] || '');
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

  const handleDragLeave = () => {
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
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragOver
            ? 'border-[#FF5A5F] bg-red-50'
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
            點擊上傳或拖放檔案
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
          disabled={disabled}
        />
      </div>

      {/* Preview */}
      {previews.length > 0 && (
        <div className="space-y-2">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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

// Avatar Upload Component
interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function AvatarUpload({
  value,
  onChange,
  size = 'md',
  className,
  disabled = false
}: AvatarUploadProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    const file = files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('檔案大小不能超過 2MB');
      return;
    }

    const url = URL.createObjectURL(file);
    onChange(url);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-sm font-medium text-gray-700">個人頭像</div>
      
      <div className="flex items-center space-x-4">
        <div 
          className={cn(
            'relative rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200',
            sizeClasses[size],
            !disabled && 'cursor-pointer hover:border-gray-300'
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {value ? (
            <img
              src={value}
              alt="頭像"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Upload className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500">
          <div>建議尺寸 400x400px</div>
          <div>檔案大小不超過 2MB</div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}