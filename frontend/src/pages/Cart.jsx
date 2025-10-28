// Cart page
import React, { useEffect, useState } from 'react';
import { useTheme } from '../styles/ThemeProvider';

function Cart() {
  const { theme } = useTheme();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cart', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(async res => {
      const data = await res.json();
      setCart(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: 30, color: theme.text }}>Loading cart...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Cart Items</h1>
      {cart.items.length === 0 ? <p>Your cart is empty.</p> :
        cart.items.map(({ product, qty }) => (
          <div key={product._id || product.id} style={{
            background: theme.card, color: theme.text,
            marginBottom: 20, padding: 15, borderRadius: 9
          }}>
            <h2>{product.title}</h2>
            <p>Qty: {qty}</p>
            <p>Price: ₹{(product.price * qty).toFixed(2)}</p>
          </div>
        ))
      }
    </div>
  );
}

export default Cart;
