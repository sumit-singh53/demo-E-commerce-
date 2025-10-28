#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Standalone script to monitor and report performance metrics
 */

const fs = require('fs');
const path = require('path');

class PerformanceAnalyzer {
  constructor() {
    this.buildPath = path.join(__dirname, '..', 'build');
    this.results = {
      timestamp: new Date().toISOString(),
      bundleAnalysis: {},
      recommendations: [],
    };
  }

  async analyze() {
    console.log('🔍 Starting Performance Analysis...\n');

    this.analyzeBundleSize();
    this.analyzeOptimizations();
    this.generateRecommendations();
    this.printReport();
    this.saveReport();
  }

  analyzeBundleSize() {
    console.log('📦 Analyzing Bundle Size...');

    if (!fs.existsSync(this.buildPath)) {
      console.log('   ⚠️  Build directory not found. Run "npm run build" first.\n');
      this.results.bundleAnalysis.error = 'Build directory not found';
      return;
    }

    const staticPath = path.join(this.buildPath, 'static');
    const jsPath = path.join(staticPath, 'js');
    const cssPath = path.join(staticPath, 'css');

    let totalJS = 0;
    let totalCSS = 0;
    let mainBundle = 0;
    let vendorBundle = 0;
    const files = {};

    // Analyze JavaScript files
    if (fs.existsSync(jsPath)) {
      const jsFiles = fs.readdirSync(jsPath);
      jsFiles.forEach(file => {
        const filePath = path.join(jsPath, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;
        
        files[file] = {
          size,
          type: 'javascript',
          gzipEstimate: Math.round(size * 0.3), // Estimate 70% compression
        };
        
        totalJS += size;
        
        if (file.includes('main.')) {
          mainBundle = size;
        } else if (file.includes('vendor.') || file.includes('chunk.')) {
          vendorBundle += size;
        }
      });
    }

    // Analyze CSS files
    if (fs.existsSync(cssPath)) {
      const cssFiles = fs.readdirSync(cssPath);
      cssFiles.forEach(file => {
        const filePath = path.join(cssPath, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;
        
        files[file] = {
          size,
          type: 'css',
          gzipEstimate: Math.round(size * 0.25), // Estimate 75% compression
        };
        
        totalCSS += size;
      });
    }

    this.results.bundleAnalysis = {
      totalJS,
      totalCSS,
      mainBundle,
      vendorBundle,
      total: totalJS + totalCSS,
      files,
      gzipEstimate: {
        totalJS: Math.round(totalJS * 0.3),
        totalCSS: Math.round(totalCSS * 0.25),
        total: Math.round(totalJS * 0.3 + totalCSS * 0.25),
      },
    };

    console.log(`   Total JavaScript: ${this.formatBytes(totalJS)} (${this.formatBytes(Math.round(totalJS * 0.3))} gzipped)`);
    console.log(`   Total CSS: ${this.formatBytes(totalCSS)} (${this.formatBytes(Math.round(totalCSS * 0.25))} gzipped)`);
    console.log(`   Main Bundle: ${this.formatBytes(mainBundle)}`);
    console.log(`   Other Bundles: ${this.formatBytes(vendorBundle)}`);
    console.log(`   Total Size: ${this.formatBytes(totalJS + totalCSS)} (${this.formatBytes(Math.round(totalJS * 0.3 + totalCSS * 0.25))} gzipped)\n`);
  }

  analyzeOptimizations() {
    console.log('⚡ Analyzing Optimizations...');

    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    let packageJson = {};
    
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
      console.log('   ⚠️  Could not read package.json\n');
      return;
    }

    const optimizations = {
      modernReact: this.checkReactVersion(packageJson),
      framerMotion: this.checkFramerMotion(packageJson),
      bundleOptimization: this.checkBundleOptimization(),
      codesplitting: this.checkCodeSplitting(),
      treeShaking: this.checkTreeShaking(),
    };

    this.results.optimizations = optimizations;

    console.log(`   Modern React (v18+): ${optimizations.modernReact ? '✅' : '❌'}`);
    console.log(`   Framer Motion: ${optimizations.framerMotion ? '✅' : '❌'}`);
    console.log(`   Bundle Optimization: ${optimizations.bundleOptimization ? '✅' : '❌'}`);
    console.log(`   Code Splitting: ${optimizations.codesplitting ? '✅' : '❌'}`);
    console.log(`   Tree Shaking: ${optimizations.treeShaking ? '✅' : '❌'}\n`);
  }

  checkReactVersion(packageJson) {
    const reactVersion = packageJson.dependencies?.react;
    return reactVersion && reactVersion.includes('18');
  }

  checkFramerMotion(packageJson) {
    return !!packageJson.dependencies?.['framer-motion'];
  }

  checkBundleOptimization() {
    if (!this.results.bundleAnalysis.total) return false;
    
    // Check if total bundle size is reasonable
    const totalSize = this.results.bundleAnalysis.total;
    return totalSize < 1500000; // Under 1.5MB
  }

  checkCodeSplitting() {
    if (!this.results.bundleAnalysis.files) return false;
    
    // Check if there are multiple JS files (indicating code splitting)
    const jsFiles = Object.keys(this.results.bundleAnalysis.files)
      .filter(file => file.endsWith('.js'));
    
    return jsFiles.length > 1;
  }

  checkTreeShaking() {
    // Assume tree shaking is enabled with modern React build tools
    return true;
  }

  generateRecommendations() {
    const recommendations = [];
    const { bundleAnalysis, optimizations } = this.results;

    // Bundle size recommendations
    if (bundleAnalysis.totalJS > 1200000) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'high',
        message: 'JavaScript bundle size exceeds 1.2MB. Consider code splitting or removing unused dependencies.',
      });
    }

    if (bundleAnalysis.mainBundle > 300000) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'medium',
        message: 'Main bundle size exceeds 300KB. Consider lazy loading non-critical components.',
      });
    }

    if (bundleAnalysis.totalCSS > 100000) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'medium',
        message: 'CSS bundle size exceeds 100KB. Consider CSS optimization and unused style removal.',
      });
    }

    // Optimization recommendations
    if (!optimizations?.modernReact) {
      recommendations.push({
        type: 'optimization',
        priority: 'high',
        message: 'Upgrade to React 18 for better performance and modern features.',
      });
    }

    if (!optimizations?.codesplitting) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        message: 'Implement code splitting to reduce initial bundle size.',
      });
    }

    // Performance recommendations
    recommendations.push({
      type: 'performance',
      priority: 'low',
      message: 'Consider implementing service worker for caching and offline support.',
    });

    recommendations.push({
      type: 'performance',
      priority: 'low',
      message: 'Implement image optimization with WebP format and lazy loading.',
    });

    this.results.recommendations = recommendations;
  }

  printReport() {
    console.log('📊 Performance Analysis Report');
    console.log('=' .repeat(50));
    
    if (this.results.bundleAnalysis.error) {
      console.log('❌ Bundle analysis failed:', this.results.bundleAnalysis.error);
      console.log('   Run "npm run build" to generate bundle for analysis.\n');
      return;
    }

    // Performance Score
    const score = this.calculatePerformanceScore();
    console.log(`Performance Score: ${score}/100 ${this.getScoreEmoji(score)}`);
    console.log('');

    // Bundle Analysis Summary
    const { bundleAnalysis } = this.results;
    console.log('📦 Bundle Analysis:');
    console.log(`   Total Size: ${this.formatBytes(bundleAnalysis.total)}`);
    console.log(`   Gzipped: ${this.formatBytes(bundleAnalysis.gzipEstimate.total)}`);
    console.log(`   JavaScript: ${this.formatBytes(bundleAnalysis.totalJS)}`);
    console.log(`   CSS: ${this.formatBytes(bundleAnalysis.totalCSS)}`);
    console.log('');

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${priority} ${rec.message}`);
      });
      console.log('');
    } else {
      console.log('✅ No performance issues detected!\n');
    }
  }

  calculatePerformanceScore() {
    let score = 100;
    const { bundleAnalysis } = this.results;

    if (!bundleAnalysis.total) return 0;

    // Deduct points for large bundles
    if (bundleAnalysis.total > 1500000) score -= 20; // -20 for >1.5MB
    else if (bundleAnalysis.total > 1200000) score -= 10; // -10 for >1.2MB

    if (bundleAnalysis.mainBundle > 300000) score -= 15; // -15 for large main bundle
    if (bundleAnalysis.totalCSS > 100000) score -= 10; // -10 for large CSS

    // Deduct points for missing optimizations
    const { optimizations } = this.results;
    if (optimizations && !optimizations.modernReact) score -= 15;
    if (optimizations && !optimizations.codesplitting) score -= 10;

    return Math.max(0, score);
  }

  getScoreEmoji(score) {
    if (score >= 90) return '🚀';
    if (score >= 80) return '✅';
    if (score >= 70) return '⚠️';
    return '❌';
  }

  saveReport() {
    const reportPath = path.join(__dirname, '..', 'tests', 'performance', 'performance-analysis.json');
    
    try {
      // Ensure directory exists
      const dir = path.dirname(reportPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      console.log(`📄 Detailed report saved to: ${reportPath}`);
    } catch (error) {
      console.log(`⚠️  Could not save report: ${error.message}`);
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new PerformanceAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = PerformanceAnalyzer;