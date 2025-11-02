import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/ProductCard.module.css';

const Product = ({ product }) => {
  if (!product) {
    return null;
  }

  return (
    <motion.div 
      className={styles.productCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.productImage}
          loading="lazy"
        />
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
        </div>
      </div>
      
      <div className={styles.neonGlow}></div>
    </motion.div>
  );
};

export default Product;