// Floating cart notification component for add-to-cart feedback
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/CartNotification.module.css';

function CartNotification({ 
  isVisible, 
  product, 
  onClose,
  position = { top: '20px', right: '20px' }
}) {
  const notificationVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      x: 100,
      y: -20
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      x: 100,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const progressVariants = {
    initial: { width: '100%' },
    animate: { 
      width: '0%',
      transition: {
        duration: 3,
        ease: "linear"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.notification}
          style={position}
          variants={notificationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className={styles.content}>
            <div className={styles.icon}>
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: {
                    delay: 0.2,
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                  }
                }}
              >
                ✓
              </motion.span>
            </div>
            
            <div className={styles.details}>
              <div className={styles.title}>Added to Cart!</div>
              {product && (
                <div className={styles.productName}>
                  {product.title?.length > 30 
                    ? `${product.title.substring(0, 30)}...` 
                    : product.title
                  }
                </div>
              )}
            </div>
            
            <button 
              className={styles.closeButton}
              onClick={onClose}
            >
              ×
            </button>
          </div>
          
          {/* Auto-dismiss progress bar */}
          <motion.div
            className={styles.progressBar}
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CartNotification;