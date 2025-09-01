// 性能監控和優化工具

/**
 * 性能計時器類別
 */
export class PerformanceTimer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  end(): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${this.name}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
}

/**
 * 性能監控助手函式
 */
export const perf = {
  /**
   * 測量函式執行時間
   */
  measure: <T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T => {
    return ((...args: Parameters<T>) => {
      const timer = new PerformanceTimer(name);
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => timer.end());
      } else {
        timer.end();
        return result;
      }
    }) as T;
  },

  /**
   * 測量非同步函式執行時間
   */
  measureAsync: <T extends (...args: any[]) => Promise<any>>(
    name: string,
    fn: T
  ): T => {
    return (async (...args: Parameters<T>) => {
      const timer = new PerformanceTimer(name);
      try {
        const result = await fn(...args);
        return result;
      } finally {
        timer.end();
      }
    }) as T;
  },

  /**
   * 創建計時器
   */
  timer: (name: string) => new PerformanceTimer(name),

  /**
   * 測量組件渲染時間
   */
  markComponentRender: (componentName: string) => {
    if (typeof window !== 'undefined' && window.performance?.mark) {
      window.performance.mark(`${componentName}-render-start`);
      
      return () => {
        window.performance.mark(`${componentName}-render-end`);
        window.performance.measure(
          `${componentName}-render`,
          `${componentName}-render-start`,
          `${componentName}-render-end`
        );
      };
    }
    return () => {};
  }
};

/**
 * 記憶化工具
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // 清理快取以避免記憶體洩漏
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
    
    return result;
  }) as T;
}

/**
 * 節流函式
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, delay - (now - lastCall));
    }
  }) as T;
}

/**
 * 圖片懶載入工具
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      });
    }
  }

  observe(img: HTMLImageElement): void {
    if (this.observer && img.dataset.src) {
      this.images.add(img);
      this.observer.observe(img);
    }
  }

  unobserve(img: HTMLImageElement): void {
    if (this.observer) {
      this.images.delete(img);
      this.observer.unobserve(img);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.onload = () => {
        img.classList.add('loaded');
        this.unobserve(img);
      };
      img.onerror = () => {
        img.classList.add('error');
        this.unobserve(img);
      };
    }
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

/**
 * 虛擬滾動助手
 */
export function calculateVirtualItems(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { startIndex: number; endIndex: number; totalHeight: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan);
  const totalHeight = totalItems * itemHeight;

  return { startIndex, endIndex, totalHeight };
}

/**
 * 批次更新工具
 */
export class BatchUpdater<T> {
  private queue: T[] = [];
  private isProcessing = false;
  private processor: (items: T[]) => void;
  private delay: number;

  constructor(processor: (items: T[]) => void, delay: number = 16) {
    this.processor = processor;
    this.delay = delay;
  }

  add(item: T): void {
    this.queue.push(item);
    this.scheduleProcess();
  }

  private scheduleProcess(): void {
    if (!this.isProcessing) {
      this.isProcessing = true;
      setTimeout(() => {
        const items = [...this.queue];
        this.queue.length = 0;
        this.isProcessing = false;
        
        if (items.length > 0) {
          this.processor(items);
        }
      }, this.delay);
    }
  }

  flush(): void {
    if (this.queue.length > 0) {
      const items = [...this.queue];
      this.queue.length = 0;
      this.processor(items);
    }
  }
}

/**
 * 資源預載入
 */
export const preloader = {
  /**
   * 預載入圖片
   */
  image: (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * 預載入多張圖片
   */
  images: (srcs: string[]): Promise<HTMLImageElement[]> => {
    return Promise.all(srcs.map(src => preloader.image(src)));
  },

  /**
   * 預載入 JavaScript 模組
   */
  module: (path: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = path;
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  },

  /**
   * 預載入 CSS
   */
  css: (href: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
};

/**
 * 效能監控報告
 */
export function getPerformanceReport(): {
  navigation: PerformanceNavigationTiming | null;
  paint: PerformancePaintTiming[];
  resources: PerformanceResourceTiming[];
  memory?: any;
} {
  if (typeof window === 'undefined' || !window.performance) {
    return {
      navigation: null,
      paint: [],
      resources: []
    };
  }

  const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = window.performance.getEntriesByType('paint') as PerformancePaintTiming[];
  const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  return {
    navigation,
    paint,
    resources,
    memory: (window.performance as any).memory
  };
}

/**
 * 檢測效能瓶頸
 */
export function detectPerformanceBottlenecks(): string[] {
  const issues: string[] = [];
  const report = getPerformanceReport();

  if (report.navigation) {
    // DNS 查詢時間
    const dnsTime = report.navigation.domainLookupEnd - report.navigation.domainLookupStart;
    if (dnsTime > 100) {
      issues.push(`DNS 查詢時間過長: ${dnsTime.toFixed(2)}ms`);
    }

    // TCP 連接時間
    const tcpTime = report.navigation.connectEnd - report.navigation.connectStart;
    if (tcpTime > 200) {
      issues.push(`TCP 連接時間過長: ${tcpTime.toFixed(2)}ms`);
    }

    // 首字節時間 (TTFB)
    const ttfb = report.navigation.responseStart - report.navigation.requestStart;
    if (ttfb > 600) {
      issues.push(`首字節時間過長: ${ttfb.toFixed(2)}ms`);
    }

    // DOM 載入時間
    const domLoadTime = report.navigation.domContentLoadedEventEnd - report.navigation.loadEventStart;
    if (domLoadTime > 3000) {
      issues.push(`DOM 載入時間過長: ${domLoadTime.toFixed(2)}ms`);
    }
  }

  // 大型資源檢測
  report.resources.forEach(resource => {
    if (resource.transferSize > 1024 * 1024) { // 1MB
      issues.push(`大型資源: ${resource.name} (${(resource.transferSize / 1024 / 1024).toFixed(2)}MB)`);
    }
  });

  return issues;
}