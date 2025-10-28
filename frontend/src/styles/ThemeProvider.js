// Enhanced theme provider with neon color palette
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const neonTheme = {
  colors: {
    primary: {
      neonBlack: '#000000',
      neonBlue: '#00ffff',
      neonRed: '#ff073a',
      neonViolet: '#8a2be2',
      gradients: {
        primary: 'linear-gradient(135deg, #0a0a1a 0%, #001133 25%, #002244 50%, #001133 75%, #0a0a1a 100%)',
        secondary: 'linear-gradient(45deg, #00ffff 0%, #0080ff 100%)',
        card: 'linear-gradient(145deg, #0a0a1a 0%, #001122 100%)',
        futuristic: 'radial-gradient(ellipse at center, #001133 0%, #000011 50%, #000000 100%)'
      }
    },
    neutral: {
      white: '#ffffff',
      gray100: '#f8f9fa',
      gray200: '#e9ecef',
      gray300: '#dee2e6',
      gray400: '#ced4da',
      gray500: '#adb5bd',
      gray600: '#6c757d',
      gray700: '#495057',
      gray800: '#1a1a1a',
      gray900: '#0d0d0d'
    },
    accent: {
      glow: 'rgba(0, 255, 255, 0.3)',
      blueGlow: 'rgba(0, 255, 255, 0.3)',
      violetGlow: 'rgba(138, 43, 226, 0.3)',
      success: '#00ff88',
      warning: '#ffaa00',
      error: '#ff4757'
    }
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weights: { 
      light: 300, 
      regular: 400, 
      medium: 500, 
      semibold: 600,
      bold: 700 
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    }
  },
  animations: {
    duration: { 
      fast: '200ms', 
      medium: '400ms', 
      slow: '600ms',
      slower: '800ms'
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  }
};

export function ThemeProvider({ children }) {
  const [theme] = useState(neonTheme);

  // Set CSS custom properties for global access
  useEffect(() => {
    const root = document.documentElement;
    
    // Colors
    root.style.setProperty('--color-neon-black', theme.colors.primary.neonBlack);
    root.style.setProperty('--color-neon-blue', theme.colors.primary.neonBlue);
    root.style.setProperty('--color-neon-red', theme.colors.primary.neonRed);
    root.style.setProperty('--color-neon-violet', theme.colors.primary.neonViolet);
    root.style.setProperty('--gradient-primary', theme.colors.primary.gradients.primary);
    root.style.setProperty('--gradient-secondary', theme.colors.primary.gradients.secondary);
    root.style.setProperty('--gradient-card', theme.colors.primary.gradients.card);
    root.style.setProperty('--gradient-futuristic', theme.colors.primary.gradients.futuristic);
    
    // Neutral colors
    root.style.setProperty('--color-white', theme.colors.neutral.white);
    root.style.setProperty('--color-gray-100', theme.colors.neutral.gray100);
    root.style.setProperty('--color-gray-800', theme.colors.neutral.gray800);
    root.style.setProperty('--color-gray-900', theme.colors.neutral.gray900);
    
    // Accent colors
    root.style.setProperty('--color-glow', theme.colors.accent.glow);
    root.style.setProperty('--color-blue-glow', theme.colors.accent.blueGlow);
    root.style.setProperty('--color-violet-glow', theme.colors.accent.violetGlow);
    root.style.setProperty('--color-success', theme.colors.accent.success);
    root.style.setProperty('--color-error', theme.colors.accent.error);
    
    // Typography
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    
    // Animation
    root.style.setProperty('--duration-fast', theme.animations.duration.fast);
    root.style.setProperty('--duration-medium', theme.animations.duration.medium);
    root.style.setProperty('--duration-slow', theme.animations.duration.slow);
    root.style.setProperty('--easing-default', theme.animations.easing.default);
    root.style.setProperty('--easing-bounce', theme.animations.easing.bounce);
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div style={{
        background: theme.colors.primary.gradients.futuristic,
        color: theme.colors.neutral.white,
        minHeight: '100vh',
        fontFamily: theme.typography.fontFamily
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
