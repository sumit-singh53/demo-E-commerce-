// Products hook with enhanced error handling
import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../services/api';
import { useErrorHandler } from './useErrorHandler';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError, retry, isRetrying } = useErrorHandler();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      handleError(error);
      setProducts([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  const retryLoadProducts = useCallback(() => {
    retry(loadProducts);
  }, [retry, loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { 
    products, 
    loading: loading || isRetrying, 
    error, 
    retry: retryLoadProducts,
    clearError 
  };
};
