/**
 * React hooks for accessibility features
 * Provides easy-to-use hooks for common accessibility patterns
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FocusManager,
  ScreenReaderUtils,
  KeyboardNavigation,
  ARIAUtils,
  ReducedMotion,
  HighContrast
} from '@/utils/accessibility';

// Focus trap hook for modals and dialogs
export function useFocusTrap(isActive: boolean = false) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Set up focus trap
    const cleanup = FocusManager.trapFocus(containerRef.current);

    return () => {
      cleanup();
      // Restore focus when trap is removed
      if (previousFocusRef.current) {
        FocusManager.restoreFocus(previousFocusRef.current);
      }
    };
  }, [isActive]);

  return containerRef;
}

// Keyboard navigation hook for lists and grids
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  orientation: 'horizontal' | 'vertical' | 'grid' = 'vertical'
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const newIndex = KeyboardNavigation.handleArrowNavigation(
      event,
      items,
      currentIndex,
      orientation
    );
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }

    // Handle Home/End keys
    const homeEndIndex = KeyboardNavigation.handleHomeEnd(event, items, currentIndex);
    if (homeEndIndex !== currentIndex) {
      setCurrentIndex(homeEndIndex);
    }
  }, [items, currentIndex, orientation]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    currentIndex,
    setCurrentIndex,
    focusItem: (index: number) => {
      if (items[index]) {
        items[index].focus();
        setCurrentIndex(index);
      }
    }
  };
}

// Screen reader announcements hook
export function useScreenReader() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ScreenReaderUtils.announce(message, priority);
  }, []);

  return { announce };
}

// ARIA utilities hook
export function useARIA() {
  const generateId = useCallback((prefix?: string) => {
    return ARIAUtils.generateUniqueId(prefix);
  }, []);

  const associateElements = useCallback((
    trigger: HTMLElement,
    target: HTMLElement,
    relationship: 'describedby' | 'labelledby' | 'controls' | 'owns'
  ) => {
    ARIAUtils.associateElements(trigger, target, relationship);
  }, []);

  const updateLiveRegion = useCallback((
    element: HTMLElement,
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    ARIAUtils.updateLiveRegion(element, message, priority);
  }, []);

  return {
    generateId,
    associateElements,
    updateLiveRegion,
    setExpanded: ARIAUtils.setExpanded,
    setSelected: ARIAUtils.setSelected,
    setChecked: ARIAUtils.setChecked,
    setDisabled: ARIAUtils.setDisabled
  };
}

// Reduced motion preference hook
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    ReducedMotion.prefersReducedMotion()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// High contrast preference hook
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(
    HighContrast.prefersHighContrast()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

// Accessible form hook with validation and error handling
export function useAccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const setFieldTouched = useCallback((fieldName: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }));
  }, []);

  const getFieldProps = useCallback((fieldName: string) => {
    const hasError = errors[fieldName] && touched[fieldName];
    const errorId = hasError ? `${fieldName}-error` : undefined;

    return {
      'aria-invalid': hasError,
      'aria-describedby': errorId,
      onBlur: () => setFieldTouched(fieldName, true),
      error: hasError
    };
  }, [errors, touched, setFieldTouched]);

  const getErrorProps = useCallback((fieldName: string) => {
    const hasError = errors[fieldName] && touched[fieldName];
    
    return {
      id: `${fieldName}-error`,
      role: 'alert',
      'aria-live': 'polite' as const,
      children: hasError ? errors[fieldName] : null
    };
  }, [errors, touched]);

  return {
    errors,
    touched,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    getFieldProps,
    getErrorProps,
    hasErrors: Object.keys(errors).length > 0
  };
}

// Loading state hook with accessibility
export function useAccessibleLoading(isLoading: boolean, loadingText: string = 'Loading...') {
  const { announce } = useScreenReader();

  useEffect(() => {
    if (isLoading) {
      announce(loadingText, 'polite');
    }
  }, [isLoading, loadingText, announce]);

  const getLoadingProps = useCallback(() => ({
    'aria-busy': isLoading,
    'aria-live': 'polite' as const,
    'aria-label': isLoading ? loadingText : undefined
  }), [isLoading, loadingText]);

  return {
    isLoading,
    loadingText,
    getLoadingProps
  };
}

// Accessible tooltip hook
export function useAccessibleTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipId] = useState(() => ARIAUtils.generateUniqueId('tooltip'));
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLElement>(null);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const handleMouseEnter = () => show();
    const handleMouseLeave = () => hide();
    const handleFocus = () => show();
    const handleBlur = () => hide();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hide();
      }
    };

    trigger.addEventListener('mouseenter', handleMouseEnter);
    trigger.addEventListener('mouseleave', handleMouseLeave);
    trigger.addEventListener('focus', handleFocus);
    trigger.addEventListener('blur', handleBlur);
    trigger.addEventListener('keydown', handleKeyDown);

    return () => {
      trigger.removeEventListener('mouseenter', handleMouseEnter);
      trigger.removeEventListener('mouseleave', handleMouseLeave);
      trigger.removeEventListener('focus', handleFocus);
      trigger.removeEventListener('blur', handleBlur);
      trigger.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, hide]);

  const getTriggerProps = useCallback(() => ({
    ref: triggerRef,
    'aria-describedby': isVisible ? tooltipId : undefined,
    'aria-expanded': isVisible
  }), [isVisible, tooltipId]);

  const getTooltipProps = useCallback(() => ({
    ref: tooltipRef,
    id: tooltipId,
    role: 'tooltip',
    'aria-hidden': !isVisible,
    style: { display: isVisible ? 'block' : 'none' }
  }), [isVisible, tooltipId]);

  return {
    isVisible,
    show,
    hide,
    toggle,
    getTriggerProps,
    getTooltipProps
  };
}

// Skip link hook
export function useSkipLink(targetId: string) {
  const skipToContent = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId]);

  const getSkipLinkProps = useCallback(() => ({
    href: `#${targetId}`,
    className: 'skip-link',
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      skipToContent();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        skipToContent();
      }
    }
  }), [targetId, skipToContent]);

  return {
    skipToContent,
    getSkipLinkProps
  };
}

// Accessible disclosure (collapsible content) hook
export function useAccessibleDisclosure(initialOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [buttonId] = useState(() => ARIAUtils.generateUniqueId('disclosure-button'));
  const [contentId] = useState(() => ARIAUtils.generateUniqueId('disclosure-content'));

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const getButtonProps = useCallback(() => ({
    id: buttonId,
    'aria-expanded': isOpen,
    'aria-controls': contentId,
    onClick: toggle,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    }
  }), [isOpen, buttonId, contentId, toggle]);

  const getContentProps = useCallback(() => ({
    id: contentId,
    'aria-labelledby': buttonId,
    'aria-hidden': !isOpen,
    style: { display: isOpen ? 'block' : 'none' }
  }), [isOpen, buttonId, contentId]);

  return {
    isOpen,
    toggle,
    open,
    close,
    getButtonProps,
    getContentProps
  };
}

// All hooks are already exported individually above