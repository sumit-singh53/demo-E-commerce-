// Enhanced Cart Item component with neon styling and animations
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Cart.module.css';

function CartItem({ item, onRemove, onQuantityChange, isRemoving = false }) {
  const [quantity, setQuantity] = useState(item.qty);

  const handleRemove = async () => {
    onRemove(item.product._id || item.product.id);
  };

  const handleQuantityChange = (newQty) => {
    if (newQty > 0) {
      setQuantity(newQty);
      if (onQuantityChange) {
        onQuantityChange(item.product._id || item.product.id, newQty);
      }
    }
  };

  const itemVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -200,
      scale: 0.7,
      rotateY: -15,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    },
    removing: {
      opacity: 0.5,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const quantityVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={styles.cartItem}
        variants={itemVariants}
        initial="initial"
        animate={isRemoving ? "removing" : "animate"}
        exit="exit"
        layout
        whileHover={{
          y: -2,
          transition: { duration: 0.2 }
        }}
      >
        <motion.img 
          src={item.product.image} 
          alt={item.product.title}
          className={styles.itemImage}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        />
        
        <div className={styles.itemDetails}>
          <motion.h3 
            className={styles.itemTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {item.product.title}
          </motion.h3>
          
          <div className={styles.itemMeta}>
            <div className={styles.quantitySection}>
              <span className={styles.quantityLabel}>Qty:</span>
              <motion.div
                className={styles.quantityValue}
                variants={quantityVariants}
                animate={quantity !== item.qty ? "animate" : "initial"}
              >
                {quantity}
              </motion.div>
            </div>
            
            <div className={styles.priceSection}>
              <span className={styles.priceLabel}>Price:</span>
              <motion.span 
                className={styles.priceValue}
                key={quantity * item.product.price}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  transition: { duration: 0.3 }
                }}
              >
                ₹{(item.product.price * quantity).toFixed(2)}
              </motion.span>
            </div>
          </div>
        </div>
        
        <motion.button 
          onClick={handleRemove}
          className={styles.removeButton}
          whileHover={{ 
            scale: 1.1,
            rotate: 90,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
          disabled={isRemoving}
        >
          ×
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

export default CartItem;
