// Main App component with enhanced error handling
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ErrorBoundary from './components/ErrorBoundary';
import { OfflineBanner } from './components/NetworkErrorHandler';
import { ThemeProvider } from './styles/ThemeProvider';
import { ScrollEffectsProvider } from './context/ScrollEffectsContext';
import { CartProvider } from './context/CartContext';
import { CartNotificationProvider } from './context/CartNotificationContext';

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <ThemeProvider>
        <CartProvider>
          <CartNotificationProvider>
            <ScrollEffectsProvider>
              <OfflineBanner />
              <Router>
                <ErrorBoundary>
                  <Navbar />
                </ErrorBoundary>
                <Routes>
                  <Route path="/" element={
                    <ErrorBoundary>
                      <Home />
                    </ErrorBoundary>
                  } />
                  <Route path="/cart" element={
                    <ErrorBoundary>
                      <Cart />
                    </ErrorBoundary>
                  } />
                  <Route path="/checkout" element={
                    <ErrorBoundary>
                      <Checkout />
                    </ErrorBoundary>
                  } />
                </Routes>
              </Router>
            </ScrollEffectsProvider>
          </CartNotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;