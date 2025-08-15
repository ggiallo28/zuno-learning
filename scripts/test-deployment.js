#!/usr/bin/env node

// Simple test to verify the deployment is working
import https from 'https';

const CLOUDFRONT_URL = 'https://d2zrgcpjugs332.cloudfront.net';

function testEndpoint(path, expectedContent) {
  return new Promise((resolve, reject) => {
    https.get(`${CLOUDFRONT_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const success = data.includes(expectedContent);
        console.log(`✅ ${path}: ${success ? 'PASS' : 'FAIL'} (${res.statusCode})`);
        if (!success) {
          console.log(`   Expected: ${expectedContent}`);
          console.log(`   Got: ${data.substring(0, 200)}...`);
        }
        resolve(success);
      });
    }).on('error', (err) => {
      console.log(`❌ ${path}: ERROR - ${err.message}`);
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Zuno deployment...\n');
  
  try {
    // Test main page
    await testEndpoint('/', 'Zuno:// - Personalized Learning Platform');
    
    // Test JavaScript files have correct content-type
    const jsResponse = await new Promise((resolve) => {
      https.get(`${CLOUDFRONT_URL}/assets/index-LeYhfLCh.js`, (res) => {
        console.log(`✅ JS Content-Type: ${res.headers['content-type'] === 'application/javascript' ? 'PASS' : 'FAIL'} (${res.headers['content-type']})`);
        resolve(res.headers['content-type'] === 'application/javascript');
      });
    });
    
    // Test CSS files
    const cssResponse = await new Promise((resolve) => {
      https.get(`${CLOUDFRONT_URL}/assets/index-CcgRPAQO.css`, (res) => {
        console.log(`✅ CSS Content-Type: ${res.headers['content-type'] === 'text/css' ? 'PASS' : 'FAIL'} (${res.headers['content-type']})`);
        resolve(res.headers['content-type'] === 'text/css');
      });
    });
    
    console.log('\n🎉 Deployment test completed!');
    console.log(`🌐 Application URL: ${CLOUDFRONT_URL}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();