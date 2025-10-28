// Product Grid component with scroll-triggered animations and error handling
import React, { useRef, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';
import { InlineNetworkError } from './NetworkErrorHandler';
import { useInView } from '../hooks/useScrollEffects';
import styles from '../styles/ProductGrid.module.css';

function ProductGrid({ products, loading, error, onRetry }) {
  const gridRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const { ref: containerRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Combine refs
  useEffect(() => {
    if (gridRef.current && containerRef.current !== gridRef.current) {
      containerRef.current = gridRef.current;
    }
  }, [containerRef]);

  // Trigger staggered animations when grid comes into view
  useEffect(() => {
    if (inView && products.length > 0) {
      products.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => new Set([...prev, index]));
        }, index * 100); // 100ms stagger delay
      });
    }
  }, [inView, products]);

  if (loading) return <SkeletonLoader count={8} />;

  // Show error state if there's an error and no products
  if (error && products.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <InlineNetworkError 
          error={error}
          onRetry={onRetry}
          isRetrying={loading}
        />
      </div>
    );
  }

  return (
    <div id="products-section" className={styles.gridContainer}>
      {/* Show inline error if there's an error but we have cached products */}
      {error && products.length > 0 && (
        <div className={styles.errorBanner}>
          <InlineNetworkError 
            error={error}
            onRetry={onRetry}
            isRetrying={loading}
            compact={true}
          />
        </div>
      )}
      
      <div 
        ref={gridRef}
        className={`${styles.productGrid} ${inView ? styles.visible : ''}`}
      >
        {products.map((product, index) => (
          <div
            key={product._id || product.id}
            className={`${styles.cardWrapper} ${
              visibleCards.has(index) ? styles.animate : ''
            }`}
            style={{
              '--animation-delay': `${index * 100}ms`
            }}
          >
            <ProductCard 
              product={product} 
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
