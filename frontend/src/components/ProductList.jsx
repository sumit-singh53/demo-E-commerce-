import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/actions/productActions';
import Product from './Product';
import SkeletonLoader from './SkeletonLoader';
import { InlineNetworkError } from './NetworkErrorHandler';
import styles from '../styles/ProductGrid.module.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(listProducts());
  };

  // Loading state with skeleton loader
  if (loading && (!products || products.length === 0)) {
    return (
      <div className={styles.gridContainer}>
        <SkeletonLoader count={8} />
      </div>
    );
  }

  // Error state with no products available
  if (error && (!products || products.length === 0)) {
    return (
      <div className={styles.gridContainer}>
        <InlineNetworkError 
          error={error}
          onRetry={handleRetry}
          isRetrying={loading}
        />
      </div>
    );
  }

  // No products available (not loading, no error)
  if (!loading && !error && (!products || products.length === 0)) {
    return (
      <div className={styles.gridContainer}>
        <div className={styles.emptyState}>
          <h2>No Products Available</h2>
          <p>We couldn't find any products at the moment. Please try again later.</p>
          <button 
            onClick={handleRetry}
            className={styles.retryButton}
          >
            Refresh Products
          </button>
        </div>
      </div>
    );
  }

  // Success state with products
  return (
    <div className={styles.gridContainer}>
      {/* Show error banner if there's an error but we have cached products */}
      {error && products && products.length > 0 && (
        <div className={styles.errorBanner}>
          <InlineNetworkError 
            error={error}
            onRetry={handleRetry}
            isRetrying={loading}
            compact={true}
          />
        </div>
      )}
      
      {/* Loading overlay for refresh */}
      {loading && products && products.length > 0 && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>Refreshing products...</div>
        </div>
      )}
      
      <div className={`${styles.productGrid} products`}>
        {products && products.map((product) => (
          <Product 
            key={product._id || product.id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;