// Checkout page
import React, { useState } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import ReceiptModal from '../components/ReceiptModal';
import { useTheme } from '../styles/ThemeProvider';

function Checkout() {
  const { theme } = useTheme();
  const [receipt, setReceipt] = useState(null);

  const handleSuccess = (receiptData) => {
    setReceipt(receiptData);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: theme.primary }}>Checkout</h1>
      {!receipt ? <CheckoutForm onSuccess={handleSuccess} /> : <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

export default Checkout;
