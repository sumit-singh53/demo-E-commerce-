/**
 * Examples and usage patterns for the scroll effects infrastructure
 * This file demonstrates how to use the scroll effects hooks and context
 */

import { useScrollEffects, useInView, useScrollAnimation } from '../hooks/useScrollEffects';
import { useScrollEffectsContext, useScrollSection } from '../context/ScrollEffectsContext';

/**
 * Example 1: Basic scroll tracking in a component
 */
export const BasicScrollExample = () => {
  const { scrollY, isScrolled, scrollDirection } = useScrollEffects();
  
  return (
    <div>
      <p>Scroll Y: {scrollY}px</p>
      <p>Is Scrolled: {isScrolled ? 'Yes' : 'No'}</p>
      <p>Direction: {scrollDirection}</p>
    </div>
  );
};

/**
 * Example 2: Element visibility detection
 */
export const InViewExample = ({ children }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });
  
  return (
    <div 
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.6s ease-out'
      }}
    >
      {children}
    </div>
  );
};

/**
 * Example 3: Scroll-triggered animation with stagger
 */
export const StaggeredAnimationExample = ({ items }) => {
  return (
    <div>
      {items.map((item, index) => (
        <AnimatedItem key={item.id} index={index}>
          {item.content}
        </AnimatedItem>
      ))}
    </div>
  );
};

const AnimatedItem = ({ children, index }) => {
  const { ref, isVisible, setIndex } = useScrollAnimation({
    threshold: 0.3,
    staggerDelay: 100,
    triggerOnce: true
  });
  
  // Set the index for stagger calculation
  React.useEffect(() => {
    setIndex(index);
  }, [index, setIndex]);
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease-out ${index * 100}ms`
      }}
    >
      {children}
    </div>
  );
};

/**
 * Example 4: Using scroll context for global state
 */
export const ScrollContextExample = () => {
  const {
    scrollY,
    scrollProgress,
    activeSection,
    isElementInView,
    scrollToElement
  } = useScrollEffectsContext();
  
  return (
    <div>
      <div>Scroll Progress: {Math.round(scrollProgress * 100)}%</div>
      <div>Active Section: {activeSection}</div>
      <button onClick={() => scrollToElement('hero', 100)}>
        Scroll to Hero
      </button>
    </div>
  );
};

/**
 * Example 5: Section registration for active tracking
 */
export const SectionExample = ({ sectionId, children }) => {
  const { ref, isActive } = useScrollSection(sectionId);
  
  return (
    <section
      ref={ref}
      id={sectionId}
      style={{
        backgroundColor: isActive ? '#ff073a' : 'transparent',
        transition: 'background-color 0.3s ease'
      }}
    >
      {children}
    </section>
  );
};

/**
 * Example 6: Navbar with scroll effects
 */
export const ScrollResponsiveNavbar = () => {
  const { isScrolled, scrollDirection } = useScrollEffects();
  
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        transform: scrollDirection === 'up' || !isScrolled ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}
    >
      <div>Navigation Content</div>
    </nav>
  );
};

/**
 * Example 7: Parallax effect using scroll progress
 */
export const ParallaxExample = ({ children }) => {
  const { scrollY } = useScrollEffects();
  const parallaxOffset = scrollY * 0.5; // Move at half the scroll speed
  
  return (
    <div
      style={{
        transform: `translateY(${parallaxOffset}px)`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

/**
 * Usage patterns and best practices:
 * 
 * 1. Wrap your app with ScrollEffectsProvider for global scroll state
 * 2. Use useScrollEffects for component-level scroll tracking
 * 3. Use useInView for element visibility detection
 * 4. Use useScrollAnimation for scroll-triggered animations with stagger
 * 5. Use useScrollSection for section-based navigation
 * 6. Always consider performance - use throttling and requestAnimationFrame
 * 7. Use CSS transforms and opacity for smooth 60fps animations
 * 8. Add will-change CSS property for elements that will be animated
 */