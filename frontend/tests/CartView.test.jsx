// Cart View tests
import React from 'react';
import { render, screen } from '@testing-library/react';
import CartView from '../components/CartView';
import { CartContext } from '../context/CartContext';

test('renders empty cart message', () => {
  render(
    <CartContext.Provider value={{ cart: { items: [] }, loading: false, removeFromCart: jest.fn() }}>
      <CartView />
    </CartContext.Provider>
  );
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});
