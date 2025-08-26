#!/usr/bin/env node

/**
 * Build Validation Script for Zuno Learning App
 * 
 * This script validates the production build to ensure it meets
 * deployment requirements and performance standards.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist');
const ASSETS_DIR = join(DIST_DIR, 'assets');

// Validation thresholds
const THRESHOLDS = {
  maxMainBundleSize: 200 * 1024, // 200KB
  maxVendorChunkSize: 500 * 1024, // 500KB
  maxTotalSize: 2 * 1024 * 1024, // 2MB
  maxChunks: 30,
  minCompressionRatio: 0.3 // 30% compression minimum
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function validateBuild() {
  console.log('🔍 Validating production build...\n');

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: []
  };

  // Check if dist directory exists
  if (!existsSync(DIST_DIR)) {
    results.errors.push('❌ Dist directory does not exist. Run "bun run build" first.');
    return results;
  }

  // Check if index.html exists
  const indexPath = join(DIST_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    results.errors.push('❌ index.html not found in dist directory');
    results.failed++;
  } else {
    console.log('✅ index.html exists');
    results.passed++;
  }

  // Check if assets directory exists
  if (!existsSync(ASSETS_DIR)) {
    results.errors.push('❌ Assets directory does not exist');
    results.failed++;
    return results;
  }

  // Analyze JavaScript bundles
  const files = readdirSync(ASSETS_DIR, { recursive: true });
  const jsFiles = files.filter(file => typeof file === 'string' && extname(file) === '.js');
  const cssFiles = files.filter(file => typeof file === 'string' && extname(file) === '.css');

  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;

  console.log('📦 Analyzing JavaScript bundles:');
  console.log('─'.repeat(60));

  // Validate JavaScript files
  jsFiles.forEach(file => {
    const filePath = join(ASSETS_DIR, file);
    const stats = statSync(filePath);
    const size = stats.size;
    
    totalSize += size;
    jsSize += size;

    console.log(`   ${file.padEnd(35)} ${formatBytes(size).padStart(10)}`);

    // Check main bundle size
    if (file.includes('index') && size > THRESHOLDS.maxMainBundleSize) {
      results.errors.push(`⚠️  Main bundle ${file} is too large: ${formatBytes(size)} (max: ${formatBytes(THRESHOLDS.maxMainBundleSize)})`);
      results.warnings++;
    }

    // Check vendor chunk size
    if (file.includes('vendor') && size > THRESHOLDS.maxVendorChunkSize) {
      results.errors.push(`⚠️  Vendor chunk ${file} is too large: ${formatBytes(size)} (max: ${formatBytes(THRESHOLDS.maxVendorChunkSize)})`);
      results.warnings++;
    }
  });

  console.log('\n🎨 Analyzing CSS bundles:');
  console.log('─'.repeat(60));

  // Validate CSS files
  cssFiles.forEach(file => {
    const filePath = join(ASSETS_DIR, file);
    const stats = statSync(filePath);
    const size = stats.size;
    
    totalSize += size;
    cssSize += size;

    console.log(`   ${file.padEnd(35)} ${formatBytes(size).padStart(10)}`);
  });

  // Overall size validation
  console.log('\n📊 Build Summary:');
  console.log('─'.repeat(60));
  console.log(`Total JavaScript: ${formatBytes(jsSize)}`);
  console.log(`Total CSS:        ${formatBytes(cssSize)}`);
  console.log(`Total Size:       ${formatBytes(totalSize)}`);
  console.log(`Number of JS chunks: ${jsFiles.length}`);

  // Validate total size
  if (totalSize > THRESHOLDS.maxTotalSize) {
    results.errors.push(`❌ Total bundle size is too large: ${formatBytes(totalSize)} (max: ${formatBytes(THRESHOLDS.maxTotalSize)})`);
    results.failed++;
  } else {
    console.log('✅ Total bundle size is within limits');
    results.passed++;
  }

  // Validate number of chunks
  if (jsFiles.length > THRESHOLDS.maxChunks) {
    results.errors.push(`⚠️  Too many JavaScript chunks: ${jsFiles.length} (max: ${THRESHOLDS.maxChunks})`);
    results.warnings++;
  } else {
    console.log('✅ Number of chunks is reasonable');
    results.passed++;
  }

  // Validate index.html content
  try {
    const indexContent = readFileSync(indexPath, 'utf-8');
    
    // Check for essential meta tags
    if (!indexContent.includes('<meta charset="UTF-8"') && !indexContent.includes('<meta charset="utf-8"')) {
      results.errors.push('⚠️  Missing charset meta tag in index.html');
      results.warnings++;
    } else {
      console.log('✅ Charset meta tag is present');
      results.passed++;
    }
    
    if (!indexContent.includes('viewport')) {
      results.errors.push('⚠️  Missing viewport meta tag in index.html');
      results.warnings++;
    }
    
    // Check for script tags (should have hashed filenames)
    const scriptMatches = indexContent.match(/<script[^>]*src="[^"]*"[^>]*>/g);
    if (scriptMatches) {
      const hasHashedScripts = scriptMatches.some(script => script.includes('-') && script.includes('.js'));
      if (hasHashedScripts) {
        console.log('✅ Scripts have content hashes for caching');
        results.passed++;
      } else {
        results.errors.push('⚠️  Scripts may not have content hashes');
        results.warnings++;
      }
    }

    // Check for CSS links (should have hashed filenames)
    const linkMatches = indexContent.match(/<link[^>]*href="[^"]*\.css"[^>]*>/g);
    if (linkMatches) {
      const hasHashedCSS = linkMatches.some(link => link.includes('-') && link.includes('.css'));
      if (hasHashedCSS) {
        console.log('✅ CSS files have content hashes for caching');
        results.passed++;
      } else {
        results.errors.push('⚠️  CSS files may not have content hashes');
        results.warnings++;
      }
    }

  } catch (error) {
    results.errors.push(`❌ Error reading index.html: ${error.message}`);
    results.failed++;
  }

  // Check for source maps (should exist but not be referenced in production)
  const mapFiles = files.filter(file => typeof file === 'string' && file.endsWith('.map'));
  if (mapFiles.length > 0) {
    console.log(`✅ Found ${mapFiles.length} source map files for debugging`);
    results.passed++;
  } else {
    results.errors.push('⚠️  No source map files found');
    results.warnings++;
  }

  return results;
}

function printResults(results) {
  console.log('\n🎯 Validation Results:');
  console.log('─'.repeat(60));
  
  if (results.errors.length > 0) {
    console.log('\n📋 Issues Found:');
    results.errors.forEach(error => console.log(error));
  }

  console.log(`\n✅ Passed: ${results.passed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log(`❌ Failed: ${results.failed}`);

  if (results.failed === 0) {
    console.log('\n🎉 Build validation passed! Ready for deployment.');
    return true;
  } else {
    console.log('\n❌ Build validation failed. Please fix the issues above.');
    return false;
  }
}

// Run validation
const results = validateBuild();
const success = printResults(results);

// Exit with appropriate code
process.exit(success ? 0 : 1);