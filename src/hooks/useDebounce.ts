// 防抖功能 React Hook
// 功能：提供值防抖和回調函數防抖功能，用於優化搜尋、輸入等高頻操作的性能
import { useState, useEffect } from 'react'; // React Hooks

/**
 * 防抖 hook - 延遲執行值的更新
 * @param value 要防抖的值
 * @param delay 延遲時間（毫秒）
 * @returns 防抖後的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 防抖回調 hook - 延遲執行函式
 * @param callback 要防抖的函式
 * @param delay 延遲時間（毫秒）
 * @param deps 依賴項目
 * @returns 防抖後的函式
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(timer);
  }) as T;

  return debouncedCallback;
}