// Modern Cart page with enhanced UI
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartView from '../components/CartView';
import styles from '../styles/Cart.module.css';

function Cart() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className={styles.cartPage}>
      <div className="container">
        <CartView />
        
        {cart.items.length > 0 && (
          <motion.div 
            className={styles.cartActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button
              className={`btn btn-outline ${styles.continueBtn}`}
              onClick={handleContinueShopping}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Continue Shopping
            </motion.button>
            
            <motion.button
              className={`btn btn-primary ${styles.checkoutBtn}`}
              onClick={handleCheckout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout →
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Cart;
