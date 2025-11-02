// Enhanced Cart View component with modern styling and animations
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartItem from './CartItem';
import AnimatedCounter from './AnimatedCounter';
import { CartContext } from '../context/CartContext';
import styles from '../styles/Cart.module.css';

function CartView() {
  const { cart, loading, initialized, removeFromCart } = useContext(CartContext);
  const [removingItems, setRemovingItems] = useState(new Set());
  
  console.log('CartView render - cart:', cart);
  console.log('CartView render - loading:', loading);
  console.log('CartView render - initialized:', initialized);
  console.log('CartView render - cart.items:', cart?.items);
  console.log('CartView render - cart.items.length:', cart?.items?.length);

  const handleRemove = async (productId) => {
    setRemovingItems(prev => new Set([...prev, productId]));
    
    // Add a small delay for animation
    setTimeout(async () => {
      await removeFromCart(productId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const titleVariants = {
    initial: { 
      opacity: 0, 
      y: -20,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const emptyCartVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const listVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  if (loading && !initialized) {
    return (
      <motion.div 
        className={styles.loading}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            rotate: 360,
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 7, 58, 0.3)',
            borderTop: '3px solid var(--color-neon-red)',
            borderRadius: '50%',
            marginRight: '1rem'
          }}
        />
        Loading Cart...
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={styles.cartView}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.h1 
        className={styles.cartTitle}
        variants={titleVariants}
      >
        Your Cart
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/cart?userId=mock');
                const data = await response.json();
                alert(`API Test: ${JSON.stringify(data, null, 2)}`);
              } catch (error) {
                alert(`API Error: ${error.message}`);
              }
            }}
            style={{ 
              padding: '0.5rem 1rem', 
              marginRight: '0.5rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Cart API
          </button>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/cart/add', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: "mock", productId: "1", qty: 1 })
                });
                const data = await response.json();
                alert(`Add Test: ${JSON.stringify(data, null, 2)}`);
                window.location.reload(); // Refresh to see changes
              } catch (error) {
                alert(`Add Error: ${error.message}`);
              }
            }}
            style={{ 
              padding: '0.5rem 1rem', 
              marginRight: '0.5rem',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Add Item
          </button>
          <span style={{ color: 'white', fontSize: '0.7rem' }}>
            Cart items: {cart?.items?.length || 0} | Loading: {loading ? 'Yes' : 'No'}
          </span>
        </div>
      </motion.h1>
      
      <AnimatePresence mode="wait">
        {!cart.items || cart.items.length === 0 ? (
          <motion.div
            key="empty"
            className={styles.emptyCart}
            variants={emptyCartVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              🛒
            </motion.div>
            <p>Your cart is empty</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ 
                fontSize: '0.875rem', 
                marginTop: '0.5rem',
                color: 'var(--color-gray-500)'
              }}
            >
              Add some products to get started!
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="items"
            variants={listVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence>
              {cart.items && cart.items.map((item, index) => (
                <motion.div
                  key={item.product._id || item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.4
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -100,
                    transition: { duration: 0.3 }
                  }}
                  layout
                >
                  <CartItem 
                    item={item} 
                    onRemove={handleRemove}
                    isRemoving={removingItems.has(item.product._id || item.product.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.5 }
              }}
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'var(--gradient-card)',
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid rgba(138, 43, 226, 0.2)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'var(--color-neon-violet)',
                  textShadow: '0 0 10px rgba(138, 43, 226, 0.5)'
                }}
              >
                Total: <AnimatedCounter 
                  value={cart.items ? cart.items.reduce((total, item) => total + (item.product.price * item.qty), 0) : 0}
                  prefix="₹"
                  decimals={2}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CartView;
