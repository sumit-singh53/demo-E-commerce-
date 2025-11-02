// Centralized REST API client with enhanced error handling
// Use relative paths to leverage the proxy setup
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Enhanced error types for better error handling
class NetworkError extends Error {
  constructor(message, status, type = 'network') {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
    this.type = type;
  }
}

class TimeoutError extends NetworkError {
  constructor(message = 'Request timed out') {
    super(message, 408, 'timeout');
    this.name = 'TimeoutError';
  }
}

// Enhanced response handler with better error categorization
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorType = 'network';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status-based messages
      switch (response.status) {
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable';
          break;
        default:
          errorMessage = 'Network request failed';
      }
    }
    
    throw new NetworkError(errorMessage, response.status, errorType);
  }
  return response.json();
}

// Enhanced fetch with timeout and retry logic
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new TimeoutError();
    }
    
    // Check if it's a network connectivity issue
    if (!navigator.onLine) {
      throw new NetworkError('You are currently offline', 0, 'offline');
    }
    
    if (error.message === 'Failed to fetch') {
      throw new NetworkError('Unable to connect to server', 0, 'connection');
    }
    
    throw error;
  }
}

// API functions with enhanced error handling
export async function fetchProducts() {
  try {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/products` : '/api/products';
    const res = await fetchWithTimeout(apiUrl);
    return await handleResponse(res);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function fetchCart() {
  try {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/cart?userId=mock` : '/api/cart?userId=mock';
    const res = await fetchWithTimeout(apiUrl);
    return await handleResponse(res);
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

export async function addToCart(productId, qty = 1) {
  try {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/cart/add` : '/api/cart/add';
    const res = await fetchWithTimeout(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: "mock", productId, qty }),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function removeFromCart(productId) {
  try {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/cart/remove` : '/api/cart/remove';
    const res = await fetchWithTimeout(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: "mock", productId }),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

export async function checkout() {
  try {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/checkout` : '/api/checkout';
    const res = await fetchWithTimeout(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: "mock" }),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
}

// Export error classes for use in components
export { NetworkError, TimeoutError };
