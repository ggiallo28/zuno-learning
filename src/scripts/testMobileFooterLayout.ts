#!/usr/bin/env bun

/**
 * Test script for mobile footer grid layout implementation
 * Tests Task 4.1 and 4.2 requirements
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

async function testMobileFooterLayout(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  try {
    // Read the HomePage component
    const homePagePath = join(process.cwd(), 'src/components/HomePage.tsx');
    const homePageContent = await readFile(homePagePath, 'utf-8');
    
    // Test 4.1: Proper 2x2 grid layout for mobile footer
    const has2x2Grid = homePageContent.includes('grid-cols-2 md:grid-cols-4');
    const hasProperGap = homePageContent.includes('gap-6 md:gap-8');
    const hasJustifyItemsCenter = homePageContent.includes('justify-items-center');
    const hasItemsStart = homePageContent.includes('items-start');
    
    results.push({
      name: '4.1.1 - 2x2 grid layout implemented for mobile',
      passed: has2x2Grid,
      details: has2x2Grid ? 
        'Found grid-cols-2 md:grid-cols-4 class for mobile 2x2 layout' : 
        'Missing grid-cols-2 md:grid-cols-4 class for mobile layout'
    });
    
    results.push({
      name: '4.1.2 - Proper spacing between grid items',
      passed: hasProperGap,
      details: hasProperGap ? 
        'Found gap-6 md:gap-8 for responsive spacing' : 
        'Missing proper gap classes for responsive spacing'
    });
    
    results.push({
      name: '4.1.3 - Grid items properly centered',
      passed: hasJustifyItemsCenter,
      details: hasJustifyItemsCenter ? 
        'Found justify-items-center for proper item alignment' : 
        'Missing justify-items-center for item alignment'
    });
    
    results.push({
      name: '4.1.4 - Grid items aligned to start',
      passed: hasItemsStart,
      details: hasItemsStart ? 
        'Found items-start for proper vertical alignment' : 
        'Missing items-start for vertical alignment'
    });
    
    // Test 4.2: Balanced content distribution
    const hasFlexColumns = homePageContent.includes('flex flex-col h-full');
    const hasFlexOne = homePageContent.includes('flex-1');
    const hasMinHeight = homePageContent.includes('min-h-[120px]');
    
    // Check if social links are simplified (no icons in footer section)
    const footerSection = homePageContent.substring(
      homePageContent.indexOf('Connetti'),
      homePageContent.indexOf('Footer Bottom')
    );
    const hasSimplifiedSocial = !footerSection.includes('w-3 h-3') && !footerSection.includes('inline-flex items-center') && footerSection.includes('Twitter');
    
    results.push({
      name: '4.2.1 - Equal column heights implemented',
      passed: hasFlexColumns,
      details: hasFlexColumns ? 
        'Found flex flex-col h-full for equal column heights' : 
        'Missing flex flex-col h-full for equal column heights'
    });
    
    results.push({
      name: '4.2.2 - Content distribution balanced',
      passed: hasFlexOne,
      details: hasFlexOne ? 
        'Found flex-1 for balanced content distribution' : 
        'Missing flex-1 for balanced content distribution'
    });
    
    results.push({
      name: '4.2.3 - Minimum height for equal quadrants',
      passed: hasMinHeight,
      details: hasMinHeight ? 
        'Found min-h-[120px] for equal quadrant dimensions' : 
        'Missing min-h-[120px] for equal quadrant dimensions'
    });
    
    results.push({
      name: '4.2.4 - Social links simplified for balance',
      passed: hasSimplifiedSocial,
      details: hasSimplifiedSocial ? 
        'Social links simplified to text-only for better balance' : 
        'Social links still have complex structure'
    });
    
    // Test grid structure
    const footerSections = homePageContent.match(/<div className="text-center flex flex-col h-full min-h-\[120px\]">/g);
    const hasAllFourSections = footerSections && footerSections.length === 4;
    
    results.push({
      name: '4.2.5 - All four footer sections properly structured',
      passed: hasAllFourSections || false,
      details: hasAllFourSections ? 
        'Found all 4 footer sections with proper flex structure and min-height' : 
        `Found ${footerSections?.length || 0} sections, expected 4`
    });
    
  } catch (error) {
    results.push({
      name: 'File Reading Error',
      passed: false,
      details: `Error reading HomePage.tsx: ${error}`
    });
  }
  
  return results;
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Mobile Footer Grid Layout Implementation\n');
  
  const results = await testMobileFooterLayout();
  
  let passedCount = 0;
  let totalCount = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    console.log(`   ${result.details}\n`);
    
    if (result.passed) passedCount++;
  });
  
  console.log(`\n📊 Test Results: ${passedCount}/${totalCount} tests passed`);
  
  if (passedCount === totalCount) {
    console.log('🎉 All mobile footer grid layout tests passed!');
    console.log('\n✅ Task 4.1: 4-column grid layout implemented');
    console.log('✅ Task 4.2: Content distribution balanced');
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
  }
  
  return passedCount === totalCount;
}

// Execute if run directly
if (import.meta.main) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { testMobileFooterLayout, runTests };