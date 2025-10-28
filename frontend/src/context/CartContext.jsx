// Cart Context
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart?userId=mock`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [] }); // Fallback to empty cart
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, qty = 1) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "mock", productId, qty }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "mock", productId }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
