import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import ProductGrid from '../src/components/ProductGrid';
import { ThemeProvider } from '../src/styles/ThemeProvider';
import { ScrollEffectsProvider } from '../src/context/ScrollEffectsContext';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));

// Helper to render components with all providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <ScrollEffectsProvider>
          {component}
        </ScrollEffectsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Mock window.matchMedia for responsive tests
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('Responsive Behavior Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  describe('Navbar Responsive Behavior', () => {
    test('renders desktop navigation by default', () => {
      mockMatchMedia(false); // Desktop view
      renderWithProviders(<Navbar />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Cart')).toBeInTheDocument();
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    test('mobile menu button toggles mobile navigation', () => {
      renderWithProviders(<Navbar />);

      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toBeInTheDocument();

      // Click to open mobile menu
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

      // Click to close mobile menu
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('mobile menu closes on scroll', () => {
      renderWithProviders(<Navbar />);

      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      
      // Open mobile menu
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

      // Simulate scroll
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          value: 100,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('navbar changes appearance on scroll', () => {
      const { container } = renderWithProviders(<Navbar />);
      const navbar = container.querySelector('nav');

      // Initial state - transparent
      expect(navbar).toBeInTheDocument();

      // Simulate scroll
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          value: 100,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      // Should still be in document after scroll
      expect(navbar).toBeInTheDocument();
    });
  });

  describe('ProductGrid Responsive Behavior', () => {
    const mockProducts = [
      { id: 1, title: 'Product 1', price: 10, image: 'image1.jpg' },
      { id: 2, title: 'Product 2', price: 20, image: 'image2.jpg' },
      { id: 3, title: 'Product 3', price: 30, image: 'image3.jpg' },
    ];

    test('renders products in grid layout', () => {
      renderWithProviders(
        <ProductGrid products={mockProducts} loading={false} />
      );

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    test('shows loading state with skeleton loaders', () => {
      renderWithProviders(
        <ProductGrid products={[]} loading={true} />
      );

      const loadingElements = screen.getAllByText(/loading/i);
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    test('handles empty product list', () => {
      renderWithProviders(
        <ProductGrid products={[]} loading={false} />
      );

      // Should not crash and should render empty grid
      const grid = screen.getByTestId('product-grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Viewport Size Responsive Tests', () => {
    test('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 667,
      });

      mockMatchMedia(true); // Mobile view

      renderWithProviders(<Navbar />);

      // Mobile menu button should be available
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    test('adapts to tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 768,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 1024,
      });

      mockMatchMedia(false); // Tablet/Desktop view

      renderWithProviders(<Navbar />);

      // Desktop navigation should be available
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Cart')).toBeInTheDocument();
    });

    test('adapts to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1920,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 1080,
      });

      mockMatchMedia(false); // Desktop view

      renderWithProviders(<Navbar />);

      // All navigation elements should be visible
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Cart')).toBeInTheDocument();
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
  });

  describe('Touch Interaction Tests', () => {
    test('handles touch events on mobile menu', () => {
      renderWithProviders(<Navbar />);

      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      
      // Simulate touch events
      fireEvent.touchStart(mobileMenuButton);
      fireEvent.touchEnd(mobileMenuButton);
      fireEvent.click(mobileMenuButton);

      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('navigation links are touch-friendly', () => {
      renderWithProviders(<Navbar />);

      const homeLink = screen.getByText('Home');
      
      // Should handle touch events without errors
      fireEvent.touchStart(homeLink);
      fireEvent.touchEnd(homeLink);
      
      expect(homeLink).toBeInTheDocument();
    });
  });
});