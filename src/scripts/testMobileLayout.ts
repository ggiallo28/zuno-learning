/**
 * Test script for mobile layout improvements
 * Verifies that mobile layout issues have been resolved
 */

// Test mobile layout improvements
function testMobileLayoutFixes() {
  console.log('🔍 Testing Mobile Layout Fixes...\n');

  const results: Array<{ test: string; passed: boolean; message: string }> = [];

  // Test 1: Check if pricing cards have consistent structure
  try {
    const pricingSection = document.querySelector('#pricing');
    if (pricingSection) {
      const cards = pricingSection.querySelectorAll('.grid > div');
      const flexCard = Array.from(cards).find(card => 
        card.textContent?.includes('Flex')
      );
      
      if (flexCard) {
        const title = flexCard.querySelector('h3, h2, h1');
        const hasConsistentTitle = title?.classList.contains('text-2xl');
        results.push({
          test: 'Flex plan title size consistency',
          passed: !!hasConsistentTitle,
          message: hasConsistentTitle ? 'Flex title is consistent with other plans' : 'Flex title needs size adjustment'
        });
      }
    }
  } catch (error) {
    results.push({
      test: 'Flex plan title size consistency',
      passed: false,
      message: `Error: ${error}`
    });
  }

  // Test 2: Check footer alignment
  try {
    const footer = document.querySelector('#footer');
    if (footer) {
      const footerGrid = footer.querySelector('.grid');
      const hasProperAlignment = footerGrid?.classList.contains('max-w-4xl');
      results.push({
        test: 'Footer alignment and centering',
        passed: !!hasProperAlignment,
        message: hasProperAlignment ? 'Footer is properly aligned and centered' : 'Footer alignment needs adjustment'
      });
    }
  } catch (error) {
    results.push({
      test: 'Footer alignment and centering',
      passed: false,
      message: `Error: ${error}`
    });
  }

  // Test 3: Check hero section centering
  try {
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      const heroContainer = heroSection.querySelector('.container');
      const hasFlexCentering = heroContainer?.classList.contains('flex') && 
                              heroContainer?.classList.contains('items-center');
      results.push({
        test: 'Hero section mobile centering',
        passed: !!hasFlexCentering,
        message: hasFlexCentering ? 'Hero section is properly centered' : 'Hero section centering needs adjustment'
      });
    }
  } catch (error) {
    results.push({
      test: 'Hero section mobile centering',
      passed: false,
      message: `Error: ${error}`
    });
  }

  // Test 4: Check newsletter form consistency
  try {
    const newsletter = document.querySelector('.bg-background\\/10');
    if (newsletter) {
      const form = newsletter.querySelector('.flex');
      const hasMaxWidth = form?.classList.contains('max-w-md');
      results.push({
        test: 'Newsletter form consistency',
        passed: !!hasMaxWidth,
        message: hasMaxWidth ? 'Newsletter form has consistent margins' : 'Newsletter form margins need adjustment'
      });
    }
  } catch (error) {
    results.push({
      test: 'Newsletter form consistency',
      passed: false,
      message: `Error: ${error}`
    });
  }

  // Print results
  results.forEach(({ test, passed, message }) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${message}`);
  });

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log(`\n📊 Mobile Layout Test Summary: ${passed}/${total} (${percentage}%)`);
  
  if (percentage >= 90) {
    console.log('🎉 Excellent! Mobile layout issues have been resolved.');
  } else if (percentage >= 75) {
    console.log('👍 Good! Most mobile layout issues have been resolved.');
  } else {
    console.log('⚠️  Some mobile layout issues still need attention.');
  }

  return { passed, total, percentage, results };
}

// Run test if in browser environment
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testMobileLayoutFixes);
  } else {
    testMobileLayoutFixes();
  }
}

export { testMobileLayoutFixes };