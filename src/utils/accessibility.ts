/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 * Provides comprehensive accessibility features including focus management,
 * screen reader support, keyboard navigation, and ARIA utilities
 */

// Focus Management
export class FocusManager {
  private static focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    'audio[controls]',
    'video[controls]',
    'details > summary',
    '[role="button"]:not([aria-disabled="true"])',
    '[role="tab"]:not([aria-disabled="true"])',
    '[role="menuitem"]:not([aria-disabled="true"])',
    '[role="option"]:not([aria-disabled="true"])'
  ].join(', ');

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors))
      .filter(el => this.isVisible(el)) as HTMLElement[];
  }

  static isVisible(element: Element): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           (element as HTMLElement).offsetParent !== null;
  }

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  static restoreFocus(previousElement: HTMLElement | null): void {
    if (previousElement && this.isVisible(previousElement)) {
      previousElement.focus();
    }
  }
}

// Screen Reader Utilities
export class ScreenReaderUtils {
  private static liveRegion: HTMLElement | null = null;

  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) {
      this.createLiveRegion();
    }

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;
      
      // Clear after announcement to allow repeated messages
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  private static createLiveRegion(): void {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  }

  static createScreenReaderText(text: string): string {
    return `<span class="sr-only">${text}</span>`;
  }

  static removeScreenReaderText(element: HTMLElement): void {
    const srElements = element.querySelectorAll('.sr-only');
    srElements.forEach(el => el.remove());
  }
}

// Keyboard Navigation
export class KeyboardNavigation {
  static handleArrowNavigation(
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' | 'grid' = 'vertical'
  ): number {
    const { key } = event;
    let newIndex = currentIndex;

    switch (orientation) {
      case 'horizontal':
        if (key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
        } else if (key === 'ArrowRight') {
          newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
        }
        break;

      case 'vertical':
        if (key === 'ArrowUp') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
        } else if (key === 'ArrowDown') {
          newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
        }
        break;

      case 'grid':
        // Grid navigation requires additional parameters (columns, rows)
        // This is a simplified version
        if (key === 'ArrowUp' && currentIndex > 0) {
          newIndex = Math.max(0, currentIndex - 1);
        } else if (key === 'ArrowDown' && currentIndex < elements.length - 1) {
          newIndex = Math.min(elements.length - 1, currentIndex + 1);
        } else if (key === 'ArrowLeft' && currentIndex > 0) {
          newIndex = currentIndex - 1;
        } else if (key === 'ArrowRight' && currentIndex < elements.length - 1) {
          newIndex = currentIndex + 1;
        }
        break;
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      elements[newIndex]?.focus();
    }

    return newIndex;
  }

  static handleHomeEnd(
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number
  ): number {
    const { key } = event;
    let newIndex = currentIndex;

    if (key === 'Home') {
      newIndex = 0;
      event.preventDefault();
    } else if (key === 'End') {
      newIndex = elements.length - 1;
      event.preventDefault();
    }

    if (newIndex !== currentIndex) {
      elements[newIndex]?.focus();
    }

    return newIndex;
  }

  static makeKeyboardAccessible(element: HTMLElement, onClick: () => void): void {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    });
  }
}

// ARIA Utilities
export class ARIAUtils {
  private static idCounter = 0;

  static generateUniqueId(prefix: string = 'aria'): string {
    return `${prefix}-${++this.idCounter}-${Date.now()}`;
  }

  static associateElements(
    trigger: HTMLElement,
    target: HTMLElement,
    relationship: 'describedby' | 'labelledby' | 'controls' | 'owns'
  ): void {
    if (!target.id) {
      target.id = this.generateUniqueId();
    }

    const existingIds = trigger.getAttribute(`aria-${relationship}`)?.split(' ') || [];
    if (!existingIds.includes(target.id)) {
      existingIds.push(target.id);
      trigger.setAttribute(`aria-${relationship}`, existingIds.join(' '));
    }
  }

