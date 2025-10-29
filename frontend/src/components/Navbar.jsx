import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + (item.qty || 0), 0) || 0;

  // Animation variants
  const navVariants = {
    transparent: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    solid: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.nav
      className={styles.navbar}
      variants={navVariants}
      animate={isScrolled ? 'solid' : 'transparent'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🛍️</span>
            <span className={styles.logoText}>ShopCart</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/cart" 
            className={`${styles.navLink} ${location.pathname === '/cart' ? styles.active : ''}`}
          >
            <span>Cart</span>
            {cartItemsCount > 0 && (
              <motion.span 
                className={styles.cartBadge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {cartItemsCount}
              </motion.span>
            )}
          </Link>
          <Link 
            to="/checkout" 
            className={`${styles.navLink} ${location.pathname === '/checkout' ? styles.active : ''}`}
          >
            Checkout
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <div className={`${styles.hamburgerIcon} ${isMobileMenuOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileNav}
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <Link to="/" className={`${styles.mobileNavLink} ${location.pathname === '/' ? styles.active : ''}`}>
              Home
            </Link>
            <Link to="/cart" className={`${styles.mobileNavLink} ${location.pathname === '/cart' ? styles.active : ''}`}>
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <span className={styles.cartBadge}>{cartItemsCount}</span>
              )}
            </Link>
            <Link to="/checkout" className={`${styles.mobileNavLink} ${location.pathname === '/checkout' ? styles.active : ''}`}>
              Checkout
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
