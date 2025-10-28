import { renderHook, act } from '@testing-library/react';
import { useScrollEffects, useInView, scrollAnimationUtils } from '../src/hooks/useScrollEffects';

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

describe('useScrollEffects', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
    jest.clearAllMocks();
  });

  test('initializes with correct default values', () => {
    const { result } = renderHook(() => useScrollEffects());

    expect(result.current.scrollY).toBe(0);
    expect(result.current.isScrolled).toBe(false);
    expect(result.current.scrollDirection).toBe('down');
  });

  test('updates scroll position when scrolling', () => {
    const { result } = renderHook(() => useScrollEffects());

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 100,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Wait for requestAnimationFrame
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.scrollY).toBe(100);
    expect(result.current.isScrolled).toBe(true);
  });

  test('detects scroll direction correctly', () => {
    const { result } = renderHook(() => useScrollEffects());

    // Scroll down
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 100,
      });
      window.dispatchEvent(new Event('scroll'));
      jest.runAllTimers();
    });

    expect(result.current.scrollDirection).toBe('down');

    // Scroll up
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 50,
      });
      window.dispatchEvent(new Event('scroll'));
      jest.runAllTimers();
    });

    expect(result.current.scrollDirection).toBe('up');
  });
});

describe('useInView', () => {
  let mockObserver;

  beforeEach(() => {
    mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
    mockIntersectionObserver.mockReturnValue(mockObserver);
  });

  test('initializes with correct default values', () => {
    const { result } = renderHook(() => useInView());

    expect(result.current.inView).toBe(false);
    expect(result.current.entry).toBe(null);
    expect(result.current.ref).toBeDefined();
  });

  test('creates intersection observer with correct options', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      triggerOnce: true
    };

    renderHook(() => useInView(options));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
        rootMargin: '10px',
        root: null
      })
    );
  });
});

describe('scrollAnimationUtils', () => {
  test('getPageScrollProgress calculates correct progress', () => {
    // Mock document height
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      value: 2000,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800,
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 600,
    });

    const progress = scrollAnimationUtils.getPageScrollProgress();
    expect(progress).toBe(0.5); // 600 / (2000 - 800) = 0.5
  });

  test('getStaggerDelay calculates correct delay', () => {
    expect(scrollAnimationUtils.getStaggerDelay(0, 100)).toBe(0);
    expect(scrollAnimationUtils.getStaggerDelay(2, 100)).toBe(200);
    expect(scrollAnimationUtils.getStaggerDelay(1, 50)).toBe(50);
  });

  test('easing functions return correct values', () => {
    const { easing } = scrollAnimationUtils;
    
    expect(easing.easeOutCubic(0)).toBe(0);
    expect(easing.easeOutCubic(1)).toBe(1);
    expect(easing.easeInOutCubic(0)).toBe(0);
    expect(easing.easeInOutCubic(1)).toBe(1);
    expect(easing.easeOutQuart(0)).toBe(0);
    expect(easing.easeOutQuart(1)).toBe(1);
  });
});