// Cart Context
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

// Use relative paths to leverage the proxy setup
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fetchCart = async () => {
    try {
      setError(null);
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/cart?userId=mock` : '/api/cart?userId=mock';
      console.log('Fetching cart from:', apiUrl);
      const res = await fetch(apiUrl);
      console.log('Cart fetch response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Cart data received:', data);
      console.log('Cart items:', data.items);
      // Ensure the cart has the correct structure
      const newCart = data && data.items ? data : { items: [] };
      setCart(newCart);
      setInitialized(true);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
      setCart({ items: [] }); // Fallback to empty cart
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, qty = 1) => {
    try {
      console.log('Adding to cart:', { productId, qty });
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/cart/add` : '/api/cart/add';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "mock", productId, qty }),
      });
      console.log('Add to cart response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      console.log('Refreshing cart after add...');
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      console.log('Removing from cart:', { productId });
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/cart/remove` : '/api/cart/remove';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "mock", productId }),
      });
      console.log('Remove from cart response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      console.log('Refreshing cart after remove...');
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, error, initialized, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
