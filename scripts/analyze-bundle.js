#!/usr/bin/env node

/**
 * Bundle Analysis Script for Zuno Learning App
 * 
 * This script analyzes the build output to provide insights into bundle sizes
 * and helps identify optimization opportunities.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist', 'assets', 'js');
const CSS_DIR = join(__dirname, '..', 'dist', 'assets', 'css');
const SIZE_THRESHOLD_KB = 150; // Warn about files larger than 150KB (more realistic for vendor chunks)

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Analyzing Zuno bundle...\n');

  try {
    const jsFiles = readdirSync(DIST_DIR).filter(file => extname(file) === '.js');
    const cssFiles = readdirSync(CSS_DIR).filter(file => extname(file) === '.css');
    
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    
    const fileAnalysis = [];

    // Analyze JavaScript files
    console.log('📦 JavaScript Bundles:');
    console.log('─'.repeat(60));
    
    jsFiles.forEach(file => {
      const filePath = join(DIST_DIR, file);
      const stats = statSync(filePath);
      const sizeKB = stats.size / 1024;
      
      jsSize += stats.size;
      totalSize += stats.size;
      
      // Different thresholds for vendor vs app chunks
      const isVendor = file.includes('vendor');
      const threshold = isVendor ? 200 : 100; // 200KB for vendor, 100KB for app
      const status = sizeKB > threshold ? '⚠️ ' : '✅ ';
      console.log(`${status}${file.padEnd(35)} ${formatBytes(stats.size).padStart(10)}`);
      
      fileAnalysis.push({
        name: file,
        size: stats.size,
        type: 'js',
        large: sizeKB > threshold
      });
    });

    // Analyze CSS files
    console.log('\n🎨 CSS Bundles:');
    console.log('─'.repeat(60));
    
    cssFiles.forEach(file => {
      const filePath = join(CSS_DIR, file);
      const stats = statSync(filePath);
      const sizeKB = stats.size / 1024;
      
      cssSize += stats.size;
      totalSize += stats.size;
      
      const status = sizeKB > 50 ? '⚠️ ' : '✅ '; // Lower threshold for CSS
      console.log(`${status}${file.padEnd(35)} ${formatBytes(stats.size).padStart(10)}`);
      
      fileAnalysis.push({
        name: file,
        size: stats.size,
        type: 'css',
        large: sizeKB > 50
      });
    });

    // Summary
    console.log('\n📊 Bundle Summary:');
    console.log('─'.repeat(60));
    console.log(`Total JavaScript: ${formatBytes(jsSize)}`);
    console.log(`Total CSS:        ${formatBytes(cssSize)}`);
    console.log(`Total Assets:     ${formatBytes(totalSize)}`);
    console.log(`Number of JS chunks: ${jsFiles.length}`);
    
    // Recommendations
    console.log('\n💡 Optimization Recommendations:');
    console.log('─'.repeat(60));
    
    const largeFiles = fileAnalysis.filter(f => f.large);
    if (largeFiles.length === 0) {
      console.log('✅ All bundles are within recommended size limits!');
    } else {
      largeFiles.forEach(file => {
        console.log(`⚠️  ${file.name} (${formatBytes(file.size)}) - Consider code splitting`);
      });
    }
    
    if (jsFiles.length < 3) {
      console.log('💡 Consider implementing more aggressive code splitting');
    } else if (jsFiles.length > 10) {
      console.log('💡 Consider consolidating some smaller chunks');
    } else {
      console.log('✅ Good chunk distribution');
    }

    // Performance insights
    console.log('\n🚀 Performance Insights:');
    console.log('─'.repeat(60));
    
    const mainBundle = fileAnalysis.find(f => f.name.includes('index') && f.type === 'js');
    if (mainBundle) {
      const mainSizeKB = mainBundle.size / 1024;
      if (mainSizeKB < 200) {
        console.log('✅ Main bundle size is excellent for fast loading');
      } else if (mainSizeKB < 400) {
        console.log('⚠️  Main bundle size is acceptable but could be optimized');
      } else {
        console.log('❌ Main bundle size is too large - implement more code splitting');
      }
    }

    const vendorBundles = fileAnalysis.filter(f => f.name.includes('vendor'));
    if (vendorBundles.length > 0) {
      console.log(`✅ Found ${vendorBundles.length} vendor chunk(s) - good for caching`);
    } else {
      console.log('💡 Consider separating vendor code into dedicated chunks');
    }

  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
    console.log('\n💡 Make sure to run "bun run build" first');
  }
}

// Run analysis
analyzeBundle();