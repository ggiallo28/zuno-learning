#!/usr/bin/env bun

/**
 * Bundle Optimization Test Script
 * 
 * This script verifies that all code splitting and bundle optimization
 * features are working correctly in the Zuno learning app.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const results: TestResult[] = [];

function addResult(name: string, passed: boolean, message: string, details?: any) {
  results.push({ name, passed, message, details });
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}: ${message}`);
  if (details && !passed) {
    console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
  }
}

function testBundleStructure() {
  console.log('\n🔍 Testing Bundle Structure...');
  
  try {
    const distDir = join(process.cwd(), 'dist', 'assets');
    const files = readdirSync(distDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    const cssFiles = files.filter(file => file.endsWith('.css'));
    
    // Test 1: Multiple JS chunks exist
    addResult(
      'Multiple JS Chunks',
      jsFiles.length >= 10,
      `Found ${jsFiles.length} JS chunks (expected ≥10)`,
      { jsFiles: jsFiles.length }
    );
    
    // Test 2: Main bundle is small
    const mainBundle = jsFiles.find(file => file.includes('index'));
    if (mainBundle) {
      const mainBundlePath = join(distDir, mainBundle);
      const mainBundleSize = statSync(mainBundlePath).size;
      const mainBundleSizeKB = mainBundleSize / 1024;
      
      addResult(
        'Small Main Bundle',
        mainBundleSizeKB < 20,
        `Main bundle is ${mainBundleSizeKB.toFixed(2)}KB (expected <20KB)`,
        { sizeKB: mainBundleSizeKB }
      );
    } else {
      addResult('Small Main Bundle', false, 'Main bundle not found');
    }
    
    // Test 3: Vendor chunks exist
    const vendorChunks = jsFiles.filter(file => file.includes('vendor'));
    addResult(
      'Vendor Chunks',
      vendorChunks.length >= 3,
      `Found ${vendorChunks.length} vendor chunks (expected ≥3)`,
      { vendorChunks: vendorChunks.length }
    );
    
    // Test 4: Feature chunks exist
    const featureChunks = jsFiles.filter(file => 
      file.includes('auth') || 
      file.includes('learning') || 
      file.includes('coaching')
    );
    addResult(
      'Feature Chunks',
      featureChunks.length >= 3,
      `Found ${featureChunks.length} feature chunks (expected ≥3)`,
      { featureChunks: featureChunks.length }
    );
    
    // Test 5: CSS bundle exists and is reasonable size
    if (cssFiles.length > 0) {
      const cssFile = cssFiles[0];
      const cssPath = join(distDir, cssFile);
      const cssSize = statSync(cssPath).size;
      const cssSizeKB = cssSize / 1024;
      
      addResult(
        'CSS Bundle Size',
        cssSizeKB < 100,
        `CSS bundle is ${cssSizeKB.toFixed(2)}KB (expected <100KB)`,
        { sizeKB: cssSizeKB }
      );
    } else {
      addResult('CSS Bundle Size', false, 'No CSS bundle found');
    }
    
  } catch (error) {
    addResult('Bundle Structure', false, `Error reading dist directory: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function testLazyLoadingImplementation() {
  console.log('\n🔍 Testing Lazy Loading Implementation...');
  
  try {
    // Test 1: Main app has lazy imports
    const appFile = readFileSync(join(process.cwd(), 'src', 'app', 'app.tsx'), 'utf-8');
    
    addResult(
      'App Lazy Imports',
      appFile.includes('lazy(') && appFile.includes('Suspense'),
      'Main app implements lazy loading with Suspense',
      { hasLazy: appFile.includes('lazy('), hasSuspense: appFile.includes('Suspense') }
    );
    
    // Test 2: AuthenticatedApp has lazy imports
    const authAppFile = readFileSync(join(process.cwd(), 'src', 'components', 'AuthenticatedApp.tsx'), 'utf-8');
    
    addResult(
      'AuthenticatedApp Lazy Imports',
      authAppFile.includes('lazy(') && authAppFile.includes('Suspense'),
      'AuthenticatedApp implements lazy loading',
      { hasLazy: authAppFile.includes('lazy('), hasSuspense: authAppFile.includes('Suspense') }
    );
    
    // Test 3: Preloader utility exists
    const preloaderFile = readFileSync(join(process.cwd(), 'src', 'utils', 'preloader.ts'), 'utf-8');
    
    addResult(
      'Preloader Utility',
      preloaderFile.includes('preloadCriticalRoutes') && preloaderFile.includes('preloadWhenIdle'),
      'Preloader utility implements critical route preloading',
      { 
        hasCriticalRoutes: preloaderFile.includes('preloadCriticalRoutes'),
        hasIdlePreload: preloaderFile.includes('preloadWhenIdle')
      }
    );
    
  } catch (error) {
    addResult('Lazy Loading Implementation', false, `Error reading source files: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function testPerformanceMonitoring() {
  console.log('\n🔍 Testing Performance Monitoring...');
  
  try {
    // Test 1: Performance utility exists
    const perfFile = readFileSync(join(process.cwd(), 'src', 'utils', 'performance.ts'), 'utf-8');
    
    addResult(
      'Performance Monitoring',
      perfFile.includes('measureComponentLoad') && perfFile.includes('initPerformanceMonitoring'),
      'Performance monitoring utility is implemented',
      {
        hasMeasurement: perfFile.includes('measureComponentLoad'),
        hasInit: perfFile.includes('initPerformanceMonitoring')
      }
    );
    
    // Test 2: Bundle analyzer exists
    const analyzerFile = readFileSync(join(process.cwd(), 'scripts', 'analyze-bundle.js'), 'utf-8');
    
    addResult(
      'Bundle Analyzer',
      analyzerFile.includes('analyzeBundle') && analyzerFile.includes('formatBytes'),
      'Bundle analyzer script is implemented',
      {
        hasAnalyzer: analyzerFile.includes('analyzeBundle'),
        hasFormatter: analyzerFile.includes('formatBytes')
      }
    );
    
  } catch (error) {
    addResult('Performance Monitoring', false, `Error reading performance files: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function testViteConfiguration() {
  console.log('\n🔍 Testing Vite Configuration...');
  
  try {
    const viteConfigFile = readFileSync(join(process.cwd(), 'vite.config.ts'), 'utf-8');
    
    // Test 1: Manual chunks configuration
    addResult(
      'Manual Chunks Config',
      viteConfigFile.includes('manualChunks') && viteConfigFile.includes('vendor-'),
      'Vite config implements manual chunking strategy',
      {
        hasManualChunks: viteConfigFile.includes('manualChunks'),
        hasVendorChunks: viteConfigFile.includes('vendor-')
      }
    );
    
    // Test 2: Chunk size warning limit
    addResult(
      'Chunk Size Warning',
      viteConfigFile.includes('chunkSizeWarningLimit'),
      'Vite config sets appropriate chunk size warning limit',
      { hasChunkSizeLimit: viteConfigFile.includes('chunkSizeWarningLimit') }
    );
    
    // Test 3: Optimization dependencies
    addResult(
      'Optimization Dependencies',
      viteConfigFile.includes('optimizeDeps') && viteConfigFile.includes('include'),
      'Vite config optimizes critical dependencies',
      {
        hasOptimizeDeps: viteConfigFile.includes('optimizeDeps'),
        hasInclude: viteConfigFile.includes('include')
      }
    );
    
  } catch (error) {
    addResult('Vite Configuration', false, `Error reading vite config: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function testPackageJsonScripts() {
  console.log('\n🔍 Testing Package.json Scripts...');
  
  try {
    const packageFile = readFileSync(join(process.cwd(), 'package.json'), 'utf-8');
    const packageJson = JSON.parse(packageFile);
    
    // Test 1: Build analyze script
    addResult(
      'Build Analyze Script',
      packageJson.scripts['build:analyze'] !== undefined,
      'Package.json includes build:analyze script',
      { script: packageJson.scripts['build:analyze'] }
    );
    
    // Test 2: Analyze script
    addResult(
      'Analyze Script',
      packageJson.scripts['analyze'] !== undefined,
      'Package.json includes analyze script',
      { script: packageJson.scripts['analyze'] }
    );
    
  } catch (error) {
    addResult('Package.json Scripts', false, `Error reading package.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function printSummary() {
  console.log('\n📊 Test Summary');
  console.log('═'.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);
  
  console.log(`Tests Passed: ${passed}/${total} (${percentage}%)`);
  
  if (passed === total) {
    console.log('🎉 All bundle optimization tests passed!');
    console.log('\n✨ Bundle optimization is working correctly:');
    console.log('   • Code splitting implemented');
    console.log('   • Lazy loading active');
    console.log('   • Performance monitoring enabled');
    console.log('   • Bundle analysis available');
    console.log('   • Vite configuration optimized');
  } else {
    console.log('\n❌ Some tests failed. Please review the issues above.');
    
    const failedTests = results.filter(r => !r.passed);
    console.log('\nFailed Tests:');
    failedTests.forEach(test => {
      console.log(`   • ${test.name}: ${test.message}`);
    });
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('   • Run "bun run build:analyze" to see bundle analysis');
  console.log('   • Monitor performance in development mode');
  console.log('   • Check Network tab in DevTools for chunk loading');
}

// Run all tests
console.log('🧪 Bundle Optimization Test Suite');
console.log('═'.repeat(50));

testBundleStructure();
testLazyLoadingImplementation();
testPerformanceMonitoring();
testViteConfiguration();
testPackageJsonScripts();
printSummary();

// Exit with appropriate code
const allPassed = results.every(r => r.passed);
process.exit(allPassed ? 0 : 1);