  static updateLiveRegion(element: HTMLElement, message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    element.setAttribute('aria-live', priority);
    element.setAttribute('aria-atomic', 'true');
    element.textContent = message;
  }

  static setExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  static setSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  static setChecked(element: HTMLElement, checked: boolean | 'mixed'): void {
    element.setAttribute('aria-checked', checked.toString());
  }

  static setDisabled(element: HTMLElement, disabled: boolean): void {
    element.setAttribute('aria-disabled', disabled.toString());
    if (disabled) {
      element.setAttribute('tabindex', '-1');
    } else {
      element.removeAttribute('tabindex');
    }
  }
}

// Color Contrast Utilities
export class ColorContrast {
  static calculateContrastRatio(color1: string, color2: string): number {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private static getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static meetsWCAGAA(foreground: string, background: string): boolean {
    return this.calculateContrastRatio(foreground, background) >= 4.5;
  }

  static meetsWCAGAAA(foreground: string, background: string): boolean {
    return this.calculateContrastRatio(foreground, background) >= 7;
  }
}

// Mobile Accessibility
export class MobileAccessibility {
  static validateTouchTargets(container: HTMLElement): HTMLElement[] {
    const interactiveElements = container.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"]'
    );

    const invalidElements: HTMLElement[] = [];

    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // WCAG 2.5.5 minimum touch target size

      if (rect.width < minSize || rect.height < minSize) {
        invalidElements.push(element as HTMLElement);
      }
    });

    return invalidElements;
  }

  static enhanceTouchTargets(elements: HTMLElement[]): void {
    elements.forEach(element => {
      element.style.minHeight = '44px';
      element.style.minWidth = '44px';
      element.style.touchAction = 'manipulation';
    });
  }

  static preventZoomOnFocus(): void {
    // Prevent iOS zoom on input focus by ensuring font-size is at least 16px
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const element = input as HTMLElement;
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      if (fontSize < 16) {
        element.style.fontSize = '16px';
      }
    });
  }
}

// Reduced Motion Support
export class ReducedMotion {
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static respectMotionPreferences(): void {
    if (this.prefersReducedMotion()) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }

  static addReducedMotionCSS(): void {
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// High Contrast Mode Detection
export class HighContrast {
  static prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  static enhanceForHighContrast(): void {
    if (this.prefersHighContrast()) {
      document.documentElement.classList.add('high-contrast');
      
      // Add high contrast styles
      const style = document.createElement('style');
      style.textContent = `
        .high-contrast button,
        .high-contrast input,
        .high-contrast select,
        .high-contrast textarea,
        .high-contrast .card {
          border: 2px solid !important;
          outline: 1px solid !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Comprehensive Accessibility Manager
export class AccessibilityManager {
  static initialize(): void {
    // Initialize all accessibility features
    ReducedMotion.respectMotionPreferences();
    ReducedMotion.addReducedMotionCSS();
    HighContrast.enhanceForHighContrast();
    MobileAccessibility.preventZoomOnFocus();
    
    // Add skip link if not present
    this.addSkipLink();
    
    // Monitor for dynamic content changes
    this.observeContentChanges();
  }

  private static addSkipLink(): void {
    if (document.querySelector('.skip-link')) return;

    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  private static observeContentChanges(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // Validate touch targets for new mobile elements
              const invalidTargets = MobileAccessibility.validateTouchTargets(element);
              if (invalidTargets.length > 0) {
                MobileAccessibility.enhanceTouchTargets(invalidTargets);
              }
              
              // Prevent zoom on new input elements
              MobileAccessibility.preventZoomOnFocus();
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  static cleanup(): void {
    // Cleanup function for when component unmounts
    const liveRegion = document.querySelector('[aria-live]');
    if (liveRegion) {
      liveRegion.remove();
    }
  }
}

// All utilities are already exported individually above