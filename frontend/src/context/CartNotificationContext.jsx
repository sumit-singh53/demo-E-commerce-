// Cart Notification Context for managing global cart notifications
import React, { createContext, useContext, useState } from 'react';
import CartNotification from '../components/CartNotification';

const CartNotificationContext = createContext();

export function CartNotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    isVisible: false,
    product: null,
    timeout: null
  });

  const showNotification = (product, duration = 3000) => {
    // Clear existing timeout
    if (notification.timeout) {
      clearTimeout(notification.timeout);
    }

    setNotification({
      isVisible: true,
      product,
      timeout: null
    });

    // Auto-hide after duration
    const timeout = setTimeout(() => {
      hideNotification();
    }, duration);

    setNotification(prev => ({
      ...prev,
      timeout
    }));
  };

  const hideNotification = () => {
    if (notification.timeout) {
      clearTimeout(notification.timeout);
    }
    
    setNotification({
      isVisible: false,
      product: null,
      timeout: null
    });
  };

  return (
    <CartNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <CartNotification
        isVisible={notification.isVisible}
        product={notification.product}
        onClose={hideNotification}
      />
    </CartNotificationContext.Provider>
  );
}

export function useCartNotification() {
  const context = useContext(CartNotificationContext);
  if (!context) {
    throw new Error('useCartNotification must be used within a CartNotificationProvider');
  }
  return context;
}