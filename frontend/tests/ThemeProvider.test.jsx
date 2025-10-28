import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../src/styles/ThemeProvider';

// Test component to access theme context
const TestComponent = () => {
  const { theme } = useTheme();
  return (
    <div data-testid="theme-test">
      <span data-testid="neon-black">{theme.colors.primary.neonBlack}</span>
      <span data-testid="neon-red">{theme.colors.primary.neonRed}</span>
      <span data-testid="neon-violet">{theme.colors.primary.neonViolet}</span>
      <span data-testid="font-family">{theme.typography.fontFamily}</span>
      <span data-testid="animation-duration">{theme.animations.duration.fast}</span>
    </div>
  );
};

describe('ThemeProvider', () => {
  test('provides neon color palette correctly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('neon-black')).toHaveTextContent('#0a0a0a');
    expect(screen.getByTestId('neon-red')).toHaveTextContent('#ff073a');
    expect(screen.getByTestId('neon-violet')).toHaveTextContent('#8a2be2');
  });

  test('applies correct typography settings', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const fontFamily = screen.getByTestId('font-family');
    expect(fontFamily).toHaveTextContent("'Inter'");
  });

  test('provides animation configuration', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('animation-duration')).toHaveTextContent('200ms');
  });

  test('sets CSS custom properties on document root', () => {
    render(
      <ThemeProvider>
        <div>Theme Provider Test</div>
      </ThemeProvider>
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--color-neon-black')).toBe('#0a0a0a');
    expect(root.style.getPropertyValue('--color-neon-red')).toBe('#ff073a');
    expect(root.style.getPropertyValue('--color-neon-violet')).toBe('#8a2be2');
    expect(root.style.getPropertyValue('--font-family')).toContain('Inter');
  });

  test('applies theme styles to wrapper div', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({
      background: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh'
    });
  });
});