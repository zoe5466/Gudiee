'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showSizeChanger?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showSizeChanger = false,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // 顯示的頁碼數量

    if (totalPages <= showPages) {
      // 如果總頁數小於等於顯示頁數，顯示所有頁碼
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 總是顯示第一頁
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // 顯示當前頁周圍的頁碼
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // 總是顯示最後一頁
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg border transition-colors',
            currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-[#cfdbe9] hover:border-gray-400'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="flex items-center justify-center w-8 h-8 text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'border-[#002C56] bg-[#002C56] text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-[#cfdbe9] hover:border-gray-400'
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg border transition-colors',
            currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-[#cfdbe9] hover:border-gray-400'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Page Size Changer */}
      {showSizeChanger && onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">每頁顯示</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#002C56] focus:border-[#002C56]"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">筆</span>
        </div>
      )}
    </div>
  );
}

// Simple Pagination (Load More style)
interface SimplePaginationProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function SimplePagination({
  hasMore,
  loading,
  onLoadMore,
  className
}: SimplePaginationProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="btn btn-secondary btn-md"
        >
          {loading ? '載入中...' : '載入更多'}
        </button>
      )}
    </div>
  );
}