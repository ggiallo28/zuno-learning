/**
 * React hooks for responsive design features
 * Provides reusable responsive functionality for React components
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ResponsiveUtils,
  TouchUtils,
  ViewportUtils,
  ResponsiveGridUtils,
  ResponsiveTypography,
  MediaQueryUtils,
  BREAKPOINTS,
  type Breakpoint
} from '@/utils/responsive';

/**
 * Hook for detecting current breakpoint
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | 'xs'>(() => 
    ResponsiveUtils.getCurrentBreakpoint()
  );
  const [deviceType, setDeviceType] = useState(() => ResponsiveUtils.getDeviceType());

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(ResponsiveUtils.getCurrentBreakpoint());
      setDeviceType(ResponsiveUtils.getDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isBreakpoint: (bp: Breakpoint | 'xs') => breakpoint === bp,
    isBreakpointUp: (bp: Breakpoint) => ResponsiveUtils.isBreakpoint(bp)
  };
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cleanup = MediaQueryUtils.createMediaQueryListener(query, setMatches);
    return cleanup;
  }, [query]);

  return matches;
}

/**
 * Hook for touch device detection and utilities
 */
export function useTouch() {
  const [isTouchDevice] = useState(() => TouchUtils.isTouchDevice());
  const [isPrimaryTouch] = useState(() => TouchUtils.isPrimaryTouchDevice());

  const makeTouchFriendly = useCallback((element: HTMLElement) => {
    TouchUtils.makeTouchFriendly(element);
  }, []);

  const addSwipeGesture = useCallback((
    element: HTMLElement,
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    threshold?: number
  ) => {
    return TouchUtils.addSwipeGesture(element, onSwipeLeft, onSwipeRight, threshold);
  }, []);

  return {
    isTouchDevice,
    isPrimaryTouch,
    makeTouchFriendly,
    addSwipeGesture
  };
}

/**
 * Hook for viewport utilities
 */
export function useViewport() {
  const [viewportSize, setViewportSize] = useState(() => ViewportUtils.getViewportSize());
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => 
    ViewportUtils.isLandscape() ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportSize(ViewportUtils.getViewportSize());
      setOrientation(ViewportUtils.isLandscape() ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToElement = useCallback((element: HTMLElement, offset?: number) => {
    ViewportUtils.scrollToElement(element, offset);
  }, []);

  const applySafeAreaPadding = useCallback((element: HTMLElement) => {
    ViewportUtils.applySafeAreaPadding(element);
  }, []);

  return {
    viewportSize,
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    safeAreaInsets: ViewportUtils.getSafeAreaInsets(),
    scrollPosition: ViewportUtils.getScrollPosition(),
    scrollToElement,
    applySafeAreaPadding
  };
}

/**
 * Hook for responsive grid calculations
 */
export function useResponsiveGrid(minItemWidth: number, gap: number = 16) {
  const { viewportSize } = useViewport();
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const newColumns = ResponsiveGridUtils.calculateGridColumns(
      viewportSize.width,
      minItemWidth,
      gap
    );
    setColumns(newColumns);
  }, [viewportSize.width, minItemWidth, gap]);

  const getGridClasses = useCallback((
    columnConfig: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  ) => {
    return ResponsiveGridUtils.getResponsiveGridClasses(columnConfig);
  }, []);

  const createAutoFitGrid = useCallback((container: HTMLElement) => {
    ResponsiveGridUtils.createAutoFitGrid(container, minItemWidth);
  }, [minItemWidth]);

  const createAutoFillGrid = useCallback((container: HTMLElement, itemWidth: number) => {
    ResponsiveGridUtils.createAutoFillGrid(container, itemWidth);
  }, []);

  return {
    columns,
    getGridClasses,
    createAutoFitGrid,
    createAutoFillGrid
  };
}

/**
 * Hook for responsive text sizing
 */
export function useResponsiveText() {
  const { deviceType } = useBreakpoint();

  const generateFluidSize = useCallback((
    minSize: number,
    maxSize: number,
    minViewport?: number,
    maxViewport?: number
  ) => {
    return ResponsiveTypography.generateFluidSize(minSize, maxSize, minViewport, maxViewport);
  }, []);

  const applyResponsiveText = useCallback((
    element: HTMLElement,
    config: { mobile: number; tablet: number; desktop: number }
  ) => {
    ResponsiveTypography.applyResponsiveText(element, config);
  }, []);

  const getResponsiveLineHeight = useCallback((fontSize: number) => {
    return ResponsiveTypography.getResponsiveLineHeight(fontSize);
  }, []);

  return {
    deviceType,
    generateFluidSize,
    applyResponsiveText,
    getResponsiveLineHeight
  };
}

/**
 * Hook for responsive navigation (mobile menu, etc.)
 */
export function useResponsiveNavigation() {
  const { isMobile } = useBreakpoint();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when switching to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  return {
    isMobile,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    openMenu
  };
}

/**
 * Hook for responsive image handling
 */
export function useResponsiveImage() {
  const lazyLoadImage = useCallback((
    img: HTMLImageElement,
    src: string,
    srcset?: string
  ) => {
    // Use intersection observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          if (srcset) img.srcset = srcset;
          img.classList.remove('opacity-0');
          img.classList.add('opacity-100');
          observer.unobserve(img);
        }
      });
    });

    img.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    observer.observe(img);

    return () => observer.disconnect();
  }, []);

  const generateSrcSet = useCallback((basePath: string, sizes: number[]) => {
    return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
  }, []);

  const generateSizes = useCallback((
    breakpoints: Array<{ breakpoint: Breakpoint | 'xs'; size: string }>
  ) => {
    return breakpoints
      .map(({ breakpoint, size }) => {
        if (breakpoint === 'xs') {
          return size;
        }
        return `(min-width: ${BREAKPOINTS[breakpoint]}px) ${size}`;
      })
      .join(', ');
  }, []);

  return {
    lazyLoadImage,
    generateSrcSet,
    generateSizes
  };
}

/**
 * Hook for device orientation detection
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => 
    ViewportUtils.isLandscape() ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const cleanup = MediaQueryUtils.createOrientationListener(setOrientation);
    return cleanup;
  }, []);

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
}

/**
 * Hook for container queries (modern browsers)
 */
export function useContainerQuery(
  queries: Array<{ minWidth: number; styles: Record<string, string> }>
) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver to implement container query behavior
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const width = entry.contentRect.width;
        
        queries.forEach(({ minWidth, styles }) => {
          const shouldApply = width >= minWidth;
          
          Object.entries(styles).forEach(([property, value]) => {
            if (shouldApply) {
              container.style.setProperty(property, value);
            } else {
              container.style.removeProperty(property);
            }
          });
        });
      });
    });

    observer.observe(container);
    
    return () => observer.disconnect();
  }, [queries]);

  return containerRef;
}

/**
 * Hook for responsive component behavior
 */
export function useResponsiveComponent<T extends Record<string, any>>(
  config: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
  }
) {
  const { deviceType } = useBreakpoint();
  
  const currentConfig = config[deviceType] || config.mobile || {};
  
  return currentConfig;
}

// All hooks are exported individually above