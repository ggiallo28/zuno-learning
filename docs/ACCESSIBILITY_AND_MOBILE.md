# Accessibility and Mobile Responsiveness Guide

## Overview

This document provides comprehensive guidance on the accessibility and mobile responsiveness features implemented in the Zuno learning platform. The implementation follows WCAG 2.1 AA standards and mobile-first design principles to ensure an inclusive and optimal user experience across all devices and abilities.

## Table of Contents

1. [Accessibility Features](#accessibility-features)
2. [Mobile Responsiveness](#mobile-responsiveness)
3. [Implementation Guide](#implementation-guide)
4. [Testing and Validation](#testing-and-validation)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Accessibility Features

### WCAG 2.1 AA Compliance

Our implementation meets WCAG 2.1 AA standards across four main principles:

#### 1. Perceivable
- **Color Contrast**: Minimum 4.5:1 contrast ratio for normal text, 3:1 for large text
- **Alternative Text**: All images have descriptive alt text
- **Responsive Text**: Text scales up to 200% without loss of functionality
- **Visual Focus Indicators**: Clear 2px outline with offset for all interactive elements

#### 2. Operable
- **Keyboard Navigation**: All functionality available via keyboard
- **Touch Targets**: Minimum 44px touch targets for mobile devices
- **No Seizures**: No content flashes more than 3 times per second
- **Skip Links**: "Skip to main content" link for screen reader users

#### 3. Understandable
- **Semantic HTML**: Proper heading hierarchy (h1-h6)
- **Form Labels**: All form controls have associated labels
- **Error Messages**: Clear, specific error messages with suggestions
- **Consistent Navigation**: Predictable navigation patterns

#### 4. Robust
- **Valid HTML**: Clean, semantic markup
- **ARIA Support**: Comprehensive ARIA labels and roles
- **Screen Reader Compatible**: Works with NVDA, JAWS, VoiceOver
- **Progressive Enhancement**: Works without JavaScript

### Key Accessibility Utilities

#### Focus Management
```typescript
import { FocusManager } from '@/utils/accessibility';

// Trap focus in modals
const cleanup = FocusManager.trapFocus(modalElement);

// Get focusable elements
const focusableElements = FocusManager.getFocusableElements(container);

// Restore focus
FocusManager.restoreFocus(previousElement);
```

#### Screen Reader Support
```typescript
import { ScreenReaderUtils } from '@/utils/accessibility';

// Announce to screen readers
ScreenReaderUtils.announce('Form submitted successfully', 'polite');

// Create screen reader only text
const srText = ScreenReaderUtils.createScreenReaderText('Required field');
```

#### Keyboard Navigation
```typescript
import { KeyboardNavigation } from '@/utils/accessibility';

// Handle arrow key navigation
const newIndex = KeyboardNavigation.handleArrowNavigation(
  event, items, currentIndex, 'vertical'
);

// Make element keyboard accessible
const cleanup = KeyboardNavigation.makeKeyboardAccessible(
  element, onClick, 'button'
);
```

### Accessibility Hooks

#### Focus Trap Hook
```typescript
import { useFocusTrap } from '@/hooks/useAccessibility';

function Modal({ isOpen }) {
  const containerRef = useFocusTrap(isOpen);
  
  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  );
}
```

#### Screen Reader Hook
```typescript
import { useScreenReader } from '@/hooks/useAccessibility';

function Component() {
  const { announce } = useScreenReader();
  
  const handleSubmit = () => {
    // Submit form
    announce('Form submitted successfully', 'polite');
  };
}
```

#### Accessible Form Hook
```typescript
import { useAccessibleForm } from '@/hooks/useAccessibility';

function ContactForm() {
  const {
    errors,
    setFieldError,
    getFieldProps,
    getErrorProps
  } = useAccessibleForm();
  
  return (
    <form>
      <input
        {...getFieldProps('email')}
        type="email"
        placeholder="Email"
      />
      <div {...getErrorProps('email')}>
        {errors.email}
      </div>
    </form>
  );
}
```

## Mobile Responsiveness

### Mobile-First Design Principles

Our responsive design follows mobile-first principles:

1. **Base styles target mobile devices** (320px+)
2. **Progressive enhancement** for larger screens
3. **Touch-friendly interactions** with 44px minimum targets
4. **Optimized performance** for mobile networks
5. **Accessible across all devices** and screen sizes

### Breakpoint System

```css
/* Mobile First Breakpoints */
/* xs: 0px - 639px (default, no prefix) */
/* sm: 640px+ */
/* md: 768px+ */
/* lg: 1024px+ */
/* xl: 1280px+ */
/* 2xl: 1536px+ */
```

### Responsive Utilities

#### Breakpoint Detection
```typescript
import { useBreakpoint } from '@/hooks/useResponsive';

function Component() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint();
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      Current breakpoint: {breakpoint}
    </div>
  );
}
```

#### Touch Device Support
```typescript
import { useTouch } from '@/hooks/useResponsive';

function Component() {
  const { isTouchDevice, makeTouchFriendly, addSwipeGesture } = useTouch();
  
  useEffect(() => {
    if (isTouchDevice) {
      makeTouchFriendly(buttonRef.current);
    }
  }, [isTouchDevice, makeTouchFriendly]);
}
```

#### Responsive Layout Hook
```typescript
import { useResponsiveLayout } from '@/hooks/useResponsive';

function Component() {
  const {
    getContainerProps,
    getSectionProps,
    getGridProps,
    getTextProps
  } = useResponsiveLayout();
  
  return (
    <div {...getContainerProps()}>
      <section {...getSectionProps()}>
        <div {...getGridProps({ mobile: 1, tablet: 2, desktop: 3 })}>
          <p {...getTextProps()}>Responsive text</p>
        </div>
      </section>
    </div>
  );
}
```

### CSS Responsive Features

#### Fluid Typography
```css
.text-responsive-base {
  font-size: clamp(1rem, 3vw, 1.125rem);
}

.text-responsive-lg {
  font-size: clamp(1.125rem, 3.5vw, 1.25rem);
}
```

#### Safe Area Support
```css
.safe-area-all {
  padding: max(1rem, env(safe-area-inset-top)) 
           max(1rem, env(safe-area-inset-right)) 
           max(1rem, env(safe-area-inset-bottom)) 
           max(1rem, env(safe-area-inset-left));
}
```

#### Touch-Friendly Elements
```css
.touch-friendly {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem;
  touch-action: manipulation;
  user-select: none;
}
```

## Implementation Guide

### Setting Up Accessibility

1. **Import utilities and hooks**:
```typescript
import { 
  FocusManager, 
  ScreenReaderUtils, 
  ARIAUtils 
} from '@/utils/accessibility';
import { 
  useFocusTrap, 
  useScreenReader, 
  useAccessibleForm 
} from '@/hooks/useAccessibility';
```

2. **Add semantic HTML structure**:
```html
<main role="main">
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section Title</h2>
    <!-- Content -->
  </section>
</main>
```

3. **Implement keyboard navigation**:
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handleClick();
      break;
    case 'Escape':
      handleClose();
      break;
  }
};
```

### Setting Up Responsive Design

1. **Use mobile-first CSS**:
```css
/* Mobile styles (default) */
.component {
  padding: 1rem;
  font-size: 1rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
    font-size: 1.25rem;
  }
}
```

2. **Implement responsive components**:
```typescript
import { useResponsiveComponent } from '@/hooks/useResponsive';

function Component() {
  const config = useResponsiveComponent({
    mobile: { columns: 1, spacing: 'compact' },
    tablet: { columns: 2, spacing: 'normal' },
    desktop: { columns: 3, spacing: 'spacious' }
  });
  
  return <div className={`grid-cols-${config.columns}`} />;
}
```

### Component Enhancement Examples

#### Enhanced Button Component
```typescript
<Button
  aria-label="Submit form"
  aria-describedby="submit-help"
  loading={isSubmitting}
  loadingText="Submitting..."
>
  Submit
</Button>
<div id="submit-help" className="sr-only">
  This will submit your form data
</div>
```

#### Enhanced Input Component
```typescript
<Input
  aria-label="Email address"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
  error={hasError}
/>
{hasError && (
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
)}
```

#### Enhanced Card Component
```typescript
<Card
  interactive
  aria-labelledby="card-title"
  aria-describedby="card-description"
  onClick={handleClick}
>
  <CardTitle id="card-title">Card Title</CardTitle>
  <CardDescription id="card-description">
    Card description text
  </CardDescription>
</Card>
```

## Testing and Validation

### Automated Testing

Run the comprehensive test suite:
```bash
bun run src/scripts/testAccessibilityAndResponsive.ts
```

The test suite covers:
- ✅ Accessibility utilities functionality
- ✅ Responsive utilities functionality
- ✅ UI component accessibility
- ✅ CSS accessibility features
- ✅ Mobile responsiveness
- ✅ WCAG 2.1 AA compliance
- ✅ Enhanced accessibility features
- ✅ Touch target validation

### Manual Testing Checklist

#### Accessibility Testing
- [ ] Navigate entire app using only keyboard
- [ ] Test with screen reader (VoiceOver, NVDA, JAWS)
- [ ] Verify color contrast meets 4.5:1 ratio
- [ ] Check focus indicators are visible
- [ ] Validate form error messages
- [ ] Test skip links functionality
- [ ] Verify heading hierarchy
- [ ] Check ARIA labels and roles

#### Mobile Testing
- [ ] Test on actual mobile devices
- [ ] Verify touch targets are 44px minimum
- [ ] Check responsive breakpoints
- [ ] Test mobile navigation
- [ ] Verify text remains readable when zoomed to 200%
- [ ] Check safe area support on notched devices
- [ ] Test landscape and portrait orientations
- [ ] Verify performance on slower networks

### Browser Testing Matrix

| Browser | Desktop | Mobile | Screen Reader |
|---------|---------|--------|---------------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ (VoiceOver) |
| Edge | ✅ | ✅ | ✅ |

## Best Practices

### Accessibility Best Practices

1. **Always provide alternative text** for images
2. **Use semantic HTML** elements (nav, main, section, article)
3. **Ensure keyboard navigation** works for all interactive elements
4. **Provide clear focus indicators** with sufficient contrast
5. **Use ARIA labels** when semantic HTML isn't sufficient
6. **Test with actual assistive technologies**
7. **Maintain logical heading hierarchy**
8. **Provide clear error messages** with recovery suggestions

### Mobile Best Practices

1. **Design mobile-first** then enhance for larger screens
2. **Use relative units** (rem, em, %) instead of fixed pixels
3. **Optimize touch targets** to be at least 44px
4. **Consider thumb-friendly navigation** placement
5. **Optimize images** for different screen densities
6. **Test on real devices** not just browser dev tools
7. **Consider network conditions** and loading states
8. **Use progressive enhancement** for advanced features

### Performance Best Practices

1. **Lazy load images** and non-critical content
2. **Use responsive images** with srcset and sizes
3. **Minimize JavaScript** for critical rendering path
4. **Optimize CSS** delivery and eliminate unused styles
5. **Use efficient animations** that respect reduced motion
6. **Implement proper caching** strategies
7. **Monitor Core Web Vitals** metrics
8. **Test on slower devices** and networks

## Troubleshooting

### Common Accessibility Issues

#### Focus Not Visible
```css
/* Ensure focus indicators are visible */
button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

#### Screen Reader Not Announcing
```html
<!-- Use aria-live for dynamic content -->
<div aria-live="polite" id="status">
  <!-- Dynamic status messages -->
</div>
```

#### Form Validation Issues
```html
<!-- Associate errors with inputs -->
<input 
  aria-invalid="true" 
  aria-describedby="email-error"
/>
<div id="email-error" role="alert">
  Please enter a valid email
</div>
```

### Common Mobile Issues

#### Text Too Small on Mobile
```css
/* Prevent zoom on iOS */
input {
  font-size: 16px; /* Minimum to prevent zoom */
}
```

#### Touch Targets Too Small
```css
/* Ensure minimum touch target size */
button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem;
}
```

#### Layout Breaking on Small Screens
```css
/* Use flexible layouts */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Debug Tools

#### Accessibility Testing Tools
- **axe-core**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Built-in Chrome accessibility audit
- **Screen readers**: VoiceOver (Mac), NVDA (Windows)

#### Mobile Testing Tools
- **Chrome DevTools**: Device simulation
- **Firefox Responsive Design Mode**: Multi-device testing
- **BrowserStack**: Real device testing
- **Responsive Design Checker**: Multiple breakpoint testing

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Mobile Web Best Practices](https://www.w3.org/TR/mobile-bp/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [Responsive Design Checker](https://responsivedesignchecker.com/)

### Testing Services
- [BrowserStack](https://www.browserstack.com/) - Cross-browser testing
- [Sauce Labs](https://saucelabs.com/) - Mobile device testing
- [AccessiBe](https://accessibe.com/) - Accessibility monitoring
- [UserTesting](https://www.usertesting.com/) - Real user feedback

---

This guide provides comprehensive coverage of accessibility and mobile responsiveness features. For specific implementation questions or issues, refer to the utility functions and hooks documentation in the codebase.