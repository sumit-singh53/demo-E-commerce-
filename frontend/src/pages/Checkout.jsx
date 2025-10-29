// Modern Checkout page with simplified UI
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import ReceiptModal from '../components/ReceiptModal';
import AnimatedCounter from '../components/AnimatedCounter';
import styles from '../styles/CheckoutForm.module.css';

function Checkout() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        items: cart.items,
        total: total,
        orderDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      setReceipt(orderData);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    navigate('/');
  };

  if (receipt) {
    return <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />;
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.checkoutContainer}
        >
          <motion.h1 
            className={styles.checkoutTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Checkout
          </motion.h1>

          {cart.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.emptyCheckout}
            >
              <div className={styles.emptyIcon}>🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to proceed with checkout</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </motion.div>
          ) : (
            <div className={styles.checkoutContent}>
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={styles.orderSummary}
              >
                <h2 className={styles.sectionTitle}>Order Summary</h2>
                <div className={styles.orderItems}>
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item.product._id || item.product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={styles.orderItem}
                    >
                      <div className={styles.itemImage}>
                        <img src={item.product.image} alt={item.product.title} />
                      </div>
                      <div className={styles.itemDetails}>
                        <h3>{item.product.title}</h3>
                        <p className={styles.itemCategory}>{item.product.category}</p>
                        <div className={styles.itemPricing}>
                          <span className={styles.itemQty}>Qty: {item.qty}</span>
                          <span className={styles.itemPrice}>
                            ${(item.product.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={styles.orderTotal}
                >
                  <div className={styles.totalRow}>
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Shipping:</span>
                    <span className={styles.freeShipping}>Free</span>
                  </div>
                  <div className={styles.totalRow + ' ' + styles.grandTotal}>
                    <span>Total:</span>
                    <span>
                      <AnimatedCounter 
                        value={total}
                        prefix="$"
                        decimals={2}
                      />
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Simplified Checkout Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={styles.checkoutActions}
              >
                <div className={styles.paymentInfo}>
                  <h2 className={styles.sectionTitle}>Quick Checkout</h2>
                  <div className={styles.paymentNote}>
                    <div className={styles.noteIcon}>ℹ️</div>
                    <div>
                      <p><strong>Demo Mode:</strong> This is a demonstration checkout.</p>
                      <p>No real payment will be processed.</p>
                    </div>
                  </div>
                  
                  <div className={styles.paymentMethods}>
                    <div className={styles.paymentMethod}>
                      <div className={styles.methodIcon}>💳</div>
                      <div>
                        <h4>Credit/Debit Card</h4>
                        <p>Secure payment processing</p>
                      </div>
                    </div>
                    <div className={styles.paymentMethod}>
                      <div className={styles.methodIcon}>📱</div>
                      <div>
                        <h4>Digital Wallet</h4>
                        <p>Quick and convenient</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <motion.button
                    className="btn btn-outline"
                    onClick={handleBackToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ← Back to Cart
                  </motion.button>
                  
                  <motion.button
                    className="btn btn-primary"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{ flex: 1 }}
                  >
                    {loading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          marginRight: '0.5rem'
                        }}
                      />
                    )}
                    {loading ? 'Processing Order...' : `Place Order - $${total.toFixed(2)}`}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={styles.errorAlert}
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
