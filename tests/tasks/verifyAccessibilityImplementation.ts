/**
 * Verification script for accessibility and responsive implementation
 * This script verifies that all required files and utilities are properly implemented
 */

import { existsSync, readFileSync } from 'fs';
// import { join } from 'path';

interface VerificationResult {
  name: string;
  passed: boolean;
  message: string;
}

class AccessibilityImplementationVerifier {
  private results: VerificationResult[] = [];

  private addResult(name: string, passed: boolean, message: string) {
    this.results.push({ name, passed, message });
    console.log(`${passed ? '✅' : '❌'} ${name}: ${message}`);
  }

  // Verify file existence and basic structure
  verifyFileStructure() {
    console.log('\n📁 Verifying File Structure...\n');

    const requiredFiles = [
      'src/utils/accessibility.ts',
      'src/utils/responsive.ts',
      'src/hooks/useAccessibility.ts',
      'src/hooks/useResponsive.ts',
      'src/components/ui/button.tsx',
      'src/components/ui/input.tsx',
      'src/components/ui/card.tsx',
      'src/app/globals.css',
      'docs/ACCESSIBILITY_AND_MOBILE.md'
    ];

    requiredFiles.forEach(file => {
      const exists = existsSync(file);
      this.addResult(
        `File: ${file}`,
        exists,
        exists ? 'File exists' : 'File missing'
      );
    });
  }

  // Verify accessibility utilities implementation
  verifyAccessibilityUtilities() {
    console.log('\n♿ Verifying Accessibility Utilities...\n');

    try {
      const accessibilityFile = readFileSync('src/utils/accessibility.ts', 'utf-8');
      
      const requiredClasses = [
        'FocusManager',
        'ScreenReaderUtils',
        'KeyboardNavigation',
        'ARIAUtils',
        'ColorContrast',
        'MobileAccessibility',
        'ReducedMotion',
        'HighContrast',
        'AccessibilityTesting',
        'AccessibleFormUtils',
        'AccessibleLoadingUtils',
        'AccessibleModalUtils'
      ];

      requiredClasses.forEach(className => {
        const hasClass = accessibilityFile.includes(`export class ${className}`);
        this.addResult(
          `Accessibility class: ${className}`,
          hasClass,
          hasClass ? 'Class implemented' : 'Class missing'
        );
      });

      // Check for key methods
      const requiredMethods = [
        'trapFocus',
        'announce',
        'handleArrowNavigation',
        'generateId',
        'getContrastRatio',
        'validateTouchTarget',
        'prefersReducedMotion'
      ];

      requiredMethods.forEach(method => {
        const hasMethod = accessibilityFile.includes(method);
        this.addResult(
          `Accessibility method: ${method}`,
          hasMethod,
          hasMethod ? 'Method implemented' : 'Method missing'
        );
      });

    } catch (error) {
      this.addResult('Accessibility utilities verification', false, `Error: ${error}`);
    }
  }

  // Verify responsive utilities implementation
  verifyResponsiveUtilities() {
    console.log('\n📱 Verifying Responsive Utilities...\n');

    try {
      const responsiveFile = readFileSync('src/utils/responsive.ts', 'utf-8');
      
      const requiredClasses = [
        'ResponsiveUtils',
        'TouchUtils',
        'ViewportUtils',
        'ResponsiveGridUtils',
        'ResponsiveTypography',
        'MediaQueryUtils',
        'ContainerQueryUtils',
        'MobileNavigationUtils',
        'ResponsiveComponentUtils',
        'MobilePerformanceUtils'
      ];

      requiredClasses.forEach(className => {
        const hasClass = responsiveFile.includes(`export class ${className}`);
        this.addResult(
          `Responsive class: ${className}`,
          hasClass,
          hasClass ? 'Class implemented' : 'Class missing'
        );
      });

      // Check for breakpoints
      const hasBreakpoints = responsiveFile.includes('export const BREAKPOINTS');
      this.addResult(
        'Breakpoints configuration',
        hasBreakpoints,
        hasBreakpoints ? 'Breakpoints defined' : 'Breakpoints missing'
      );

    } catch (error) {
      this.addResult('Responsive utilities verification', false, `Error: ${error}`);
    }
  }

