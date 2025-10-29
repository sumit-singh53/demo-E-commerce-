import React, { useState, useEffect } from 'react';

function DebugProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const fullUrl = `${apiUrl}/api/products`;
        
        console.log('Environment variables:', {
          REACT_APP_API_URL: process.env.REACT_APP_API_URL,
          NODE_ENV: process.env.NODE_ENV
        });
        console.log('Fetching products from:', fullUrl);
        
        setDebugInfo({
          apiUrl,
          fullUrl,
          timestamp: new Date().toISOString()
        });
        
        const response = await fetch(fullUrl);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products received:', data.length);
        console.log('First product:', data[0]);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: 'rgba(0,0,0,0.8)', margin: '20px', borderRadius: '10px' }}>
      <h2>🔍 Debug Products</h2>
      <div style={{ marginBottom: '20px', fontSize: '14px' }}>
        <p><strong>API URL:</strong> {debugInfo.apiUrl}</p>
        <p><strong>Full URL:</strong> {debugInfo.fullUrl}</p>
        <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
      </div>
      
      {loading && <div style={{ color: 'yellow' }}>⏳ Loading products...</div>}
      {error && <div style={{ color: 'red' }}>❌ Error: {error}</div>}
      
      {!loading && !error && (
        <div>
          <h3 style={{ color: 'green' }}>✅ Success! Found {products.length} products</h3>
          {products.slice(0, 2).map(product => (
            <div key={product.id} style={{ 
              marginBottom: '10px', 
              border: '1px solid #00ffff', 
              padding: '10px', 
              borderRadius: '5px',
              backgroundColor: 'rgba(0,255,255,0.1)'
            }}>
              <h4 style={{ color: '#00ffff' }}>{product.title}</h4>
              <p>💰 Price: ${product.price}</p>
              <p>📝 {product.description?.substring(0, 100)}...</p>
              <p>🏷️ Category: {product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DebugProducts;