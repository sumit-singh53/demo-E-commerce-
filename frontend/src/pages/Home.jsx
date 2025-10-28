// Home page with enhanced error handling
import React from 'react';
import { useProducts } from '../hooks/useProducts';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';

function Home() {
  const { products, loading, error, retry } = useProducts();

  return (
    <>
      <HeroSection />
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={retry}
      />
    </>
  );
}

export default Home;
