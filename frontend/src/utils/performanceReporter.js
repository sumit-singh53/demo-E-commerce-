/**
 * Performance Reporter for Core Web Vitals
 * Measures and reports LCP, FID, CLS, and other performance metrics
 */

// Import web-vitals library functions (would need to be installed in real implementation)
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class PerformanceReporter {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      LCP: 2500, // 2.5 seconds
      FID: 100,  // 100ms
      CLS: 0.1,  // 0.1
      FCP: 1800, // 1.8 seconds
      TTFB: 800, // 800ms
    };
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();

    // Monitor custom metrics
    this.observeResourceTiming();
    this.observeLongTasks();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.LCP = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observation failed:', error);
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.FID);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID observation failed:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.metrics.CLS = clsValue;
        this.reportMetric('CLS', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS observation failed:', error);
    }
  }

  /**
   * Observe First Contentful Paint
   */
  observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            this.reportMetric('FCP', entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('FCP observation failed:', error);
    }
  }

  /**
   * Observe Time to First Byte
   */
  observeTTFB() {
    if (!('performance' in window) || !performance.timing) return;

    try {
      const ttfb = performance.timing.responseStart - performance.timing.requestStart;
      this.metrics.TTFB = ttfb;
      this.reportMetric('TTFB', ttfb);
    } catch (error) {
      console.warn('TTFB measurement failed:', error);
    }
  }

  /**
   * Observe resource loading performance
   */
  observeResourceTiming() {
    if (!('performance' in window)) return;

    try {
      const resources = performance.getEntriesByType('resource');
      const criticalResources = resources.filter(resource => 
        resource.name.includes('.css') || 
        resource.name.includes('.js') ||
        resource.name.includes('.woff')
      );

      criticalResources.forEach(resource => {
        const loadTime = resource.responseEnd - resource.startTime;
        if (loadTime > 1000) { // Over 1 second
          console.warn(`Slow resource loading: ${resource.name} took ${loadTime}ms`);
        }
      });

      this.metrics.resourceCount = resources.length;
      this.metrics.criticalResourceCount = criticalResources.length;
    } catch (error) {
      console.warn('Resource timing observation failed:', error);
    }
  }

  /**
   * Observe long tasks that block the main thread
   */
  observeLongTasks() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) { // Tasks over 50ms
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Long task observation failed:', error);
    }
  }

  /**
   * Report a performance metric
   */
  reportMetric(name, value) {
    const threshold = this.thresholds[name];
    const status = threshold && value > threshold ? '❌ POOR' : '✅ GOOD';
    
    console.log(`📊 ${name}: ${Math.round(value)}${name === 'CLS' ? '' : 'ms'} ${status}`);

    // In a real application, you would send this data to your analytics service
    // analytics.track('performance_metric', { name, value, threshold, status });
  }

  /**
   * Get all collected metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Generate a performance report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.getMetrics(),
      thresholds: this.thresholds,
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
      } : null,
      deviceMemory: navigator.deviceMemory || null,
    };

    console.table(report.metrics);
    return report;
  }
}

// Create singleton instance
const performanceReporter = new PerformanceReporter();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Wait for page load to start monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceReporter.init();
    });
  } else {
    performanceReporter.init();
  }

  // Generate report after page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceReporter.generateReport();
    }, 5000); // Wait 5 seconds after load
  });
}

export default performanceReporter;
export { PerformanceReporter };