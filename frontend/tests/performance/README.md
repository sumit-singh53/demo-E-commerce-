# Performance Testing Suite

This directory contains comprehensive performance testing tools and utilities for the modern e-commerce UI project.

## Overview

The performance testing suite implements **Task 10.3** from the project specification, which includes:

- ✅ **Animation Frame Rate Testing** - Measures FPS during scroll animations
- ✅ **Bundle Size Analysis** - Tests impact of new dependencies on bundle size
- ✅ **Core Web Vitals Compliance** - Verifies LCP, FID, CLS, FCP, and TTI metrics

## Test Files

### Core Test Files

- **`PerformanceTestSuite.test.js`** - Main comprehensive test suite
- **`AnimationPerformance.test.js`** - Animation and FPS testing
- **`BundleSize.test.js`** - Bundle size and dependency impact analysis
- **`CoreWebVitals.test.js`** - Core Web Vitals compliance testing

### Utilities

- **`PerformanceTestRunner.js`** - Test runner for comprehensive performance analysis
- **`../scripts/performance-monitor.js`** - Standalone performance monitoring script
- **`../src/utils/performanceMonitor.js`** - Runtime performance monitoring utilities

## Running Performance Tests

### Quick Commands

```bash
# Run all performance tests
npm run test:performance

# Analyze current build performance
npm run analyze:performance

# Complete performance analysis (build + analyze + test)
npm run performance
```

### Individual Test Commands

```bash
# Run specific performance test categories
npm test -- --testPathPattern=AnimationPerformance --watchAll=false
npm test -- --testPathPattern=BundleSize --watchAll=false
npm test -- --testPathPattern=CoreWebVitals --watchAll=false

# Run comprehensive test suite
npm test -- --testNamePattern="Performance Test Suite" --watchAll=false
```

## Performance Metrics & Thresholds

### Animation Performance
- **Target FPS**: ≥55 average, ≥45 minimum
- **Monitoring**: Real-time FPS tracking during scroll
- **Device Detection**: Automatic capability detection for complex animations

### Bundle Size Budgets
- **Total JavaScript**: ≤1.2MB
- **Total CSS**: ≤100KB
- **Main Bundle**: ≤300KB
- **Total Size**: ≤1.5MB

### Core Web Vitals Thresholds
- **LCP (Largest Contentful Paint)**: ≤2.5 seconds
- **FID (First Input Delay)**: ≤100ms
- **CLS (Cumulative Layout Shift)**: ≤0.1
- **FCP (First Contentful Paint)**: ≤1.8 seconds
- **TTI (Time to Interactive)**: ≤3.8 seconds

## Performance Monitoring Features

### Real-time FPS Monitoring
```javascript
import performanceMonitor from '../src/utils/performanceMonitor';

// Start monitoring
performanceMonitor.startMonitoring();

// Listen for FPS updates
performanceMonitor.onFPSUpdate((fps) => {
  console.log(`Current FPS: ${fps}`);
});
```

### Device Capability Detection
```javascript
import { PerformanceMonitor } from '../src/utils/performanceMonitor';

// Check if device can handle complex animations
const canAnimate = PerformanceMonitor.canHandleComplexAnimations();

// Check for reduced motion preference
const reducedMotion = PerformanceMonitor.prefersReducedMotion();
```

### Element Optimization
```javascript
import { PerformanceMonitor } from '../src/utils/performanceMonitor';

// Optimize element for animations
PerformanceMonitor.optimizeElement(element);

// Clean up after animations
PerformanceMonitor.cleanupElement(element);
```

## Test Results & Reports

### Automated Reports
- **JSON Report**: `performance-report.json` - Detailed test results
- **Analysis Report**: `performance-analysis.json` - Bundle analysis and recommendations

### Performance Score
The performance monitoring script provides a score out of 100 based on:
- Bundle size compliance (40 points)
- Optimization implementation (30 points)
- Modern tooling usage (30 points)

### Score Interpretation
- **90-100**: 🚀 Excellent performance
- **80-89**: ✅ Good performance
- **70-79**: ⚠️ Needs improvement
- **<70**: ❌ Poor performance, optimization required

## Requirements Compliance

This testing suite ensures compliance with project requirements:

### Requirement 2.5
> "THE Frontend_Application SHALL maintain 60fps performance during all scroll animations"

**Verification**: Animation performance tests measure real FPS during scroll operations and verify ≥55fps average.

### Requirement 5.1
> "THE Frontend_Application SHALL start successfully when running npm start"

**Verification**: Bundle size analysis confirms the application builds successfully and meets performance budgets.

## Optimization Recommendations

Based on current analysis, the system provides automated recommendations:

### High Priority
- **Bundle Size**: Implement code splitting for large JavaScript bundles
- **Dependencies**: Audit and remove unused dependencies

### Medium Priority
- **CSS Optimization**: Remove unused styles and optimize CSS delivery
- **Lazy Loading**: Implement lazy loading for non-critical components

### Low Priority
- **Service Worker**: Add caching for improved repeat visits
- **Image Optimization**: Implement WebP format and lazy loading

## Development Integration

### Automatic Monitoring
In development mode, performance monitoring starts automatically:
- FPS warnings for drops below 55fps
- Console logging of performance metrics
- Real-time feedback during development

### CI/CD Integration
Performance tests can be integrated into CI/CD pipelines:
```bash
# In CI environment
npm run build
npm run test:performance
```

## Troubleshooting

### Common Issues

**Build Directory Not Found**
```bash
# Solution: Run build first
npm run build
npm run analyze:performance
```

**Low FPS Warnings**
- Check for complex CSS animations
- Verify hardware acceleration is enabled
- Consider reducing animation complexity on low-end devices

**Large Bundle Size**
- Implement code splitting
- Audit dependencies with `npm ls`
- Use dynamic imports for non-critical code

### Performance Debugging

1. **Enable Performance Monitoring**:
   ```javascript
   // In development
   import performanceMonitor from './utils/performanceMonitor';
   performanceMonitor.startMonitoring();
   ```

2. **Check Browser DevTools**:
   - Performance tab for detailed analysis
   - Network tab for bundle loading times
   - Lighthouse for Core Web Vitals

3. **Use Performance Scripts**:
   ```bash
   npm run analyze:performance  # Detailed bundle analysis
   npm run test:performance     # Comprehensive testing
   ```

## Future Enhancements

- **Real User Monitoring (RUM)**: Collect performance data from actual users
- **Performance Budgets**: Automated CI/CD performance budget enforcement
- **Advanced Metrics**: Additional performance metrics like INP (Interaction to Next Paint)
- **Visual Regression**: Screenshot-based performance impact testing

---

For more information about performance optimization techniques, see the [Design Document](../../.kiro/specs/modern-ecommerce-ui/design.md) and [Requirements](../../.kiro/specs/modern-ecommerce-ui/requirements.md).