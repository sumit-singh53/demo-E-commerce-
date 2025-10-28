// Product Card component with neon styling, hover effects, and add-to-cart animations
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../styles/ThemeProvider';
import { ProgressiveImage } from './SkeletonLoader';
import { CartContext } from '../context/CartContext';
import { useCartNotification } from '../context/CartNotificationContext';
import styles from '../styles/ProductCard.module.css';

function ProductCard({ product, index = 0 }) {
  const { theme } = useTheme();
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useCartNotification();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    
    try {
      await addToCart(product.id || product._id, 1);
      
      // Show success animation on card
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
      
      // Show global notification
      showNotification(product, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const buttonVariants = {
    idle: { 
      scale: 1,
      backgroundColor: 'transparent'
    },
    adding: { 
      scale: [1, 0.95, 1.05, 1],
      backgroundColor: ['transparent', 'rgba(255, 7, 58, 0.1)', 'rgba(255, 7, 58, 0.2)', 'transparent'],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    success: {
      scale: [1, 1.1, 1],
      backgroundColor: ['transparent', 'rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.1)'],
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    idle: { 
      rotate: 0,
      scale: 1
    },
    adding: { 
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    success: {
      rotate: 0,
      scale: [1, 1.3, 1],
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const successVariants = {
    initial: { 
      opacity: 0, 
      scale: 0,
      y: -20
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div 
      className={styles.productCard}
      style={{
        '--stagger-delay': `${index * 100}ms`
      }}
    >
      <div className={styles.imageContainer}>
        <ProgressiveImage
          src={product.image}
          alt={product.title}
          className={styles.productImage}
        />
        <div className={styles.imageOverlay}>
          <button className={styles.quickViewBtn}>
            Quick View
          </button>
        </div>
        
        {/* Success notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className={styles.successNotification}
              variants={successVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 255, 136, 0.9)',
                color: 'var(--color-neon-black)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius-full)',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                zIndex: 10,
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
              }}
            >
              ✓ Added to Cart!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.productDescription}>
          {product.description?.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description
          }
        </p>
        
        <div className={styles.cardFooter}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              ${product.price?.toFixed(2) || '0.00'}
            </span>
            {product.rating && (
              <div className={styles.rating}>
                <span className={styles.stars}>
                  {'★'.repeat(Math.floor(product.rating.rate || 0))}
                  {'☆'.repeat(5 - Math.floor(product.rating.rate || 0))}
                </span>
                <span className={styles.ratingCount}>
                  ({product.rating.count || 0})
                </span>
              </div>
            )}
          </div>
          
          <motion.button 
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            disabled={isAdding}
            variants={buttonVariants}
            animate={isAdding ? 'adding' : showSuccess ? 'success' : 'idle'}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
          >
            <span className={styles.btnText}>
              {isAdding ? 'Adding...' : showSuccess ? 'Added!' : 'Add to Cart'}
            </span>
            <motion.span 
              className={styles.btnIcon}
              variants={iconVariants}
              animate={isAdding ? 'adding' : showSuccess ? 'success' : 'idle'}
            >
              {showSuccess ? '✓' : '+'}
            </motion.span>
          </motion.button>
        </div>
      </div>
      
      <div className={styles.neonGlow}></div>
    </div>
  );
}

export default ProductCard;
