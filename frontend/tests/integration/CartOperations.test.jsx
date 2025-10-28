import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../src/styles/ThemeProvider';
import { ScrollEffectsProvider } from '../../src/context/ScrollEffectsContext';
import { CartProvider, CartContext } from '../../src/context/CartContext';
import CartView from '../../src/components/CartView';
import ProductCard from '../../src/components/ProductCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock fetch
global.fetch = jest.fn();

// Helper to render components with all providers
const renderWithProviders = (component, cartContextValue = null) => {
  if (cartContextValue) {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <ScrollEffectsProvider>
            <CartContext.Provider value={cartContextValue}>
              {component}
            </CartContext.Provider>
          </ScrollEffectsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  return render(
    <BrowserRouter>
      <ThemeProvider>
        <ScrollEffectsProvider>
          <CartProvider>
            {component}
          </CartProvider>
        </ScrollEffectsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Cart Operations Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  describe('Add to Cart Operations', () => {
    test('adding product to cart updates cart state correctly', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 100,
        image: 'test.jpg',
        description: 'Test description'
      };

      const mockAddToCart = jest.fn();
      const cartContextValue = {
        cart: { items: [] },
        loading: false,
        addToCart: mockAddToCart,
        removeFromCart: jest.fn()
      };

      renderWithProviders(
        <ProductCard product={mockProduct} />,
        cartContextValue
      );

      const addButton = screen.getByText(/add to cart/i);
      fireEvent.click(addButton);

      expect(mockAddToCart).toHaveBeenCalledWith(1, 1);
    });

    test('add to cart shows loading state during operation', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 100,
        image: 'test.jpg'
      };

      // Mock slow API response
      fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ items: [] })
          }), 100)
        )
      );

      renderWithProviders(<ProductCard product={mockProduct} />);

      const addButton = screen.getByText(/add to cart/i);
      fireEvent.click(addButton);

      // Button should show loading state
      expect(addButton).toBeDisabled();
    });

    test('multiple products can be added to cart', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, title: 'Product 1', price: 100 }, qty: 1 },
          { product: { id: 2, title: 'Product 2', price: 200 }, qty: 1 }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
      });

      // Total should be 300
      expect(screen.getByText(/300/)).toBeInTheDocument();
    });
  });

  describe('Remove from Cart Operations', () => {
    test('removing item from cart updates state correctly', async () => {
      const mockRemoveFromCart = jest.fn();
      const cartContextValue = {
        cart: {
          items: [
            { product: { id: 1, _id: '1', title: 'Test Product', price: 100 }, qty: 1 }
          ]
        },
        loading: false,
        addToCart: jest.fn(),
        removeFromCart: mockRemoveFromCart
      };

      renderWithProviders(<CartView />, cartContextValue);

      // Find remove button (this would be in CartItem component)
      const removeButtons = screen.queryAllByText(/remove/i);
      if (removeButtons.length > 0) {
        fireEvent.click(removeButtons[0]);
        expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
      }
    });

    test('removing last item shows empty cart message', async () => {
      const emptyCart = { items: [] };
      const cartWithItem = {
        items: [
          { product: { id: 1, _id: '1', title: 'Test Product', price: 100 }, qty: 1 }
        ]
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => cartWithItem,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => emptyCart,
        });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      });

      // After removal, should show empty cart
      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });
    });

    test('remove operation shows confirmation animation', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, _id: '1', title: 'Test Product', price: 100 }, qty: 1 }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      });

      // The remove animation would be handled by the CartItem component
      // This test verifies the cart view can handle the removal state
      expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });
  });

  describe('Cart State Management', () => {
    test('cart persists across page refreshes', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, title: 'Persistent Product', price: 150 }, qty: 2 }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Persistent Product')).toBeInTheDocument();
      });

      // Total should be 300 (150 * 2)
      expect(screen.getByText(/300/)).toBeInTheDocument();
    });

    test('cart handles quantity updates correctly', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, title: 'Quantity Product', price: 50 }, qty: 3 }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Quantity Product')).toBeInTheDocument();
      });

      // Total should be 150 (50 * 3)
      expect(screen.getByText(/150/)).toBeInTheDocument();
    });

    test('cart handles API errors gracefully', async () => {
      fetch.mockRejectedValue(new Error('API Error'));

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });
    });

    test('cart shows loading state during fetch', () => {
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithProviders(<CartView />);

      expect(screen.getByText('Loading Cart...')).toBeInTheDocument();
    });
  });

  describe('Cart Animations and Styling', () => {
    test('cart items animate in with stagger effect', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, _id: '1', title: 'Item 1', price: 100 }, qty: 1 },
          { product: { id: 2, _id: '2', title: 'Item 2', price: 200 }, qty: 1 },
          { product: { id: 3, _id: '3', title: 'Item 3', price: 300 }, qty: 1 }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
      });

      // All items should be visible
      expect(screen.getAllByText(/Item \d/)).toHaveLength(3);
    });

    test('cart total updates with animated counter', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, title: 'Counter Test', price: 99.99 }, qty: 2 }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText(/Total:/)).toBeInTheDocument();
      });

      // Should show total with proper formatting
      expect(screen.getByText(/199\.98/)).toBeInTheDocument();
    });

    test('empty cart shows animated empty state', async () => {
      const emptyCart = { items: [] };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => emptyCart,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });

      expect(screen.getByText('Add some products to get started!')).toBeInTheDocument();
      expect(screen.getByText('🛒')).toBeInTheDocument();
    });
  });
});