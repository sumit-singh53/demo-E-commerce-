import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for scroll effects and animations
 * Provides scroll position tracking and intersection observer functionality
 */
export const useScrollEffects = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastScrollY = useRef(0);

  // Throttled scroll handler for performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Update scroll direction
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up');
    }
    
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > 50); // Consider scrolled after 50px
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    let ticking = false;

    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Set initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  return {
    scrollY,
    isScrolled,
    scrollDirection
  };
};

/**
 * Custom hook for intersection observer functionality
 * Detects when elements enter/exit the viewport
 */
export const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    root = null
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        setEntry(entry);
        
        if (isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, root]);

  return {
    ref: elementRef,
    inView,
    entry
  };
};

/**
 * Scroll-triggered animation utilities
 */
export const scrollAnimationUtils = {
  // Calculate scroll progress for an element
  getScrollProgress: (element) => {
    if (!element) return 0;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    
    // Element is completely above viewport
    if (rect.bottom < 0) return 1;
    
    // Element is completely below viewport
    if (rect.top > windowHeight) return 0;
    
    // Calculate progress based on element position in viewport
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    return Math.max(0, Math.min(1, visibleHeight / elementHeight));
  },

  // Get scroll progress for the entire page
  getPageScrollProgress: () => {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? scrollTop / documentHeight : 0;
  },

  // Stagger animation delays for multiple elements
  getStaggerDelay: (index, baseDelay = 100) => {
    return index * baseDelay;
  },

  // Easing functions for smooth animations
  easing: {
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4)
  }
};

/**
 * Hook for scroll-triggered animations with stagger support
 */
export const useScrollAnimation = (options = {}) => {
  const { threshold = 0.1, staggerDelay = 100, triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [animationDelay, setAnimationDelay] = useState(0);
  const elementRef = useRef(null);
  const indexRef = useRef(0);

  const { inView } = useInView({
    threshold,
    triggerOnce
  });

  useEffect(() => {
    if (inView && !isVisible) {
      const delay = scrollAnimationUtils.getStaggerDelay(indexRef.current, staggerDelay);
      setAnimationDelay(delay);
      
      setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }
  }, [inView, isVisible, staggerDelay]);

  const setIndex = useCallback((index) => {
    indexRef.current = index;
  }, []);

  return {
    ref: elementRef,
    isVisible,
    animationDelay,
    setIndex
  };
};