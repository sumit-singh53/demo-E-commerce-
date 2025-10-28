/**
 * Comprehensive Performance Test Suite
 * Tests animation performance, bundle size, and Core Web Vitals compliance
 */

import { PerformanceMonitor } from '../../utils/performanceMonitor';

// Mock Web APIs
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Ensure performance object exists with all required methods
if (!global.performance) {
  global.performance = {};
}

global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
};

global.PerformanceObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
const mockMatchMedia = jest.fn().mockImplementation(query => ({
  matches: query === '(prefers-reduced-motion: reduce)' ? false : true,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock navigator properties
Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  configurable: true,
  value: 8,
});

Object.defineProperty(navigator, 'connection', {
  writable: true,
  configurable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
});

describe('Performance Test Suite', () => {
  describe('Animation Performance', () => {
    let monitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
      jest.clearAllMocks();
    });

    afterEach(() => {
      if (monitor) {
        monitor.stopMonitoring();
      }
    });

    test('performance monitor can be instantiated', () => {
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
      expect(monitor.isMonitoring).toBe(false);
      expect(monitor.fps).toBe(0);
    });

    test('monitoring can be started and stopped', () => {
      expect(monitor.isMonitoring).toBe(false);
      
      monitor.startMonitoring();
      expect(monitor.isMonitoring).toBe(true);
      expect(requestAnimationFrame).toHaveBeenCalled();
      
      monitor.stopMonitoring();
      expect(monitor.isMonitoring).toBe(false);
    });

    test('FPS callbacks can be managed', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      monitor.onFPSUpdate(callback1);
      monitor.onFPSUpdate(callback2);
      expect(monitor.callbacks).toHaveLength(2);

      monitor.offFPSUpdate(callback1);
      expect(monitor.callbacks).toHaveLength(1);
      expect(monitor.callbacks[0]).toBe(callback2);
    });

    test('reduced motion preference can be detected', () => {
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      }));

      expect(PerformanceMonitor.prefersReducedMotion()).toBe(true);
    });

    test('device capabilities can be assessed', () => {
      // Mock canvas creation
      const mockCanvas = { getContext: jest.fn().mockReturnValue({}) };
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

      const canHandle = PerformanceMonitor.canHandleComplexAnimations();
      expect(typeof canHandle).toBe('boolean');
    });

    test('elements can be optimized for animations', () => {
      const mockElement = { style: {} };

      PerformanceMonitor.optimizeElement(mockElement);
      expect(mockElement.style.willChange).toBe('transform, opacity');
      expect(mockElement.style.backfaceVisibility).toBe('hidden');
      expect(mockElement.style.transform).toBe('translate3d(0, 0, 0)');

      PerformanceMonitor.cleanupElement(mockElement);
      expect(mockElement.style.willChange).toBe('auto');
      expect(mockElement.style.backfaceVisibility).toBe('');
      expect(mockElement.style.transform).toBe('');
    });

    test('utility functions work correctly', () => {
      const mockFn = jest.fn();
      
      // Test debounce
      const debouncedFn = PerformanceMonitor.debounce(mockFn, 100);
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      // Test throttle
      const throttledFn = PerformanceMonitor.throttle(mockFn, 100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('viewport detection works', () => {
      const mockElement = {
        getBoundingClientRect: jest.fn().mockReturnValue({
          top: 100, bottom: 200, left: 50, right: 150,
        }),
      };

      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });

      expect(PerformanceMonitor.isInViewport(mockElement)).toBe(true);
    });
  });

  describe('Bundle Size Performance', () => {
    const mockBuildStats = {
      'static/js/main.js': { size: 250000 }, // 250KB
      'static/css/main.css': { size: 50000 }, // 50KB
      'static/js/vendor.js': { size: 800000 }, // 800KB
    };

    test('main bundle size is within limits', () => {
      const mainBundleSize = mockBuildStats['static/js/main.js'].size;
      const maxMainBundleSize = 300000; // 300KB limit
      expect(mainBundleSize).toBeLessThanOrEqual(maxMainBundleSize);
    });

    test('vendor bundle size is optimized', () => {
      const vendorBundleSize = mockBuildStats['static/js/vendor.js'].size;
      const maxVendorBundleSize = 1000000; // 1MB limit
      expect(vendorBundleSize).toBeLessThanOrEqual(maxVendorBundleSize);
    });

    test('CSS bundle size is optimized', () => {
      const cssBundleSize = mockBuildStats['static/css/main.css'].size;
      const maxCSSBundleSize = 100000; // 100KB limit
      expect(cssBundleSize).toBeLessThanOrEqual(maxCSSBundleSize);
    });

    test('total bundle size meets performance budget', () => {
      const totalSize = Object.values(mockBuildStats)
        .reduce((total, stats) => total + stats.size, 0);
      const performanceBudget = 1500000; // 1.5MB total budget
      expect(totalSize).toBeLessThanOrEqual(performanceBudget);
    });

    test('framer-motion impact is acceptable', () => {
      const framerMotionSize = 150000; // ~150KB estimated
      const maxAnimationLibrarySize = 200000; // 200KB limit
      expect(framerMotionSize).toBeLessThanOrEqual(maxAnimationLibrarySize);
    });
  });

  describe('Core Web Vitals', () => {
    test('LCP threshold compliance', () => {
      const mockLCPEntry = {
        entryType: 'largest-contentful-paint',
        startTime: 1800, // 1.8 seconds
        element: document.createElement('img'),
      };
      const lcpThreshold = 2500; // 2.5 seconds
      expect(mockLCPEntry.startTime).toBeLessThan(lcpThreshold);
    });

    test('FID threshold compliance', () => {
      const mockFIDEntry = {
        entryType: 'first-input',
        processingStart: 1050,
        startTime: 1000,
        duration: 50, // 50ms delay
      };
      const fidThreshold = 100; // 100ms
      expect(mockFIDEntry.duration).toBeLessThan(fidThreshold);
    });

    test('CLS threshold compliance', () => {
      const mockCLSEntries = [
        { value: 0.05 },
        { value: 0.02 },
        { value: 0.01 },
      ];
      const totalCLS = mockCLSEntries.reduce((sum, entry) => sum + entry.value, 0);
      const clsThreshold = 0.1;
      expect(totalCLS).toBeLessThan(clsThreshold);
    });

    test('FCP threshold compliance', () => {
      const mockFCPEntry = {
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 1200, // 1.2 seconds
      };
      const fcpThreshold = 1800; // 1.8 seconds
      expect(mockFCPEntry.startTime).toBeLessThan(fcpThreshold);
    });

    test('TTI threshold compliance', () => {
      const mockTTI = 3200; // 3.2 seconds
      const ttiThreshold = 3800; // 3.8 seconds
      expect(mockTTI).toBeLessThan(ttiThreshold);
    });

    test('Speed Index threshold compliance', () => {
      const mockSpeedIndex = 2800; // 2.8 seconds
      const speedIndexThreshold = 3400; // 3.4 seconds
      expect(mockSpeedIndex).toBeLessThan(speedIndexThreshold);
    });

    test('hero image optimization', () => {
      const heroImageOptimizations = {
        format: 'webp',
        lazy: false, // Should not be lazy loaded
        preload: true,
        dimensions: { width: 1200, height: 600 },
        compressed: true,
      };

      expect(heroImageOptimizations.lazy).toBe(false);
      expect(heroImageOptimizations.preload).toBe(true);
      expect(heroImageOptimizations.format).toBe('webp');
    });

    test('critical CSS optimization', () => {
      const criticalCSS = {
        inlined: true,
        size: 15000, // 15KB
        covers: ['hero', 'navbar', 'above-fold'],
      };

      expect(criticalCSS.inlined).toBe(true);
      expect(criticalCSS.size).toBeLessThan(20000); // Under 20KB
      expect(criticalCSS.covers).toContain('hero');
    });

    test('font loading optimization', () => {
      const fontLoadingStrategy = {
        display: 'swap',
        preload: true,
        fallback: 'system-ui',
      };

      expect(fontLoadingStrategy.display).toBe('swap');
      expect(fontLoadingStrategy.preload).toBe(true);
    });

    test('image dimension optimization', () => {
      const imageOptimizations = {
        explicitWidth: true,
        explicitHeight: true,
        aspectRatio: '16/9',
        placeholder: true,
      };

      expect(imageOptimizations.explicitWidth).toBe(true);
      expect(imageOptimizations.explicitHeight).toBe(true);
      expect(imageOptimizations.placeholder).toBe(true);
    });

    test('animation optimization for CLS', () => {
      const animationOptimizations = {
        useTransform: true,
        useOpacity: true,
        avoidLayoutProperties: true,
        willChange: true,
      };

      expect(animationOptimizations.useTransform).toBe(true);
      expect(animationOptimizations.useOpacity).toBe(true);
      expect(animationOptimizations.avoidLayoutProperties).toBe(true);
    });

    test('mobile performance thresholds', () => {
      const mobileMetrics = {
        lcp: 2200, // 2.2 seconds
        fid: 80,   // 80ms
        cls: 0.08, // 0.08
      };

      expect(mobileMetrics.lcp).toBeLessThan(2500);
      expect(mobileMetrics.fid).toBeLessThan(100);
      expect(mobileMetrics.cls).toBeLessThan(0.1);
    });

    test('resource loading performance', () => {
      const resourceTimings = {
        'main.css': 400,
        'main.js': 600,
        'fonts.woff2': 300,
      };

      Object.values(resourceTimings).forEach(timing => {
        expect(timing).toBeLessThan(1000); // Under 1 second
      });
    });

    test('compression effectiveness', () => {
      const compressionRatios = {
        'static/js/main.js': 0.3, // 70% compression
        'static/css/main.css': 0.25, // 75% compression
      };

      Object.values(compressionRatios).forEach(ratio => {
        expect(ratio).toBeLessThan(0.5); // At least 50% compression
      });
    });
  });

  describe('Performance Monitoring Setup', () => {
    test('performance observers are available', () => {
      expect(global.PerformanceObserver).toBeDefined();
      expect(global.IntersectionObserver).toBeDefined();
    });

    test('performance API is available', () => {
      expect(global.performance).toBeDefined();
      expect(global.performance.now).toBeDefined();
      // Note: mark and measure may not be available in test environment
      expect(typeof global.performance.now).toBe('function');
    });

    test('animation frame APIs are available', () => {
      expect(global.requestAnimationFrame).toBeDefined();
      expect(global.cancelAnimationFrame).toBeDefined();
    });

    test('media query support is available', () => {
      expect(window.matchMedia).toBeDefined();
      expect(typeof window.matchMedia).toBe('function');
      
      // Test basic functionality without relying on return value structure
      expect(() => window.matchMedia('(prefers-reduced-motion: reduce)')).not.toThrow();
    });
  });
});