/**
 * React hooks for accessibility features
 * Provides reusable accessibility functionality for React components
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

/**
 * Hook for managing focus trapping in modals and dialogs
 */
export function useFocusTrap(isActive: boolean = false) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Set up focus trap
    const cleanup = FocusManager.trapFocus(containerRef.current);

    return () => {
      cleanup();
      // Restore focus when trap is deactivated
      if (previousFocusRef.current) {
        FocusManager.restoreFocus(previousFocusRef.current);
      }
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook for keyboard navigation in lists and grids
 */
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  orientation: 'vertical' | 'horizontal' = 'vertical'
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const newIndex = KeyboardNavigation.handleArrowNavigation(
      event,
      items,
      currentIndex,
      orientation
    );
    setCurrentIndex(newIndex);
  }, [items, currentIndex, orientation]);

  useEffect(() => {
    const currentItem = items[currentIndex];
    if (currentItem) {
      currentItem.addEventListener('keydown', handleKeyDown);
      return () => currentItem.removeEventListener('keydown', handleKeyDown);
    }
  }, [currentIndex, items, handleKeyDown]);

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

/**
 * Hook for screen reader announcements
 */
export function useScreenReader() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ScreenReaderUtils.announce(message, priority);
  }, []);

  const createScreenReaderText = useCallback((text: string) => {
    return ScreenReaderUtils.createScreenReaderText(text);
  }, []);

  return {
    announce,
    createScreenReaderText
  };
}

/**
 * Hook for managing ARIA relationships
 */
export function useARIA() {
  const [ids] = useState(() => ({
    describedBy: ARIAUtils.generateId('described-by'),
    labelledBy: ARIAUtils.generateId('labelled-by'),
    controls: ARIAUtils.generateId('controls')
  }));

  const setupRelationship = useCallback((
    trigger: HTMLElement,
    target: HTMLElement,
    relationship: 'describedby' | 'labelledby' | 'controls'
  ) => {
    ARIAUtils.setupARIARelationship(trigger, target, relationship);
  }, []);

  const updateLiveRegion = useCallback((regionId: string, message: string) => {
    ARIAUtils.updateLiveRegion(regionId, message);
  }, []);

  return {
    ids,
    setupRelationship,
    updateLiveRegion
  };
}

/**
 * Hook for detecting reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => ReducedMotion.prefersReducedMotion()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const applyReducedMotion = useCallback((
    element: HTMLElement,
    animations: Record<string, string>
  ) => {
    ReducedMotion.applyReducedMotion(element, animations);
  }, []);

  return {
    prefersReducedMotion,
    applyReducedMotion
  };
}

/**
 * Hook for detecting high contrast mode
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(
    () => HighContrast.isHighContrastMode()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const applyHighContrastStyles = useCallback((element: HTMLElement) => {
    HighContrast.applyHighContrastStyles(element);
  }, []);

  return {
    isHighContrast,
    applyHighContrastStyles
  };
}

/**
 * Hook for accessible form handling
 */
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
      'aria-invalid': hasError ? 'true' : 'false',
      'aria-describedby': errorId,
      onBlur: () => setFieldTouched(fieldName, true)
    };
  }, [errors, touched, setFieldTouched]);

  const getErrorProps = useCallback((fieldName: string) => {
    const hasError = errors[fieldName] && touched[fieldName];
    
    return {
      id: `${fieldName}-error`,
      role: 'alert',
      'aria-live': 'polite' as const,
      style: { display: hasError ? 'block' : 'none' }
    };
  }, [errors, touched]);

  return {
    errors,
    touched,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    getFieldProps,
    getErrorProps
  };
}

/**
 * Hook for accessible loading states
 */
export function useAccessibleLoading(isLoading: boolean, loadingText: string = 'Loading...') {
  const { announce } = useScreenReader();

  useEffect(() => {
    if (isLoading) {
      announce(loadingText, 'polite');
    }
  }, [isLoading, loadingText, announce]);

  const getLoadingProps = useCallback(() => ({
    'aria-busy': isLoading ? 'true' : 'false',
    'aria-live': 'polite' as const,
    'aria-label': isLoading ? loadingText : undefined
  }), [isLoading, loadingText]);

  return {
    getLoadingProps
  };
}

/**
 * Hook for accessible tooltips
 */
export function useAccessibleTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipId] = useState(() => ARIAUtils.generateId('tooltip'));
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLElement>(null);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    trigger.setAttribute('aria-describedby', tooltipId);

    const handleMouseEnter = () => show();
    const handleMouseLeave = () => hide();
    const handleFocus = () => show();
    const handleBlur = () => hide();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
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
  }, [tooltipId, show, hide]);

  const getTriggerProps = useCallback(() => ({
    ref: triggerRef,
    'aria-describedby': tooltipId
  }), [tooltipId]);

  const getTooltipProps = useCallback(() => ({
    ref: tooltipRef,
    id: tooltipId,
    role: 'tooltip',
    'aria-hidden': !isVisible,
    style: { display: isVisible ? 'block' : 'none' }
  }), [tooltipId, isVisible]);

  return {
    isVisible,
    show,
    hide,
    getTriggerProps,
    getTooltipProps
  };
}

/**
 * Hook for managing skip links
 */
export function useSkipLinks(links: Array<{ href: string; text: string }>) {
  useEffect(() => {
    // Create skip links container
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.setAttribute('aria-label', 'Skip navigation links');

    links.forEach(({ href, text }) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      link.className = 'skip-link';
      skipLinksContainer.appendChild(link);
    });

    // Insert at the beginning of body
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);

    return () => {
      if (skipLinksContainer.parentNode) {
        skipLinksContainer.parentNode.removeChild(skipLinksContainer);
      }
    };
  }, [links]);
}

// All hooks are exported individually above