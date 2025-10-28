import React from 'react';
import styles from '../styles/ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI with neon styling
      return (
        <ErrorFallback 
          error={this.state.error}
          onRetry={this.handleRetry}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onRetry, showDetails = false }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.neonGlow}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>
            We encountered an unexpected error. Please try again.
          </p>
          
          {showDetails && error && (
            <details className={styles.errorDetails}>
              <summary>Error Details</summary>
              <pre className={styles.errorStack}>
                {error.toString()}
              </pre>
            </details>
          )}
          
          <button 
            onClick={onRetry} 
            className={styles.retryButton}
            aria-label="Retry loading"
          >
            <span className={styles.buttonText}>Try Again</span>
            <div className={styles.buttonGlow}></div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
export { ErrorFallback };