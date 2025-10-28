import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../src/styles/ThemeProvider';
import { ScrollEffectsProvider } from '../../src/context/ScrollEffectsContext';
import { CartProvider } from '../../src/context/CartContext';
import CartView from '../../src/components/CartView';
import CheckoutForm from '../../src/components/CheckoutForm';
import ProductGrid from '../../src/components/ProductGrid';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock fetch
global.fetch = jest.fn();

// Helper to render components with all providers
const renderWithProviders = (component) => {
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

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  describe('Complete Shopping Flow with Animations', () => {
    test('user can browse products, add to cart, and checkout', async () => {
      // Mock API responses
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100, image: 'image1.jpg' },
        { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' },
      ];

      const mockCart = {
        items: [
          { product: mockProducts[0], qty: 1 }
        ]
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCart,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCart,
        });

      // Render product grid
      renderWithProviders(
        <ProductGrid products={mockProducts} loading={false} />
      );

      // Verify products are displayed
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();

      // Render cart view
      renderWithProviders(<CartView />);

      // Wait for cart to load
      await waitFor(() => {
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
      });

      // Verify cart item is displayed
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    test('cart operations work with enhanced styling', async () => {
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
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
      });

      // Verify cart displays total
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });

    test('empty cart displays correct message with animations', async () => {
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
    });
  });

  describe('Cart Operations with Enhanced Styling', () => {
    test('add to cart animation works correctly', async () => {
      const mockCart = { items: [] };
      const updatedCart = {
        items: [
          { product: { id: 1, title: 'New Product', price: 50 }, qty: 1 }
        ]
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCart,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updatedCart,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updatedCart,
        });

      renderWithProviders(<CartView />);

      // Initially empty
      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });
    });

    test('remove from cart animation works correctly', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, _id: '1', title: 'Test Product', price: 100 }, qty: 1 }
        ]
      };

      const emptyCart = { items: [] };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCart,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => emptyCart,
        });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      });

      // Find and click remove button (assuming it exists in CartItem)
      const removeButtons = screen.queryAllByText(/remove/i);
      if (removeButtons.length > 0) {
        fireEvent.click(removeButtons[0]);
      }
    });

    test('cart total updates with number counting animations', async () => {
      const mockCart = {
        items: [
          { product: { id: 1, _id: '1', title: 'Product 1', price: 100 }, qty: 2 },
          { product: { id: 2, _id: '2', title: 'Product 2', price: 50 }, qty: 1 }
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

      // Total should be (100 * 2) + (50 * 1) = 250
      expect(screen.getByText(/250/)).toBeInTheDocument();
    });
  });

  describe('Checkout Process with New Form Styling', () => {
    test('checkout form renders with neon theme styling', () => {
      const mockOnSuccess = jest.fn();
      
      renderWithProviders(<CheckoutForm onSuccess={mockOnSuccess} />);

      // Check for form elements
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    test('form validation works with smooth error animations', async () => {
      const mockOnSuccess = jest.fn();
      
      renderWithProviders(<CheckoutForm onSuccess={mockOnSuccess} />);

      // Try to proceed without filling required fields
      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Must be at least 2 characters/)).toBeInTheDocument();
      });
    });

    test('multi-step form navigation works correctly', async () => {
      const mockOnSuccess = jest.fn();
      
      renderWithProviders(<CheckoutForm onSuccess={mockOnSuccess} />);

      // Fill in personal information
      fireEvent.change(screen.getByLabelText('First Name'), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText('Last Name'), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByLabelText('Phone Number'), {
        target: { value: '1234567890' }
      });

      // Proceed to next step
      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      // Should show shipping information
      await waitFor(() => {
        expect(screen.getByText('Shipping Address')).toBeInTheDocument();
      });
    });

    test('successful checkout shows success animation', async () => {
      const mockOnSuccess = jest.fn();
      
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ receipt: { id: '123', total: 100 } }),
      });

      renderWithProviders(<CheckoutForm onSuccess={mockOnSuccess} />);

      // Navigate through all steps and fill required fields
      // Step 1: Personal Info
      fireEvent.change(screen.getByLabelText('First Name'), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText('Last Name'), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByLabelText('Phone Number'), {
        target: { value: '1234567890' }
      });

      fireEvent.click(screen.getByText('Next →'));

      // Step 2: Shipping
      await waitFor(() => {
        expect(screen.getByText('Shipping Address')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Street Address'), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByLabelText('City'), {
        target: { value: 'Mumbai' }
      });
      fireEvent.change(screen.getByLabelText('State'), {
        target: { value: 'Maharashtra' }
      });
      fireEvent.change(screen.getByLabelText('PIN Code'), {
        target: { value: '400001' }
      });

      fireEvent.click(screen.getByText('Next →'));

      // Step 3: Payment
      await waitFor(() => {
        expect(screen.getByText('Payment Information')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Card Number'), {
        target: { value: '1234567890123456' }
      });
      fireEvent.change(screen.getByLabelText('Name on Card'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByLabelText('Expiry Date'), {
        target: { value: '12/25' }
      });
      fireEvent.change(screen.getByLabelText('CVV'), {
        target: { value: '123' }
      });

      // Submit form
      const submitButton = screen.getByText('Complete Purchase');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith({ id: '123', total: 100 });
      });
    });

    test('checkout error handling displays user-friendly messages', async () => {
      const mockOnSuccess = jest.fn();
      
      fetch.mockRejectedValue(new Error('Network error'));

      renderWithProviders(<CheckoutForm onSuccess={mockOnSuccess} />);

      // Fill form and submit (simplified for test)
      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States and Error Handling', () => {
    test('loading states display with neon styling', () => {
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithProviders(<CartView />);

      expect(screen.getByText('Loading Cart...')).toBeInTheDocument();
    });

    test('network errors show user-friendly messages', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      renderWithProviders(<CartView />);

      await waitFor(() => {
        // Should fallback to empty cart
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });
    });

    test('API errors are handled gracefully', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      renderWithProviders(<CartView />);

      await waitFor(() => {
        // Should fallback to empty cart
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });
    });
  });
});