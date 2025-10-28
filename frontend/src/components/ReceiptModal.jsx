// Enhanced Receipt Modal with celebration animations
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../styles/ThemeProvider';
import { formatPrice } from '../utils/formatPrice';
import styles from '../styles/SuccessModal.module.css';

function ReceiptModal({ receipt, onClose }) {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate confetti pieces
    const confettiArray = [];
    for (let i = 0; i < 50; i++) {
      confettiArray.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2
      });
    }
    setConfettiPieces(confettiArray);

    // Generate floating particles
    const particleArray = [];
    for (let i = 0; i < 20; i++) {
      particleArray.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4
      });
    }
    setParticles(particleArray);

    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueShopping = () => {
    onClose();
    // Navigate to home page
    window.location.href = '/';
  };

  const handleViewOrder = () => {
    // In a real app, this would navigate to order details
    console.log('View order details:', receipt);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.modalOverlay}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.6 
          }}
          className={styles.modalContent}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Confetti Animation */}
          {showConfetti && (
            <div className={styles.particles}>
              {confettiPieces.map((piece) => (
                <motion.div
                  key={piece.id}
                  className={styles.confetti}
                  initial={{ 
                    x: `${piece.left}%`, 
                    y: -100,
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    rotate: 720,
                    opacity: 0
                  }}
                  transition={{
                    duration: piece.duration,
                    delay: piece.delay,
                    ease: "easeOut"
                  }}
                  style={{
                    left: `${piece.left}%`,
                  }}
                />
              ))}
              
              {/* Floating particles */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className={styles.particle}
                  initial={{ 
                    x: `${particle.left}%`,
                    y: `${particle.top}%`,
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    y: `${particle.top - 50}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              damping: 15,
              stiffness: 300
            }}
            className={styles.successIcon}
          >
            ✓
          </motion.div>

          {/* Success Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={styles.successTitle}
          >
            Order Confirmed!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={styles.successMessage}
          >
            Thank you for your purchase! Your order has been successfully placed and will be processed shortly.
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className={styles.orderDetails}
          >
            <div className={styles.orderTitle}>
              📦 Order Summary
            </div>
            
            <ul className={styles.orderItems}>
              {receipt.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className={styles.orderItem}
                >
                  <span className={styles.itemName}>
                    {item.qty} × {item.title}
                  </span>
                  <span className={styles.itemPrice}>
                    ₹{formatPrice(item.price)}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className={styles.orderTotal}
            >
              <span>Total Amount:</span>
              <span className={styles.totalAmount}>
                ₹{formatPrice(receipt.total)}
              </span>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className={styles.actionButtons}
          >
            <motion.button
              onClick={handleContinueShopping}
              className={`${styles.actionButton} ${styles.primaryButton}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
            
            <motion.button
              onClick={handleViewOrder}
              className={`${styles.actionButton} ${styles.secondaryButton}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Order
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ReceiptModal;
