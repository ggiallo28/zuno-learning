/**
 * React hooks for responsive design features
 * Provides easy-to-use hooks for responsive behavior and mobile-first development
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ResponsiveUtils,
  TouchUtils,
  ViewportUtils,
  OrientationUtils,
  ResponsiveGridUtils,
  ResponsiveTypographyUtils,
  type Breakpoint
} from '@/utils/responsive';

// Breakpoint detection hook
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(
    ResponsiveUtils.getCurrentBreakpoint()
  );
  const [deviceType, setDeviceType] = useState(ResponsiveUtils.getDeviceType());

  useEffect(() => {
    const cleanup = ResponsiveUtils.watchBreakpoint((breakpoint) => {
      setCurrentBreakpoint(breakpoint);
      setDeviceType(ResponsiveUtils.getDeviceType());
    });

    return cleanup;
  }, []);

  const isBreakpoint = useCallback((breakpoint: Breakpoint) => {
    return ResponsiveUtils.isBreakpoint(breakpoint);
  }, []);

  return {
    currentBreakpoint,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isBreakpoint,
    // Specific breakpoint checks
    isXs: currentBreakpoint === 'xs',
    isSm: ResponsiveUtils.isBreakpoint('sm'),
    isMd: ResponsiveUtils.isBreakpoint('md'),
    isLg: ResponsiveUtils.isBreakpoint('lg'),
    isXl: ResponsiveUtils.isBreakpoint('xl'),
    is2Xl: ResponsiveUtils.isBreakpoint('2xl')
  };
}

// Media query hook
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// Touch device detection hook
export function useTouch() {
  const [isTouchDevice] = useState(TouchUtils.isTouchDevice());
  const [supportsHover] = useState(TouchUtils.supportsHover());
  const [supportsFinePointer] = useState(TouchUtils.supportsFinePointer());
  const [pointerType] = useState(TouchUtils.getPointerType());

  return {
    isTouchDevice,
    supportsHover,
    supportsFinePointer,
    pointerType,
    isCoarsePointer: pointerType === 'coarse',
    isFinePointer: pointerType === 'fine'
  };
}

// Viewport size hook
export function useViewport() {
  const [viewport, setViewport] = useState(ViewportUtils.getViewportSize());
  const [scrollPosition, setScrollPosition] = useState(ViewportUtils.getScrollPosition());

  useEffect(() => {
    const cleanupViewport = ViewportUtils.watchViewportChanges(setViewport);
    
    const handleScroll = () => {
      setScrollPosition(ViewportUtils.getScrollPosition());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cleanupViewport();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToElement = useCallback((element: HTMLElement, behavior: ScrollBehavior = 'smooth') => {
    ViewportUtils.scrollToElement(element, behavior);
  }, []);

  return {
    width: viewport.width,
    height: viewport.height,
    scrollX: scrollPosition.x,
    scrollY: scrollPosition.y,
    scrollToElement
  };
}

// Element visibility hook
export function useInViewport<T extends HTMLElement>(threshold: number = 0) {
  const [isInViewport, setIsInViewport] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: threshold / 100 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return {
    elementRef,
    isInViewport
  };
}

// Orientation hook
export function useOrientation() {
  const [orientation, setOrientation] = useState(OrientationUtils.getOrientation());

  useEffect(() => {
    const cleanup = OrientationUtils.watchOrientationChange(setOrientation);
    return cleanup;
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  };
}

// Responsive grid hook
export function useResponsiveGrid<T extends HTMLElement>(
  minColumnWidth: number,
  gap: number = 16
) {
  const containerRef = useRef<T>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateColumns = () => {
      const containerWidth = container.offsetWidth;
      const newColumns = ResponsiveGridUtils.calculateColumns(containerWidth, minColumnWidth, gap);
      setColumns(newColumns);
    };

    // Set up auto-fit grid
    ResponsiveGridUtils.createAutoFitGrid(container, minColumnWidth, gap);

    // Update columns on resize
    updateColumns();
    window.addEventListener('resize', updateColumns);

    return () => {
      window.removeEventListener('resize', updateColumns);
    };
  }, [minColumnWidth, gap]);

  return {
    containerRef,
    columns
  };
}

// Responsive text hook
export function useResponsiveText(
  minSize: number,
  maxSize: number,
  minViewport?: number,
  maxViewport?: number
) {
  const [fontSize, setFontSize] = useState('');

  useEffect(() => {
    const fluidSize = ResponsiveTypographyUtils.createFluidTypography(
      minSize,
      maxSize,
      minViewport,
      maxViewport
    );
    setFontSize(fluidSize);
  }, [minSize, maxSize, minViewport, maxViewport]);

  return fontSize;
}

// Swipe gesture hook
export function useSwipeGesture<T extends HTMLElement>(
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void,
  threshold: number = 50
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = TouchUtils.handleSwipeGesture(element, onSwipe, threshold);
    return cleanup;
  }, [onSwipe, threshold]);

  return elementRef;
}

// Container query hook (for modern browsers)
export function useContainerQuery(
  containerName: string,
  queries: { minWidth?: number; maxWidth?: number; styles: Record<string, string> }[]
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Apply container queries if supported
    const { ContainerQueryUtils } = require('@/utils/responsive');
    if (ContainerQueryUtils.supportsContainerQueries()) {
      ContainerQueryUtils.createContainerQuery(container, containerName, queries);
    }
  }, [containerName, queries]);

  return containerRef;
}

// Responsive navigation hook
export function useResponsiveNavigation() {
  const { isMobile } = useBreakpoint();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }, [isMobileMenuOpen, openMobileMenu, closeMobileMenu]);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [isMobile, isMobileMenuOpen, closeMobileMenu]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileMenuOpen, closeMobileMenu]);

  return {
    isMobile,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu
  };
}

// Responsive image hook
export function useResponsiveImage(
  src: string,
  sizes: { breakpoint: Breakpoint; width: number }[]
) {
  const [imageSrc] = useState(src);
  const [srcSet, setSrcSet] = useState('');
  const [sizesAttr, setSizesAttr] = useState('');

  useEffect(() => {
    const { ResponsiveImageUtils } = require('@/utils/responsive');
    
    const widths = sizes.map(s => s.width);
    const generatedSrcSet = ResponsiveImageUtils.generateSrcSet(src, widths);
    
    const sizeStrings = sizes.map(({ breakpoint, width }) => ({
      breakpoint,
      size: `${width}px`
    }));
    const generatedSizes = ResponsiveImageUtils.generateSizes(sizeStrings);

    setSrcSet(generatedSrcSet);
    setSizesAttr(generatedSizes);
  }, [src, sizes]);

  return {
    src: imageSrc,
    srcSet,
    sizes: sizesAttr
  };
}

// Safe area hook for devices with notches
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState(ViewportUtils.getSafeAreaInsets());

  useEffect(() => {
    const updateSafeArea = () => {
      setSafeArea(ViewportUtils.getSafeAreaInsets());
    };

    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
}

// Responsive spacing hook
export function useResponsiveSpacing(
  baseSpacing: number,
  breakpointMultipliers: Partial<Record<Breakpoint, number>> = {}
) {
  const { currentBreakpoint } = useBreakpoint();
  const [spacing, setSpacing] = useState(baseSpacing);

  useEffect(() => {
    const multiplier = breakpointMultipliers[currentBreakpoint] || 1;
    setSpacing(baseSpacing * multiplier);
  }, [baseSpacing, breakpointMultipliers, currentBreakpoint]);

  return spacing;
}

// Responsive columns hook
export function useResponsiveColumns(
  breakpointColumns: Partial<Record<Breakpoint, number>>
) {
  const { currentBreakpoint } = useBreakpoint();
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    // Find the appropriate number of columns for current breakpoint
    const breakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    
    for (const bp of breakpoints) {
      if (ResponsiveUtils.isBreakpoint(bp) && breakpointColumns[bp]) {
        setColumns(breakpointColumns[bp]!);
        break;
      }
    }
  }, [currentBreakpoint, breakpointColumns]);

  return columns;
}

// All hooks are already exported individually above