// Checkout hook
import { useState } from 'react';

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'mock' }),
      });
      if (!res.ok) throw new Error('Checkout failed');
      const data = await res.json();
      return data.receipt;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, error };
};