  // Verify accessibility hooks implementation
  verifyAccessibilityHooks() {
    console.log('\n🎣 Verifying Accessibility Hooks...\n');

    try {
      const hooksFile = readFileSync('src/hooks/useAccessibility.ts', 'utf-8');
      
      const requiredHooks = [
        'useFocusTrap',
        'useKeyboardNavigation',
        'useScreenReader',
        'useARIA',
        'useReducedMotion',
        'useHighContrast',
        'useAccessibleForm',
        'useAccessibleLoading',
        'useAccessibleTooltip',
        'useSkipLinks',
        'useAccessibleNotifications',
        'useAccessibleTable',
        'useAccessibleCarousel',
        'useAccessibleProgress'
      ];

      requiredHooks.forEach(hook => {
        const hasHook = hooksFile.includes(`export function ${hook}`);
        this.addResult(
          `Accessibility hook: ${hook}`,
          hasHook,
          hasHook ? 'Hook implemented' : 'Hook missing'
        );
      });

    } catch (error) {
      this.addResult('Accessibility hooks verification', false, `Error: ${error}`);
    }
  }

  // Verify responsive hooks implementation
  verifyResponsiveHooks() {
    console.log('\n📱 Verifying Responsive Hooks...\n');

    try {
      const hooksFile = readFileSync('src/hooks/useResponsive.ts', 'utf-8');
      
      const requiredHooks = [
        'useBreakpoint',
        'useMediaQuery',
        'useTouch',
        'useViewport',
        'useResponsiveGrid',
        'useResponsiveText',
        'useResponsiveNavigation',
        'useResponsiveImage',
        'useOrientation',
        'useContainerQuery',
        'useResponsiveComponent',
        'useResponsiveModal',
        'useResponsiveForm',
        'useResponsiveTable',
        'useResponsiveCarousel',
        'useResponsiveLayout'
      ];

      requiredHooks.forEach(hook => {
        const hasHook = hooksFile.includes(`export function ${hook}`);
        this.addResult(
          `Responsive hook: ${hook}`,
          hasHook,
          hasHook ? 'Hook implemented' : 'Hook missing'
        );
      });

    } catch (error) {
      this.addResult('Responsive hooks verification', false, `Error: ${error}`);
    }
  }

  // Verify CSS enhancements
  verifyCSSEnhancements() {
    console.log('\n🎨 Verifying CSS Enhancements...\n');

    try {
      const cssFile = readFileSync('src/app/globals.css', 'utf-8');
      
      const requiredClasses = [
        '.sr-only',
        '.skip-link',
        '.focus-visible:focus-visible',
        '.touch-target',
        '.safe-area-all',
        '.text-responsive-base',
        '.touch-friendly',
        '.grid-responsive',
        '[aria-invalid="true"]',
        '[aria-required="true"]',
        '[aria-busy="true"]',
        '[aria-disabled="true"]'
      ];

      requiredClasses.forEach(className => {
        const hasClass = cssFile.includes(className);
        this.addResult(
          `CSS class: ${className}`,
          hasClass,
          hasClass ? 'Class implemented' : 'Class missing'
        );
      });

      // Check for media queries
      const hasReducedMotion = cssFile.includes('@media (prefers-reduced-motion: reduce)');
      const hasHighContrast = cssFile.includes('@media (prefers-contrast: high)');
      const hasMobileQueries = cssFile.includes('@media (max-width: 767px)');

      this.addResult('Reduced motion support', hasReducedMotion, hasReducedMotion ? 'Implemented' : 'Missing');
      this.addResult('High contrast support', hasHighContrast, hasHighContrast ? 'Implemented' : 'Missing');
      this.addResult('Mobile media queries', hasMobileQueries, hasMobileQueries ? 'Implemented' : 'Missing');

    } catch (error) {
      this.addResult('CSS enhancements verification', false, `Error: ${error}`);
    }
  }

