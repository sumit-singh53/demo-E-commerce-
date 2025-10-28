import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Create the context
const ScrollEffectsContext = createContext();

/**
 * ScrollEffectsProvider - Provides scroll state and utilities to child components
 * Manages global scroll state, active sections, and performance-optimized scroll listeners
 */
export const ScrollEffectsProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const sectionsRef = useRef(new Map());

  // Throttled scroll handler for optimal performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update scroll direction
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up');
    }
    
    // Update scroll values
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > 50);
    setScrollProgress(documentHeight > 0 ? currentScrollY / documentHeight : 0);
    
    // Update active section based on scroll position
    updateActiveSection(currentScrollY);
    
    lastScrollY.current = currentScrollY;
  }, []);

  // Update active section based on current scroll position
  const updateActiveSection = useCallback((currentScrollY) => {
    let newActiveSection = '';
    let closestDistance = Infinity;
    
    sectionsRef.current.forEach((element, sectionId) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + currentScrollY;
        const distance = Math.abs(currentScrollY - elementTop);
        
        // Consider section active if it's in the upper half of viewport
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
          if (distance < closestDistance) {
            closestDistance = distance;
            newActiveSection = sectionId;
          }
        }
      }
    });
    
    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);
    }
  }, [activeSection]);

  // Performance-optimized scroll event handler
  useEffect(() => {
    const throttledScrollHandler = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Set initial values
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  // Register a section for active section tracking
  const registerSection = useCallback((sectionId, element) => {
    if (element) {
      sectionsRef.current.set(sectionId, element);
    } else {
      sectionsRef.current.delete(sectionId);
    }
  }, []);

  // Get scroll progress for a specific element
  const getElementScrollProgress = useCallback((element) => {
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
  }, []);

  // Check if element is in viewport
  const isElementInView = useCallback((element, threshold = 0.1) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    
    const verticalInView = rect.top < windowHeight * (1 - threshold) && 
                          rect.bottom > windowHeight * threshold;
    const horizontalInView = rect.left < windowWidth * (1 - threshold) && 
                            rect.right > windowWidth * threshold;
    
    return verticalInView && horizontalInView;
  }, []);

  // Smooth scroll to element
  const scrollToElement = useCallback((elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const targetPosition = elementTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Context value
  const contextValue = {
    // Scroll state
    scrollY,
    isScrolled,
    scrollDirection,
    scrollProgress,
    activeSection,
    
    // Utility functions
    registerSection,
    getElementScrollProgress,
    isElementInView,
    scrollToElement,
    
    // Performance metrics
    isScrolling: ticking.current
  };

  return (
    <ScrollEffectsContext.Provider value={contextValue}>
      {children}
    </ScrollEffectsContext.Provider>
  );
};

/**
 * Hook to use scroll effects context
 * Throws error if used outside of ScrollEffectsProvider
 */
export const useScrollEffectsContext = () => {
  const context = useContext(ScrollEffectsContext);
  
  if (!context) {
    throw new Error('useScrollEffectsContext must be used within a ScrollEffectsProvider');
  }
  
  return context;
};

/**
 * Higher-order component for scroll effects
 * Wraps component with scroll effects context
 */
export const withScrollEffects = (Component) => {
  return function WrappedComponent(props) {
    return (
      <ScrollEffectsProvider>
        <Component {...props} />
      </ScrollEffectsProvider>
    );
  };
};

/**
 * Hook for registering sections with the scroll context
 * Automatically handles cleanup on unmount
 */
export const useScrollSection = (sectionId) => {
  const { registerSection, activeSection } = useScrollEffectsContext();
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (element && sectionId) {
      registerSection(sectionId, element);
      
      return () => {
        registerSection(sectionId, null);
      };
    }
  }, [sectionId, registerSection]);
  
  return {
    ref: elementRef,
    isActive: activeSection === sectionId
  };
};