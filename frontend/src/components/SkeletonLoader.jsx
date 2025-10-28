// Enhanced skeleton loader with neon pulse animation
import React from 'react';
import styles from '../styles/SkeletonLoader.module.css';

function SkeletonLoader({ count = 6, type = 'product' }) {
  const renderProductSkeleton = (index) => (
    <div key={index} className={styles.skeletonCard}>
      <div className={styles.skeletonImage}>
        <div className={styles.shimmer}></div>
      </div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle}>
          <div className={styles.shimmer}></div>
        </div>
        <div className={styles.skeletonDescription}>
          <div className={`${styles.skeletonLine} ${styles.line1}`}>
            <div className={styles.shimmer}></div>
          </div>
          <div className={`${styles.skeletonLine} ${styles.line2}`}>
            <div className={styles.shimmer}></div>
          </div>
          <div className={`${styles.skeletonLine} ${styles.line3}`}>
            <div className={styles.shimmer}></div>
          </div>
        </div>
        <div className={styles.skeletonFooter}>
          <div className={styles.skeletonPrice}>
            <div className={styles.shimmer}></div>
          </div>
          <div className={styles.skeletonButton}>
            <div className={styles.shimmer}></div>
          </div>
        </div>
      </div>
      <div className={styles.neonPulse}></div>
    </div>
  );

  const renderGridSkeleton = (index) => (
    <div key={index} className={styles.skeletonGridItem}>
      <div className={styles.shimmer}></div>
    </div>
  );

  return (
    <div className={styles.skeletonContainer}>
      <div className={`${styles.skeletonGrid} ${styles[type]}`}>
        {Array.from({ length: count }).map((_, i) => 
          type === 'product' ? renderProductSkeleton(i) : renderGridSkeleton(i)
        )}
      </div>
    </div>
  );
}

// Loading spinner component with neon theme
export function LoadingSpinner({ size = 'medium', color = 'primary' }) {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
      <div className={styles.spinnerRing}></div>
      <div className={styles.spinnerRing}></div>
      <div className={styles.spinnerRing}></div>
    </div>
  );
}

// Progressive image loader component
export function ProgressiveImage({ src, alt, className, placeholder, ...props }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className={`${styles.progressiveImageContainer} ${className || ''}`}>
      {!imageLoaded && (
        <div className={styles.imagePlaceholder}>
          {placeholder || <LoadingSpinner size="small" />}
        </div>
      )}
      <img
        src={imageError ? '/placeholder-image.jpg' : src}
        alt={alt}
        className={`${styles.progressiveImage} ${imageLoaded ? styles.loaded : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

export default SkeletonLoader;
