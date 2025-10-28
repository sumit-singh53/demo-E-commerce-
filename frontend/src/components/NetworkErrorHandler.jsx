import React, { useState, useEffect } from 'react';
import styles from '../styles/NetworkErrorHandler.module.css';

// Network Error Display Component
function NetworkError({ error, onRetry, isRetrying = false }) {
  const getErrorMessage = (error) => {
    if (!navigator.onLine) {
      return "You're currently offline. Please check your internet connection.";
    }
    
    if (error?.message?.includes('Failed to fetch')) {
      return "Unable to connect to our servers. Please try again.";
    }
    
    if (error?.message?.includes('timeout')) {
      return "Request timed out. Please check your connection and try again.";
    }
    
    return error?.message || "Something went wrong. Please try again.";
  };

  const getErrorIcon = (error) => {
    if (!navigator.onLine) return '📡';
    if (error?.message?.includes('timeout')) return '⏱️';
    return '⚠️';
  };

  return (
    <div className={styles.networkErrorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          {getErrorIcon(error)}
        </div>
        <h3 className={styles.errorTitle}>Connection Problem</h3>
        <p className={styles.errorMessage}>
          {getErrorMessage(error)}
        </p>
        <button 
          onClick={onRetry}
          disabled={isRetrying}
          className={`${styles.retryButton} ${isRetrying ? styles.retrying : ''}`}
          aria-label="Retry request"
        >
          {isRetrying ? (
            <>
              <div className={styles.spinner}></div>
              <span>Retrying...</span>
            </>
          ) : (
            <>
              <span>Try Again</span>
              <div className={styles.buttonGlow}></div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Inline Error Component for smaller spaces
function InlineNetworkError({ error, onRetry, isRetrying = false, compact = false }) {
  return (
    <div className={`${styles.inlineError} ${compact ? styles.compact : ''}`}>
      <span className={styles.inlineIcon}>⚠️</span>
      <span className={styles.inlineMessage}>
        {error?.message || 'Connection failed'}
      </span>
      <button 
        onClick={onRetry}
        disabled={isRetrying}
        className={styles.inlineRetryButton}
        aria-label="Retry"
      >
        {isRetrying ? '...' : '↻'}
      </button>
    </div>
  );
}

// Hook for network status detection
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection notification
        console.log('Connection restored');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}

// Offline Banner Component
function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const [show, setShow] = useState(!isOnline);

  useEffect(() => {
    if (isOnline) {
      // Delay hiding to show "reconnected" message briefly
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isOnline]);

  if (!show) return null;

  return (
    <div className={`${styles.offlineBanner} ${isOnline ? styles.reconnected : ''}`}>
      <div className={styles.bannerContent}>
        <span className={styles.bannerIcon}>
          {isOnline ? '✅' : '📡'}
        </span>
        <span className={styles.bannerText}>
          {isOnline ? 'Connection restored!' : 'You are currently offline'}
        </span>
        {!isOnline && (
          <button 
            onClick={() => window.location.reload()}
            className={styles.bannerButton}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// Higher-order component for network error handling
function withNetworkErrorHandling(WrappedComponent) {
  return function NetworkErrorWrapper(props) {
    const [networkError, setNetworkError] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);

    const handleNetworkError = (error) => {
      setNetworkError(error);
    };

    const handleRetry = async () => {
      setIsRetrying(true);
      setNetworkError(null);
      
      try {
        // If the wrapped component has a retry method, call it
        if (props.onRetry) {
          await props.onRetry();
        }
      } catch (error) {
        setNetworkError(error);
      } finally {
        setIsRetrying(false);
      }
    };

    if (networkError) {
      return (
        <NetworkError 
          error={networkError}
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      );
    }

    return (
      <WrappedComponent 
        {...props}
        onNetworkError={handleNetworkError}
        isRetrying={isRetrying}
      />
    );
  };
}

export default NetworkError;
export { 
  InlineNetworkError, 
  OfflineBanner, 
  useNetworkStatus, 
  withNetworkErrorHandling 
};