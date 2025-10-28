import { useEffect, useRef, useState, useCallback } from 'react';
import performanceMonitor, { PerformanceMonitor } from '../utils/performanceMonitor';

/**
 * Hook for performance optimization of animations and scroll effects
 * Automatically handles will-change properties and reduced motion preferences
 */
export function usePerformanceOptimization() {
  const [fps, setFps] = useState(60);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [canHandleComplexAnimations, setCanHandleComplexAnimations] = useState(true);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Check device capabilities
    setCanHandleComplexAnimations(PerformanceMonitor.canHandleComplexAnimations());

    // Monitor FPS
    const handleFPSUpdate = (currentFps) => setFps(currentFps);
    performanceMonitor.onFPSUpdate(handleFPSUpdate);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      performanceMonitor.offFPSUpdate(handleFPSUpdate);
    };
  }, []);

  return {
    fps,
    prefersReducedMotion,
    canHandleComplexAnimations,
    shouldUseComplexAnimations: !prefersReducedMotion && canHandleComplexAnimations && fps >= 55
  };
}

/**
 * Hook for optimizing element animations
 * Automatically adds and removes performance CSS properties
 */
export function useAnimationOptimization(shouldAnimate = true) {
  const elementRef = useRef(null);
  const isOptimized = useRef(false);

  const optimizeElement = useCallback(() => {
    if (elementRef.current && shouldAnimate && !isOptimized.current) {
      PerformanceMonitor.optimizeElement(elementRef.current);
      isOptimized.current = true;
    }
  }, [shouldAnimate]);

  const cleanupElement = useCallback(() => {
    if (elementRef.current && isOptimized.current) {
      PerformanceMonitor.cleanupElement(elementRef.current);
      isOptimized.current = false;
    }
  }, []);

  useEffect(() => {
    if (shouldAnimate) {
      optimizeElement();
    } else {
      cleanupElement();
    }

    return cleanupElement;
  }, [shouldAnimate, optimizeElement, cleanupElement]);

  return {
    ref: elementRef,
    optimizeElement,
    cleanupElement
  };
}

/**
 * Hook for intersection observer with performance optimizations
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
    ...options
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Use performance-optimized visibility check for reduced motion
    if (PerformanceMonitor.prefersReducedMotion()) {
      const checkVisibility = () => {
        const isVisible = PerformanceMonitor.isInViewport(element, defaultOptions.threshold);
        setIsIntersecting(isVisible);
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      };

      checkVisibility();
      const throttledCheck = PerformanceMonitor.throttle(checkVisibility, 100);
      
      window.addEventListener('scroll', throttledCheck, { passive: true });
      window.addEventListener('resize', throttledCheck, { passive: true });

      return () => {
        window.removeEventListener('scroll', throttledCheck);
        window.removeEventListener('resize', throttledCheck);
      };
    }

    // Use Intersection Observer for normal cases
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
          
          if (defaultOptions.triggerOnce) {
            observerRef.current?.unobserve(element);
          }
        }
      },
      {
        threshold: defaultOptions.threshold,
        rootMargin: defaultOptions.rootMargin
      }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [defaultOptions.threshold, defaultOptions.rootMargin, defaultOptions.triggerOnce, hasIntersected]);

  return {
    ref: elementRef,
    isIntersecting,
    hasIntersected
  };
}

/**
 * Hook for scroll-based animations with performance optimizations
 */
export function useScrollAnimation(options = {}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const defaultOptions = {
    throttleMs: 16, // ~60fps
    ...options
  };

  useEffect(() => {
    if (PerformanceMonitor.prefersReducedMotion()) {
      return; // Skip scroll animations for reduced motion
    }

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / scrollHeight, 1);
      
      setScrollProgress(progress);
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const throttledScroll = PerformanceMonitor.throttle(handleScroll, defaultOptions.throttleMs);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [defaultOptions.throttleMs]);

  return {
    scrollProgress,
    isScrolling
  };
}

export default {
  usePerformanceOptimization,
  useAnimationOptimization,
  useIntersectionObserver,
  useScrollAnimation
};