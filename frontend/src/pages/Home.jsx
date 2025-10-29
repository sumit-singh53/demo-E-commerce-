// Modern Home page with Wix-inspired design
import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { useCartNotification } from '../context/CartNotificationContext';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useCartNotification();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      showNotification(product, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: '3rem' }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-white)' }}>
              Featured Products
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-300)' }}>
              Discover our handpicked selection of premium beauty products
            </p>
          </motion.div>

          <ProductGrid 
            products={products}
            loading={loading}
            error={error}
            onRetry={retryFetch}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section bg-gray-50">
        <div className="container">
          <div className="features-grid grid grid-cols-3">
            <motion.div 
              className="feature-card text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </motion.div>
            <motion.div 
              className="feature-card text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Your payment information is safe with us</p>
            </motion.div>
            <motion.div 
              className="feature-card text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy for your peace of mind</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
