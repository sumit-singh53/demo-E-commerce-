// Modern App component with Wix-inspired design
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './styles/ThemeProvider';
import { CartProvider } from './context/CartContext';
import { CartNotificationProvider } from './context/CartNotificationContext';
import './styles/globals.css';

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <ThemeProvider>
        <CartProvider>
          <CartNotificationProvider>
            <div className="app">
              <Router>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                  </Routes>
                </main>
              </Router>
            </div>
          </CartNotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;