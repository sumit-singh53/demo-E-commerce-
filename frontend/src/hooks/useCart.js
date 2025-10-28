// Cart hook
import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const res = await fetch('/api/cart');
    const data = await res.json();
    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return { cart, loading, refresh: fetchCart };
};
