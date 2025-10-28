import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../styles/ThemeProvider';
import { useScrollEffectsContext } from '../context/ScrollEffectsContext';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const { theme } = useTheme();
  const { scrollY, isScrolled, scrollDirection } = useScrollEffectsContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu on scroll
  useEffect(() => {
    if (isMobileMenuOpen && scrollY > 0) {
      setIsMobileMenuOpen(false);
    }
  }, [scrollY, isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation variants for scroll animations
  const navVariants = {
    transparent: {
      backgroundColor: 'rgba(10, 10, 10, 0)',
      backdropFilter: 'blur(0px)',
      borderBottom: '1px solid rgba(255, 7, 58, 0)',
      boxShadow: '0 0 0 rgba(255, 7, 58, 0)'
    },
    solid: {
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 7, 58, 0.2)',
      boxShadow: '0 8px 32px rgba(255, 7, 58, 0.1)'
    },
    hidden: {
      y: -100,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Mobile menu variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  // Link hover variants
  const linkVariants = {
    hover: {
      scale: 1.05,
      color: theme.colors.primary.neonRed,
      textShadow: `0 0 8px ${theme.colors.accent.glow}`,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  // Hamburger menu variants
  const hamburgerVariants = {
    closed: {
      rotate: 0
    },
    open: {
      rotate: 180
    }
  };

  const isHidden = scrollDirection === 'down' && scrollY > 100;

  return (
    <motion.nav
      className={styles.navbar}
      variants={navVariants}
      animate={[
        isHidden ? 'hidden' : 'visible',
        isScrolled ? 'solid' : 'transparent'
      ]}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: theme.typography.fontFamily
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/" 
          className={styles.logo}
          style={{
            textDecoration: 'none',
            fontSize: theme.typography.sizes['2xl'],
            fontWeight: theme.typography.weights.bold,
            background: theme.colors.primary.gradients.secondary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          ShopCart
        </Link>
      </motion.div>

      {/* Desktop Navigation */}
      <div className={styles.desktopNav} style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <motion.div variants={linkVariants} whileHover="hover">
          <Link 
            to="/" 
            className={styles.navLink}
            style={{
              color: location.pathname === '/' ? theme.colors.primary.neonRed : theme.colors.neutral.white,
              textDecoration: 'none',
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.medium,
              transition: 'all 0.3s ease'
            }}
          >
            Home
          </Link>
        </motion.div>

        <motion.div variants={linkVariants} whileHover="hover">
          <Link 
            to="/cart" 
            className={styles.navLink}
            style={{
              color: location.pathname === '/cart' ? theme.colors.primary.neonRed : theme.colors.neutral.white,
              textDecoration: 'none',
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.medium,
              transition: 'all 0.3s ease'
            }}
          >
            Cart
          </Link>
        </motion.div>

        <motion.div variants={linkVariants} whileHover="hover">
          <Link 
            to="/checkout" 
            className={styles.navLink}
            style={{
              color: location.pathname === '/checkout' ? theme.colors.primary.neonRed : theme.colors.neutral.white,
              textDecoration: 'none',
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.medium,
              transition: 'all 0.3s ease'
            }}
          >
            Checkout
          </Link>
        </motion.div>
      </div>

      {/* Mobile Hamburger Menu */}
      <motion.button
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        variants={hamburgerVariants}
        animate={isMobileMenuOpen ? 'open' : 'closed'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle mobile menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: theme.colors.neutral.white,
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0.5rem'
        }}
      >
        <div className={`${styles.hamburgerIcon} ${isMobileMenuOpen ? styles.active : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileNav}
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'rgba(10, 10, 10, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${theme.colors.primary.neonRed}`,
              padding: '1rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <motion.div
              whileHover={{ x: 10, color: theme.colors.primary.neonRed }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/" 
                style={{
                  color: location.pathname === '/' ? theme.colors.primary.neonRed : theme.colors.neutral.white,
                  textDecoration: 'none',
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.medium,
                  display: 'block',
                  padding: '0.5rem 0'
                }}
              >
                Home
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ x: 10, color: theme.colors.primary.neonRed }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/cart" 
                style={{
                  color: location.pathname === '/cart' ? theme.colors.primary.neonRed : theme.colors.neutral.white,
                  textDecoration: 'none',
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.medium,
                  display: 'block',
                  padding: '0.5rem 0'
                }}
              >
                Cart
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ x: 10, color: theme.colors.primary.neonRed }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                to="/checkout" 
                style={{
                  color: location.pathname === '/checkout' ? theme.colors.primary.neonRed : theme.colors.neutral.white,
                  textDecoration: 'none',
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.medium,
                  display: 'block',
                  padding: '0.5rem 0'
                }}
              >
                Checkout
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
