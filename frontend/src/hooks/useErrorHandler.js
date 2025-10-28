import { useState, useCallback } from 'react';
import { NetworkError, TimeoutError } from '../services/api';

// Custom hook for handling API errors with retry functionality
export function useErrorHandler() {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error) => {
    console.error('Error handled by useErrorHandler:', error);
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(async (retryFunction) => {
    if (!retryFunction) return;
    
    setIsRetrying(true);
    setError(null);
    
    try {
      await retryFunction();
    } catch (error) {
      setError(error);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  const isNetworkError = error instanceof NetworkError || error instanceof TimeoutError;
  const isOfflineError = error?.type === 'offline';
  const isTimeoutError = error instanceof TimeoutError;

  return {
    error,
    isRetrying,
    isNetworkError,
    isOfflineError,
    isTimeoutError,
    handleError,
    clearError,
    retry
  };
}

// Hook for automatic retry with exponential backoff
export function useRetryWithBackoff(maxRetries = 3, initialDelay = 1000) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(async (asyncFunction) => {
    let currentRetry = 0;
    
    while (currentRetry <= maxRetries) {
      try {
        setIsRetrying(currentRetry > 0);
        setRetryCount(currentRetry);
        
        const result = await asyncFunction();
        
        // Success - reset retry count
        setRetryCount(0);
        setIsRetrying(false);
        return result;
        
      } catch (error) {
        currentRetry++;
        
        // If we've exhausted retries, throw the error
        if (currentRetry > maxRetries) {
          setIsRetrying(false);
          throw error;
        }
        
        // Don't retry for certain error types
        if (error instanceof NetworkError && error.status >= 400 && error.status < 500) {
          setIsRetrying(false);
          throw error; // Client errors shouldn't be retried
        }
        
        // Wait before retrying with exponential backoff
        const delay = initialDelay * Math.pow(2, currentRetry - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [maxRetries, initialDelay]);

  return {
    executeWithRetry,
    retryCount,
    isRetrying
  };
}

// Hook for handling loading states with error handling
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
}