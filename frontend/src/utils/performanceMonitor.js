/**
 * Performance monitoring utilities for animations and scroll effects
 * Helps ensure 60fps performance and provides debugging information
 */

class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.isMonitoring = false;
    this.callbacks = [];
    this.animationFrame = null;
  }

  /**
   * Start monitoring FPS
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.measureFPS();
  }

  /**
   * Stop monitoring FPS
   */
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Measure FPS using requestAnimationFrame
   */
  measureFPS() {
    if (!this.isMonitoring) return;

    this.animationFrame = requestAnimationFrame(() => {
      this.frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastTime = currentTime;

        // Notify callbacks
        this.callbacks.forEach(callback => callback(this.fps));

        // Log performance warnings
        if (this.fps < 55) {
          console.warn(`Low FPS detected: ${this.fps}fps. Consider optimizing animations.`);
        }
      }

      this.measureFPS();
    });
  }

  /**
   * Add callback for FPS updates
   * @param {Function} callback - Function to call with FPS value
   */
  onFPSUpdate(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Remove FPS update callback
   * @param {Function} callback - Function to remove
   */
  offFPSUpdate(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  /**
   * Get current FPS
   * @returns {number} Current FPS
   */
  getCurrentFPS() {
    return this.fps;
  }

  /**
   * Check if device supports reduced motion
   * @returns {boolean} True if user prefers reduced motion
   */
  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if device has sufficient performance for complex animations
   * @returns {boolean} True if device can handle complex animations
   */
  static canHandleComplexAnimations() {
    // Check for hardware acceleration support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return false;

    // Check device memory (if available)
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return false;
    }

    // Check connection speed (if available)
    if (navigator.connection && navigator.connection.effectiveType) {
      const slowConnections = ['slow-2g', '2g'];
      if (slowConnections.includes(navigator.connection.effectiveType)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Optimize element for animations by adding performance CSS properties
   * @param {HTMLElement} element - Element to optimize
   */
  static optimizeElement(element) {
    if (!element) return;

    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
    element.style.transform = 'translate3d(0, 0, 0)';
  }

  /**
   * Remove optimization properties from element
   * @param {HTMLElement} element - Element to clean up
   */
  static cleanupElement(element) {
    if (!element) return;

    element.style.willChange = 'auto';
    element.style.backfaceVisibility = '';
    element.style.transform = '';
  }

  /**
   * Debounce function for performance-sensitive operations
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function for scroll and resize events
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Check if element is in viewport (optimized version)
   * @param {HTMLElement} element - Element to check
   * @param {number} threshold - Threshold for visibility (0-1)
   * @returns {boolean} True if element is visible
   */
  static isInViewport(element, threshold = 0.1) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const verticalThreshold = windowHeight * threshold;
    const horizontalThreshold = windowWidth * threshold;

    return (
      rect.top < windowHeight - verticalThreshold &&
      rect.bottom > verticalThreshold &&
      rect.left < windowWidth - horizontalThreshold &&
      rect.right > horizontalThreshold
    );
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.startMonitoring();
  
  // Log FPS to console in development
  performanceMonitor.onFPSUpdate((fps) => {
    if (fps < 55) {
      console.warn(`🐌 Low FPS: ${fps}fps`);
    } else if (fps >= 58) {
      console.log(`🚀 Good FPS: ${fps}fps`);
    }
  });
}

export default performanceMonitor;
export { PerformanceMonitor };