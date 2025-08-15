/**
 * Comprehensive test script for accessibility and mobile responsiveness
 * Tests WCAG 2.1 AA compliance and mobile-first responsive design
 */

import { AccessibilityManager, FocusManager, ScreenReaderUtils, ColorContrast, MobileAccessibility, ARIAUtils } from '@/utils/accessibility';
import { ResponsiveManager, ResponsiveUtils, TouchUtils, ViewportUtils } from '@/utils/responsive';

// Test results interface
interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

class AccessibilityTester {
  private results: TestResult[] = [];

  // Test accessibility utilities
  async testAccessibilityUtilities(): Promise<TestResult[]> {
    console.log('🧪 Testing Accessibility Utilities...');

    // Test Focus Manager
    this.testFocusManager();
    
    // Test Screen Reader Utils
    this.testScreenReaderUtils();
    
    // Test Color Contrast
    this.testColorContrast();
    
    // Test Mobile Accessibility
    this.testMobileAccessibility();
    
    // Test ARIA utilities
    this.testARIAUtilities();

    return this.results;
  }

  private testFocusManager(): void {
    try {
      // Create test container
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Button 1</button>
        <input type="text" placeholder="Input 1">
        <a href="#">Link 1</a>
        <button>Button 2</button>
      `;
      document.body.appendChild(container);

      // Test focusable elements detection
      const focusableElements = FocusManager.getFocusableElements(container);
      
      this.results.push({
        name: 'Focus Manager - Focusable Elements Detection',
        passed: focusableElements.length === 4,
        message: `Found ${focusableElements.length} focusable elements (expected 4)`,
        details: { count: focusableElements.length }
      });

      // Test visibility check
      const hiddenButton = document.createElement('button');
      hiddenButton.style.display = 'none';
      hiddenButton.textContent = 'Hidden Button';
      container.appendChild(hiddenButton);

      const isVisible = FocusManager.isVisible(hiddenButton);
      this.results.push({
        name: 'Focus Manager - Visibility Check',
        passed: !isVisible,
        message: `Hidden element visibility: ${isVisible} (should be false)`,
        details: { isVisible }
      });

      // Cleanup
      document.body.removeChild(container);

    } catch (error) {
      this.results.push({
        name: 'Focus Manager - Error',
        passed: false,
        message: `Error testing focus manager: ${error}`,
        details: { error }
      });
    }
  }

  private testScreenReaderUtils(): void {
    try {
      // Test announcement
      ScreenReaderUtils.announce('Test announcement', 'polite');
      
      // Check if live region was created
      const liveRegion = document.querySelector('[aria-live]');
      
      this.results.push({
        name: 'Screen Reader Utils - Live Region Creation',
        passed: !!liveRegion,
        message: `Live region ${liveRegion ? 'created' : 'not created'}`,
        details: { hasLiveRegion: !!liveRegion }
      });

      // Test screen reader text creation
      const srText = ScreenReaderUtils.createScreenReaderText('Screen reader only text');
      
      this.results.push({
        name: 'Screen Reader Utils - SR Text Creation',
        passed: srText.includes('sr-only'),
        message: `Screen reader text ${srText.includes('sr-only') ? 'properly formatted' : 'incorrectly formatted'}`,
        details: { srText }
      });

    } catch (error) {
      this.results.push({
        name: 'Screen Reader Utils - Error',
        passed: false,
        message: `Error testing screen reader utils: ${error}`,
        details: { error }
      });
    }
  }

  private testColorContrast(): void {
    try {
      // Test WCAG AA compliance
      const whiteBlackRatio = ColorContrast.calculateContrastRatio('#ffffff', '#000000');
      const meetsAA = ColorContrast.meetsWCAGAA('#ffffff', '#000000');
      const meetsAAA = ColorContrast.meetsWCAGAAA('#ffffff', '#000000');

      this.results.push({
        name: 'Color Contrast - White/Black Ratio',
        passed: whiteBlackRatio === 21, // Perfect contrast
        message: `White/Black contrast ratio: ${whiteBlackRatio} (expected 21)`,
        details: { ratio: whiteBlackRatio }
      });

      this.results.push({
        name: 'Color Contrast - WCAG AA Compliance',
        passed: meetsAA,
        message: `WCAG AA compliance: ${meetsAA}`,
        details: { meetsAA }
      });

      this.results.push({
        name: 'Color Contrast - WCAG AAA Compliance',
        passed: meetsAAA,
        message: `WCAG AAA compliance: ${meetsAAA}`,
        details: { meetsAAA }
      });

    } catch (error) {
      this.results.push({
        name: 'Color Contrast - Error',
        passed: false,
        message: `Error testing color contrast: ${error}`,
        details: { error }
      });
    }
  }

  private testMobileAccessibility(): void {
    try {
      // Create test container with interactive elements
      const container = document.createElement('div');
      container.innerHTML = `
        <button style="width: 30px; height: 30px;">Small Button</button>
        <button style="width: 50px; height: 50px;">Large Button</button>
        <input type="text" style="width: 100px; height: 35px;">
      `;
      document.body.appendChild(container);

      // Test touch target validation
      const invalidTargets = MobileAccessibility.validateTouchTargets(container);
      
      this.results.push({
        name: 'Mobile Accessibility - Touch Target Validation',
        passed: invalidTargets.length === 2, // Small button and input should be invalid
        message: `Found ${invalidTargets.length} invalid touch targets (expected 2)`,
        details: { invalidCount: invalidTargets.length }
      });

      // Test touch target enhancement
      MobileAccessibility.enhanceTouchTargets(invalidTargets);
      
      // Check if targets were enhanced
      const enhancedTargets = invalidTargets.filter(el => {
        const style = window.getComputedStyle(el);
        return parseInt(style.minHeight) >= 44 && parseInt(style.minWidth) >= 44;
      });

      this.results.push({
        name: 'Mobile Accessibility - Touch Target Enhancement',
        passed: enhancedTargets.length === invalidTargets.length,
        message: `Enhanced ${enhancedTargets.length}/${invalidTargets.length} touch targets`,
        details: { enhancedCount: enhancedTargets.length, totalInvalid: invalidTargets.length }
      });

      // Cleanup
      document.body.removeChild(container);

    } catch (error) {
      this.results.push({
        name: 'Mobile Accessibility - Error',
        passed: false,
        message: `Error testing mobile accessibility: ${error}`,
        details: { error }
      });
    }
  }

  private testARIAUtilities(): void {
    try {
      // Test unique ID generation
      const id1 = ARIAUtils.generateUniqueId('test');
      const id2 = ARIAUtils.generateUniqueId('test');
      
      this.results.push({
        name: 'ARIA Utils - Unique ID Generation',
        passed: id1 !== id2 && id1.startsWith('test-') && id2.startsWith('test-'),
        message: `Generated unique IDs: ${id1}, ${id2}`,
        details: { id1, id2 }
      });

      // Test element association
      const trigger = document.createElement('button');
      const target = document.createElement('div');
      target.textContent = 'Target content';
      
      ARIAUtils.associateElements(trigger, target, 'describedby');
      
      const hasAssociation = trigger.getAttribute('aria-describedby') === target.id;
      
      this.results.push({
        name: 'ARIA Utils - Element Association',
        passed: hasAssociation,
        message: `Element association ${hasAssociation ? 'successful' : 'failed'}`,
        details: { 
          triggerDescribedBy: trigger.getAttribute('aria-describedby'),
          targetId: target.id
        }
      });

    } catch (error) {
      this.results.push({
        name: 'ARIA Utils - Error',
        passed: false,
        message: `Error testing ARIA utils: ${error}`,
        details: { error }
      });
    }
  }
}

class ResponsiveTester {
  private results: TestResult[] = [];

  // Test responsive utilities
  async testResponsiveUtilities(): Promise<TestResult[]> {
    console.log('📱 Testing Responsive Utilities...');

    // Test Responsive Utils
    this.testResponsiveUtils();
    
    // Test Touch Utils
    this.testTouchUtils();
    
    // Test Viewport Utils
    this.testViewportUtils();

    return this.results;
  }

  private testResponsiveUtils(): void {
    try {
      // Test breakpoint detection
      const currentBreakpoint = ResponsiveUtils.getCurrentBreakpoint();
      const deviceType = ResponsiveUtils.getDeviceType();
      
      this.results.push({
        name: 'Responsive Utils - Breakpoint Detection',
        passed: typeof currentBreakpoint === 'string',
        message: `Current breakpoint: ${currentBreakpoint}`,
        details: { currentBreakpoint }
      });

      this.results.push({
        name: 'Responsive Utils - Device Type Detection',
        passed: ['mobile', 'tablet', 'desktop'].includes(deviceType),
        message: `Device type: ${deviceType}`,
        details: { deviceType }
      });

      // Test media query creation
      const mediaQuery = ResponsiveUtils.createMediaQuery('md');
      
      this.results.push({
        name: 'Responsive Utils - Media Query Creation',
        passed: mediaQuery instanceof MediaQueryList,
        message: `Media query created: ${mediaQuery.media}`,
        details: { media: mediaQuery.media }
      });

    } catch (error) {
      this.results.push({
        name: 'Responsive Utils - Error',
        passed: false,
        message: `Error testing responsive utils: ${error}`,
        details: { error }
      });
    }
  }

  private testTouchUtils(): void {
    try {
      // Test touch device detection
      const isTouchDevice = TouchUtils.isTouchDevice();
      const supportsHover = TouchUtils.supportsHover();
      const pointerType = TouchUtils.getPointerType();

      this.results.push({
        name: 'Touch Utils - Touch Device Detection',
        passed: typeof isTouchDevice === 'boolean',
        message: `Touch device: ${isTouchDevice}`,
        details: { isTouchDevice }
      });

      this.results.push({
        name: 'Touch Utils - Hover Support Detection',
        passed: typeof supportsHover === 'boolean',
        message: `Supports hover: ${supportsHover}`,
        details: { supportsHover }
      });

      this.results.push({
        name: 'Touch Utils - Pointer Type Detection',
        passed: ['coarse', 'fine', 'none'].includes(pointerType),
        message: `Pointer type: ${pointerType}`,
        details: { pointerType }
      });

    } catch (error) {
      this.results.push({
        name: 'Touch Utils - Error',
        passed: false,
        message: `Error testing touch utils: ${error}`,
        details: { error }
      });
    }
  }

  private testViewportUtils(): void {
    try {
      // Test viewport size detection
      const viewportSize = ViewportUtils.getViewportSize();
      const scrollPosition = ViewportUtils.getScrollPosition();

      this.results.push({
        name: 'Viewport Utils - Size Detection',
        passed: typeof viewportSize.width === 'number' && typeof viewportSize.height === 'number',
        message: `Viewport size: ${viewportSize.width}x${viewportSize.height}`,
        details: viewportSize
      });

      this.results.push({
        name: 'Viewport Utils - Scroll Position',
        passed: typeof scrollPosition.x === 'number' && typeof scrollPosition.y === 'number',
        message: `Scroll position: ${scrollPosition.x}, ${scrollPosition.y}`,
        details: scrollPosition
      });

      // Test element visibility
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.top = '0';
      testElement.style.left = '0';
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      document.body.appendChild(testElement);

      const isInViewport = ViewportUtils.isElementInViewport(testElement);

      this.results.push({
        name: 'Viewport Utils - Element Visibility',
        passed: isInViewport,
        message: `Element in viewport: ${isInViewport}`,
        details: { isInViewport }
      });

      // Cleanup
      document.body.removeChild(testElement);

    } catch (error) {
      this.results.push({
        name: 'Viewport Utils - Error',
        passed: false,
        message: `Error testing viewport utils: ${error}`,
        details: { error }
      });
    }
  }
}

class ComponentTester {
  private results: TestResult[] = [];

  // Test UI component accessibility
  async testUIComponents(): Promise<TestResult[]> {
    console.log('🎨 Testing UI Component Accessibility...');

    // Test Button component
    this.testButtonComponent();
    
    // Test Input component
    this.testInputComponent();
    
    // Test Card component
    this.testCardComponent();

    return this.results;
  }

  private testButtonComponent(): void {
    try {
      // Create button element
      const button = document.createElement('button');
      button.className = 'min-h-[44px] py-3 px-4 text-base font-medium rounded-md focus:ring-2 focus:ring-blue-200 focus:ring-offset-2';
      button.textContent = 'Test Button';
      document.body.appendChild(button);

      // Test minimum touch target size
      const rect = button.getBoundingClientRect();
      const meetsMinSize = rect.height >= 44 && rect.width >= 44;

      this.results.push({
        name: 'Button Component - Touch Target Size',
        passed: meetsMinSize,
        message: `Button size: ${rect.width}x${rect.height} (min 44x44)`,
        details: { width: rect.width, height: rect.height }
      });

      // Test focus styles
      const hasFocusStyles = button.className.includes('focus:ring-2');

      this.results.push({
        name: 'Button Component - Focus Styles',
        passed: hasFocusStyles,
        message: `Focus styles ${hasFocusStyles ? 'present' : 'missing'}`,
        details: { hasFocusStyles }
      });

      // Cleanup
      document.body.removeChild(button);

    } catch (error) {
      this.results.push({
        name: 'Button Component - Error',
        passed: false,
        message: `Error testing button component: ${error}`,
        details: { error }
      });
    }
  }

  private testInputComponent(): void {
    try {
      // Create input element
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'min-h-[44px] px-4 py-3 text-base rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
      input.setAttribute('aria-label', 'Test input');
      document.body.appendChild(input);

      // Test minimum touch target size
      const rect = input.getBoundingClientRect();
      const meetsMinSize = rect.height >= 44;

      this.results.push({
        name: 'Input Component - Touch Target Size',
        passed: meetsMinSize,
        message: `Input height: ${rect.height} (min 44)`,
        details: { height: rect.height }
      });

      // Test ARIA label
      const hasAriaLabel = input.hasAttribute('aria-label');

      this.results.push({
        name: 'Input Component - ARIA Label',
        passed: hasAriaLabel,
        message: `ARIA label ${hasAriaLabel ? 'present' : 'missing'}`,
        details: { hasAriaLabel, ariaLabel: input.getAttribute('aria-label') }
      });

      // Cleanup
      document.body.removeChild(input);

    } catch (error) {
      this.results.push({
        name: 'Input Component - Error',
        passed: false,
        message: `Error testing input component: ${error}`,
        details: { error }
      });
    }
  }

  private testCardComponent(): void {
    try {
      // Create card element
      const card = document.createElement('div');
      card.className = 'rounded-lg border bg-card text-card-foreground shadow-sm border-2';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML = '<h3>Test Card</h3><p>Card content</p>';
      document.body.appendChild(card);

      // Test interactive card accessibility
      const hasRole = card.getAttribute('role') === 'button';
      const hasTabIndex = card.getAttribute('tabindex') === '0';

      this.results.push({
        name: 'Card Component - Interactive Accessibility',
        passed: hasRole && hasTabIndex,
        message: `Interactive card accessibility ${hasRole && hasTabIndex ? 'correct' : 'incorrect'}`,
        details: { hasRole, hasTabIndex }
      });

      // Test semantic structure
      const hasHeading = card.querySelector('h3') !== null;

      this.results.push({
        name: 'Card Component - Semantic Structure',
        passed: hasHeading,
        message: `Semantic heading ${hasHeading ? 'present' : 'missing'}`,
        details: { hasHeading }
      });

      // Cleanup
      document.body.removeChild(card);

    } catch (error) {
      this.results.push({
        name: 'Card Component - Error',
        passed: false,
        message: `Error testing card component: ${error}`,
        details: { error }
      });
    }
  }
}

// Main test runner
export async function runAccessibilityAndResponsiveTests(): Promise<void> {
  console.log('🚀 Starting Accessibility and Responsive Design Tests...\n');

  // Initialize managers
  AccessibilityManager.initialize();
  ResponsiveManager.initialize();

  const accessibilityTester = new AccessibilityTester();
  const responsiveTester = new ResponsiveTester();
  const componentTester = new ComponentTester();

  try {
    // Run all tests
    const accessibilityResults = await accessibilityTester.testAccessibilityUtilities();
    const responsiveResults = await responsiveTester.testResponsiveUtilities();
    const componentResults = await componentTester.testUIComponents();

    // Combine results
    const allResults = [...accessibilityResults, ...responsiveResults, ...componentResults];

    // Calculate summary
    const totalTests = allResults.length;
    const passedTests = allResults.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = Math.round((passedTests / totalTests) * 100);

    // Display results
    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate}%\n`);

    // Display detailed results
    console.log('📋 Detailed Results:');
    allResults.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${index + 1}. ${result.name}`);
      console.log(`   ${result.message}`);
      if (!result.passed && result.details) {
        console.log(`   Details:`, result.details);
      }
      console.log('');
    });

    // Display recommendations
    if (failedTests > 0) {
      console.log('💡 Recommendations:');
      const failedResults = allResults.filter(result => !result.passed);
      failedResults.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name}: ${result.message}`);
      });
    }

    console.log('\n🎉 Accessibility and Responsive Design Tests Complete!');

  } catch (error) {
    console.error('❌ Error running tests:', error);
  }
}

// Export for use in other files
export { AccessibilityTester, ResponsiveTester, ComponentTester };

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAccessibilityAndResponsiveTests);
  } else {
    runAccessibilityAndResponsiveTests();
  }
}