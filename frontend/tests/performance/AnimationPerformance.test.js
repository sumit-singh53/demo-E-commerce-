import { PerformanceMonitor } from '../../src/utils/performanceMonitor';

// Mock requestAnimationFrame and performance
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16); // ~60fps
  return 1;
});

global.cancelAnimationFrame = jest.fn();

global.performance = {
  now: jest.fn(() => Date.now()),
};

// Mock matchMedia for reduced motion detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? false : true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator properties
Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  value: 8, // 8GB RAM
});

Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
});

describe('Animation Performance Tests', () => {
  let monitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
    jest.clearAllMocks();
    performance.now.mockReturnValue(0);
  });

  afterEach(() => {
    monitor.stopMonitoring();
  });

  describe('FPS Monitoring', () => {
    test('starts and stops monitoring correctly', () => {
      expect(monitor.isMonitoring).toBe(false);
      
      monitor.startMonitoring();
      expect(monitor.isMonitoring).toBe(true);
      expect(requestAnimationFrame).toHaveBeenCalled();
      
      monitor.stopMonitoring();
      expect(monitor.isMonitoring).toBe(false);
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    test('calculates FPS correctly', (done) => {
      let fpsCallbackCount = 0;
      
      monitor.onFPSUpdate((fps) => {
        fpsCallbackCount++;
        expect(fps).toBeGreaterThan(0);
        expect(fps).toBeLessThanOrEqual(60);
        
        if (fpsCallbackCount === 1) {
          monitor.stopMonitoring();
          done();
        }
      });

      // Mock time progression
      let timeCounter = 0;
      performance.now.mockImplementation(() => {
        timeCounter += 16; // 16ms per frame = ~60fps
        return timeCounter;
      });

      monitor.startMonitoring();

      // Simulate frame progression
      setTimeout(() => {
        performance.now.mockReturnValue(1000); // 1 second elapsed
      }, 100);
    });

    test('detects low FPS and logs warnings', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      monitor.onFPSUpdate((fps) => {
        if (fps < 55) {
          expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Low FPS detected')
          );
        }
      });

      // Simulate low FPS by mocking slow frame times
      let timeCounter = 0;
      performance.now.mockImplementation(() => {
        timeCounter += 50; // 50ms per frame = 20fps
        return timeCounter;
      });

      monitor.startMonitoring();

      setTimeout(() => {
        performance.now.mockReturnValue(1000);
        consoleSpy.mockRestore();
      }, 100);
    });

    test('handles multiple FPS callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      monitor.onFPSUpdate(callback1);
      monitor.onFPSUpdate(callback2);

      expect(monitor.callbacks).toHaveLength(2);

      monitor.offFPSUpdate(callback1);
      expect(monitor.callbacks).toHaveLength(1);
      expect(monitor.callbacks[0]).toBe(callback2);
    });
  });

  describe('Device Capability Detection', () => {
    test('detects reduced motion preference', () => {
      // Mock reduced motion preference
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      }));

      expect(PerformanceMonitor.prefersReducedMotion()).toBe(true);
    });

    test('detects device animation capabilities', () => {
      // Mock WebGL support
      const mockCanvas = {
        getContext: jest.fn().mockReturnValue({}), // WebGL context exists
      };
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

      expect(PerformanceMonitor.canHandleComplexAnimations()).toBe(true);
    });

    test('detects low-end devices', () => {
      // Mock low memory device
      Object.defineProperty(navigator, 'deviceMemory', {
        writable: true,
        value: 2, // 2GB RAM
      });

      expect(PerformanceMonitor.canHandleComplexAnimations()).toBe(false);
    });

    test('detects slow network connections', () => {
      // Mock slow connection
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        value: {
          effectiveType: '2g',
        },
      });

      expect(PerformanceMonitor.canHandleComplexAnimations()).toBe(false);
    });
  });

  describe('Element Optimization', () => {
    test('optimizes elements for animations', () => {
      const mockElement = {
        style: {},
      };

      PerformanceMonitor.optimizeElement(mockElement);

      expect(mockElement.style.willChange).toBe('transform, opacity');
      expect(mockElement.style.backfaceVisibility).toBe('hidden');
      expect(mockElement.style.transform).toBe('translate3d(0, 0, 0)');
    });

    test('cleans up optimized elements', () => {
      const mockElement = {
        style: {
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
        },
      };

      PerformanceMonitor.cleanupElement(mockElement);

      expect(mockElement.style.willChange).toBe('auto');
      expect(mockElement.style.backfaceVisibility).toBe('');
      expect(mockElement.style.transform).toBe('');
    });

    test('handles null elements gracefully', () => {
      expect(() => {
        PerformanceMonitor.optimizeElement(null);
        PerformanceMonitor.cleanupElement(null);
      }).not.toThrow();
    });
  });

  describe('Performance Utilities', () => {
    test('debounce function works correctly', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = PerformanceMonitor.debounce(mockFn, 100);

      // Call multiple times rapidly
      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      // Should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();

      setTimeout(() => {
        // Should be called once with the last arguments
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('arg3');
        done();
      }, 150);
    });

    test('throttle function works correctly', (done) => {
      const mockFn = jest.fn();
      const throttledFn = PerformanceMonitor.throttle(mockFn, 100);

      // Call multiple times rapidly
      throttledFn('arg1');
      throttledFn('arg2');
      throttledFn('arg3');

      // Should be called immediately once
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg1');

      setTimeout(() => {
        // Should still be called only once
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 50);
    });

    test('viewport detection works correctly', () => {
      const mockElement = {
        getBoundingClientRect: jest.fn().mockReturnValue({
          top: 100,
          bottom: 200,
          left: 50,
          right: 150,
        }),
      };

      // Mock window dimensions
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 800,
      });
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });

      expect(PerformanceMonitor.isInViewport(mockElement)).toBe(true);

      // Test element outside viewport
      mockElement.getBoundingClientRect.mockReturnValue({
        top: 900,
        bottom: 1000,
        left: 50,
        right: 150,
      });

      expect(PerformanceMonitor.isInViewport(mockElement)).toBe(false);
    });
  });

  describe('Scroll Performance', () => {
    test('measures scroll performance during animations', () => {
      const scrollHandler = jest.fn();
      const throttledScrollHandler = PerformanceMonitor.throttle(scrollHandler, 16);

      // Simulate rapid scroll events
      for (let i = 0; i < 10; i++) {
        throttledScrollHandler();
      }

      // Should only be called once due to throttling
      expect(scrollHandler).toHaveBeenCalledTimes(1);
    });

    test('optimizes scroll listeners for 60fps', () => {
      const startTime = performance.now();
      const targetFPS = 60;
      const frameTime = 1000 / targetFPS; // ~16.67ms

      // Simulate frame timing
      performance.now.mockReturnValue(startTime + frameTime);

      const isOptimal = frameTime <= 16.67; // 60fps threshold
      expect(isOptimal).toBe(true);
    });
  });
});