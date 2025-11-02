import React from 'react';
import ProductList from '../components/ProductList';
import styles from '../styles/Home.module.css';

const ProductListDemo = () => {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Redux Product List Demo
        </h1>
        <p className={styles.heroSubtitle}>
          Showcasing Redux-powered product management with enhanced conditional rendering
        </p>
      </section>
      
      <section className={styles.productsSection}>
        <ProductList />
      </section>
    </div>
  );
};

export default ProductListDemo;