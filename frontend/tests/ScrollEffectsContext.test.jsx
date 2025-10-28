import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { 
  ScrollEffectsProvider, 
  useScrollEffectsContext, 
  useScrollSection 
} from '../src/context/ScrollEffectsContext';

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));

// Test component to access context
const TestComponent = () => {
  const { scrollY, isScrolled, scrollDirection, activeSection } = useScrollEffectsContext();
  return (
    <div data-testid="scroll-context">
      <span data-testid="scroll-y">{scrollY}</span>
      <span data-testid="is-scrolled">{isScrolled.toString()}</span>
      <span data-testid="scroll-direction">{scrollDirection}</span>
      <span data-testid="active-section">{activeSection}</span>
    </div>
  );
};

describe('ScrollEffectsProvider', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
    jest.clearAllMocks();
  });

  test('provides initial scroll state correctly', () => {
    render(
      <ScrollEffectsProvider>
        <TestComponent />
      </ScrollEffectsProvider>
    );

    expect(screen.getByTestId('scroll-y')).toHaveTextContent('0');
    expect(screen.getByTestId('is-scrolled')).toHaveTextContent('false');
    expect(screen.getByTestId('scroll-direction')).toHaveTextContent('down');
    expect(screen.getByTestId('active-section')).toHaveTextContent('');
  });

  test('updates scroll state when scrolling', () => {
    render(
      <ScrollEffectsProvider>
        <TestComponent />
      </ScrollEffectsProvider>
    );

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 100,
      });
      window.dispatchEvent(new Event('scroll'));
      jest.runAllTimers();
    });

    expect(screen.getByTestId('scroll-y')).toHaveTextContent('100');
    expect(screen.getByTestId('is-scrolled')).toHaveTextContent('true');
  });

  test('throws error when used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      useScrollEffectsContext();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useScrollEffectsContext must be used within a ScrollEffectsProvider');

    consoleSpy.mockRestore();
  });
});

describe('useScrollSection', () => {
  const wrapper = ({ children }) => (
    <ScrollEffectsProvider>
      {children}
    </ScrollEffectsProvider>
  );

  test('registers section and returns ref', () => {
    const { result } = renderHook(() => useScrollSection('test-section'), { wrapper });

    expect(result.current.ref).toBeDefined();
    expect(result.current.isActive).toBe(false);
  });

  test('returns active state correctly', () => {
    const TestSectionComponent = () => {
      const { ref, isActive } = useScrollSection('hero');
      return (
        <div ref={ref} data-testid="section">
          Active: {isActive.toString()}
        </div>
      );
    };

    render(
      <ScrollEffectsProvider>
        <TestSectionComponent />
      </ScrollEffectsProvider>
    );

    expect(screen.getByTestId('section')).toHaveTextContent('Active: false');
  });
});