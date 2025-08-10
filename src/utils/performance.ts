/**
 * Performance Monitoring Utilities for Zuno Learning App
 * 
 * This module provides utilities for monitoring and optimizing
 * application performance, especially around code splitting and loading.
 */

// Performance metrics interface
interface PerformanceMetrics {
  componentName: string;
  loadTime: number;
  timestamp: number;
  route?: string;
}

// Store performance metrics
const performanceMetrics: PerformanceMetrics[] = [];

// Measure component load time
export const measureComponentLoad = (componentName: string, route?: string) => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      const metric: PerformanceMetrics = {
        componentName,
        loadTime,
        timestamp: Date.now(),
        route
      };
      
      performanceMetrics.push(metric);
      
      // Log slow components in development
      if (process.env.NODE_ENV === 'development' && loadTime > 100) {
        console.warn(`⚠️ Slow component load: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }
      
      return metric;
    }
  };
};

// Get performance metrics
export const getPerformanceMetrics = () => {
  return [...performanceMetrics];
};

// Get average load time for a component
export const getAverageLoadTime = (componentName: string) => {
  const componentMetrics = performanceMetrics.filter(m => m.componentName === componentName);
  if (componentMetrics.length === 0) return 0;
  
  const totalTime = componentMetrics.reduce((sum, metric) => sum + metric.loadTime, 0);
  return totalTime / componentMetrics.length;
};

// Clear performance metrics
export const clearPerformanceMetrics = () => {
  performanceMetrics.length = 0;
};

// Report performance summary
export const reportPerformanceSummary = () => {
  if (performanceMetrics.length === 0) {
    console.log('📊 No performance metrics available');
    return;
  }
  
  console.log('📊 Performance Summary:');
  console.log('─'.repeat(50));
  
  const componentStats = new Map<string, { count: number; totalTime: number; maxTime: number }>();
  
  performanceMetrics.forEach(metric => {
    const stats = componentStats.get(metric.componentName) || { count: 0, totalTime: 0, maxTime: 0 };
    stats.count++;
    stats.totalTime += metric.loadTime;
    stats.maxTime = Math.max(stats.maxTime, metric.loadTime);
    componentStats.set(metric.componentName, stats);
  });
  
  Array.from(componentStats.entries())
    .sort(([,a], [,b]) => (b.totalTime / b.count) - (a.totalTime / a.count))
    .forEach(([componentName, stats]) => {
      const avgTime = stats.totalTime / stats.count;
      const status = avgTime > 100 ? '⚠️ ' : avgTime > 50 ? '⚡' : '✅';
      console.log(`${status} ${componentName.padEnd(25)} avg: ${avgTime.toFixed(1)}ms (${stats.count} loads)`);
    });
};

// Web Vitals monitoring (if available)
export const initWebVitalsMonitoring = () => {
  // Monitor Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`🎯 LCP: ${entry.startTime.toFixed(2)}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }
};

// Bundle size estimation
export const estimateBundleImpact = (componentName: string, estimatedSizeKB: number) => {
  console.log(`📦 ${componentName}: ~${estimatedSizeKB}KB impact`);
  
  if (estimatedSizeKB > 100) {
    console.warn(`⚠️ Large component: ${componentName} (${estimatedSizeKB}KB) - consider further splitting`);
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Performance monitoring initialized');
    initWebVitalsMonitoring();
    
    // Report summary every 30 seconds in development
    setInterval(() => {
      if (performanceMetrics.length > 0) {
        reportPerformanceSummary();
      }
    }, 30000);
  }
};