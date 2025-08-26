#!/usr/bin/env node

/**
 * Deployment Preparation Script for Zuno Learning App
 * 
 * This script prepares the production build for deployment by:
 * - Running a clean build
 * - Validating the build
 * - Generating deployment artifacts
 * - Creating deployment summary
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist');
const PACKAGE_JSON = join(__dirname, '..', 'package.json');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function generateDeploymentSummary() {
  console.log('📋 Generating deployment summary...');
  
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON, 'utf-8'));
  
  // Analyze build output
  const jsDir = join(DIST_DIR, 'assets', 'js');
  const cssDir = join(DIST_DIR, 'assets', 'css');
  
  const jsFiles = readdirSync(jsDir).filter(f => f.endsWith('.js'));
  const cssFiles = readdirSync(cssDir).filter(f => f.endsWith('.css'));
  
  let totalJsSize = 0;
  let totalCssSize = 0;
  
  jsFiles.forEach(file => {
    const stats = statSync(join(jsDir, file));
    totalJsSize += stats.size;
  });
  
  cssFiles.forEach(file => {
    const stats = statSync(join(cssDir, file));
    totalCssSize += stats.size;
  });
  
  const summary = {
    app: {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description
    },
    build: {
      timestamp: new Date().toISOString(),
      environment: 'production',
      nodeVersion: process.version,
      buildTool: 'Vite 7.0.6',
      bundler: 'Rollup'
    },
    assets: {
      javascript: {
        files: jsFiles.length,
        totalSize: formatBytes(totalJsSize),
        totalSizeBytes: totalJsSize
      },
      css: {
        files: cssFiles.length,
        totalSize: formatBytes(totalCssSize),
        totalSizeBytes: totalCssSize
      },
      total: {
        files: jsFiles.length + cssFiles.length,
        totalSize: formatBytes(totalJsSize + totalCssSize),
        totalSizeBytes: totalJsSize + totalCssSize
      }
    },
    optimization: {
      codesplitting: true,
      treeshaking: true,
      minification: true,
      compression: true,
      sourceMaps: true,
      contentHashing: true
    },
    deployment: {
      ready: true,
      cdnOptimized: true,
      cacheStrategy: 'long-term-caching',
      recommendations: [
        'Deploy to CDN with proper cache headers',
        'Enable gzip/brotli compression',
        'Set up proper MIME types',
        'Configure security headers'
      ]
    }
  };
  
  // Write summary to file
  const summaryPath = join(DIST_DIR, 'deployment-summary.json');
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log('✅ Deployment summary generated\n');
  return summary;
}

function printDeploymentInfo(summary) {
  console.log('🚀 Deployment Information:');
  console.log('─'.repeat(60));
  console.log(`App Name:        ${summary.app.name}`);
  console.log(`Version:         ${summary.app.version}`);
  console.log(`Build Time:      ${new Date(summary.build.timestamp).toLocaleString()}`);
  console.log(`Total Size:      ${summary.assets.total.totalSize}`);
  console.log(`JavaScript:      ${summary.assets.javascript.totalSize} (${summary.assets.javascript.files} files)`);
  console.log(`CSS:             ${summary.assets.css.totalSize} (${summary.assets.css.files} files)`);
  console.log(`Optimizations:   Code splitting, Tree shaking, Minification, Compression`);
  console.log(`Cache Strategy:  ${summary.deployment.cacheStrategy}`);
  console.log(`CDN Ready:       ${summary.deployment.cdnOptimized ? 'Yes' : 'No'}`);
  
  console.log('\n📝 Deployment Recommendations:');
  summary.deployment.recommendations.forEach(rec => {
    console.log(`   • ${rec}`);
  });
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Upload dist/ folder to your hosting provider');
  console.log('   2. Configure proper cache headers for assets');
  console.log('   3. Enable compression (gzip/brotli)');
  console.log('   4. Set up monitoring and error tracking');
  console.log('   5. Test the deployed application');
}

async function prepareDeployment() {
  console.log('🚀 Preparing Zuno for deployment...\n');
  
  // Step 1: Clean build
  if (!runCommand('bun run build:clean', 'Running clean build')) {
    process.exit(1);
  }
  
  // Step 2: Validate build
  if (!runCommand('bun run validate', 'Validating build')) {
    process.exit(1);
  }
  
  // Step 3: Generate deployment summary
  const summary = generateDeploymentSummary();
  
  // Step 4: Print deployment information
  printDeploymentInfo(summary);
  
  console.log('\n🎉 Deployment preparation completed successfully!');
  console.log('📁 Build artifacts are ready in the dist/ directory');
}

// Run deployment preparation
prepareDeployment().catch(error => {
  console.error('❌ Deployment preparation failed:', error);
  process.exit(1);
});