  // Verify component enhancements
  verifyComponentEnhancements() {
    console.log('\n🧩 Verifying Component Enhancements...\n');

    const components = [
      { file: 'src/components/ui/button.tsx', name: 'Button' },
      { file: 'src/components/ui/input.tsx', name: 'Input' },
      { file: 'src/components/ui/card.tsx', name: 'Card' }
    ];

    components.forEach(({ file, name }) => {
      try {
        const componentFile = readFileSync(file, 'utf-8');
        
        // Check for accessibility props
        const hasAriaProps = componentFile.includes('aria-');
        const hasMinHeight = componentFile.includes('min-h-[44px]') || componentFile.includes('min-height');
        const hasFocusStyles = componentFile.includes('focus-visible:');
        const hasTouchSupport = componentFile.includes('touch-manipulation');

        this.addResult(`${name} ARIA support`, hasAriaProps, hasAriaProps ? 'ARIA props implemented' : 'ARIA props missing');
        this.addResult(`${name} touch targets`, hasMinHeight, hasMinHeight ? 'Touch targets implemented' : 'Touch targets missing');
        this.addResult(`${name} focus styles`, hasFocusStyles, hasFocusStyles ? 'Focus styles implemented' : 'Focus styles missing');
        this.addResult(`${name} touch support`, hasTouchSupport, hasTouchSupport ? 'Touch support implemented' : 'Touch support missing');

      } catch (error) {
        this.addResult(`${name} component verification`, false, `Error: ${error}`);
      }
    });
  }

  // Verify documentation
  verifyDocumentation() {
    console.log('\n📚 Verifying Documentation...\n');

    try {
      const docFile = readFileSync('docs/ACCESSIBILITY_AND_MOBILE.md', 'utf-8');
      
      const requiredSections = [
        '# Accessibility and Mobile Responsiveness Guide',
        '## Accessibility Features',
        '## Mobile Responsiveness',
        '## Implementation Guide',
        '## Testing and Validation',
        '## Best Practices',
        '## Troubleshooting'
      ];

      requiredSections.forEach(section => {
        const hasSection = docFile.includes(section);
        this.addResult(
          `Documentation section: ${section.replace('#', '').trim()}`,
          hasSection,
          hasSection ? 'Section present' : 'Section missing'
        );
      });

      // Check for code examples
      const hasCodeExamples = docFile.includes('```typescript') || docFile.includes('```css');
      this.addResult('Code examples', hasCodeExamples, hasCodeExamples ? 'Code examples present' : 'Code examples missing');

    } catch (error) {
      this.addResult('Documentation verification', false, `Error: ${error}`);
    }
  }

  // Run all verifications
  runAllVerifications() {
    console.log('🚀 Starting Accessibility and Responsive Implementation Verification...\n');
    
    this.verifyFileStructure();
    this.verifyAccessibilityUtilities();
    this.verifyResponsiveUtilities();
    this.verifyAccessibilityHooks();
    this.verifyResponsiveHooks();
    this.verifyCSSEnhancements();
    this.verifyComponentEnhancements();
    this.verifyDocumentation();
    
    // Summary
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);
    
    console.log('\n📊 Verification Summary:');
    console.log(`✅ Passed: ${passed}/${total} (${percentage}%)`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    
    if (percentage >= 95) {
      console.log('\n🎉 Excellent! All accessibility and responsive features are properly implemented.');
    } else if (percentage >= 85) {
      console.log('\n👍 Good! Most accessibility and responsive features are implemented.');
    } else {
      console.log('\n⚠️  Some accessibility and responsive features need attention.');
    }
    
    // Show failed tests
    const failedTests = this.results.filter(r => !r.passed);
    if (failedTests.length > 0) {
      console.log('\n🔧 Items needing attention:');
      failedTests.forEach(test => {
        console.log(`   • ${test.name}: ${test.message}`);
      });
    }
    
    return {
      passed,
      total,
      percentage,
      results: this.results
    };
  }
}

// Run verification
const verifier = new AccessibilityImplementationVerifier();
verifier.runAllVerifications();