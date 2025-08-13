/**
 * Responsive design utilities for mobile and tablet optimization
 * Provides comprehensive responsive features for the Zuno learning platform
 */

// Breakpoint definitions (matching Tailwind CSS defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Device type detection
export class ResponsiveUtils {
  /**
   * Get current breakpoint based on window width
   */
  static getCurrentBreakpoint(): Breakpoint | 'xs' {
    const width = window.innerWidth;
    
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }

  /**
   * Check if current viewport matches breakpoint
   */
  static isBreakpoint(breakpoint: Breakpoint | 'xs'): boolean {
    if (breakpoint === 'xs') {
      return window.innerWidth < BREAKPOINTS.sm;
    }
    return window.innerWidth >= BREAKPOINTS[breakpoint];
  }

  /**
   * Check if device is mobile (xs or sm)
   */
  static isMobile(): boolean {
    return window.innerWidth < BREAKPOINTS.md;
  }

  /**
   * Check if device is tablet (md)
   */
  static isTablet(): boolean {
    return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
  }

  /**
   * Check if device is desktop (lg and above)
   */
  static isDesktop(): boolean {
    return window.innerWidth >= BREAKPOINTS.lg;
  }

  /**
   * Get device type
   */
  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }
}

// Touch device detection
export class TouchUtils {
  /**
   * Check if device supports touch
   */
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Check if device is primarily touch-based
   */
  static isPrimaryTouchDevice(): boolean {
    return this.isTouchDevice() && ResponsiveUtils.isMobile();
  }

  /**
   * Add touch-friendly styles to element
   */
  static makeTouchFriendly(element: HTMLElement) {
    if (this.isTouchDevice()) {
      element.style.minHeight = '44px';
      element.style.minWidth = '44px';
      element.style.touchAction = 'manipulation';
      element.style.userSelect = 'none';
    }
  }

  /**
   * Handle touch gestures
   */
  static addSwipeGesture(
    element: HTMLElement,
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    threshold: number = 50
  ) {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Return cleanup function
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }
}

// Viewport utilities
export class ViewportUtils {
  /**
   * Get viewport dimensions
   */
  static getViewportSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * Get safe area insets (for devices with notches)
   */
  static getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
      right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
      bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
    };
  }

  /**
   * Apply safe area padding to element
   */
  static applySafeAreaPadding(element: HTMLElement) {
    element.style.paddingTop = 'max(1rem, env(safe-area-inset-top))';
    element.style.paddingRight = 'max(1rem, env(safe-area-inset-right))';
    element.style.paddingBottom = 'max(1rem, env(safe-area-inset-bottom))';
    element.style.paddingLeft = 'max(1rem, env(safe-area-inset-left))';
  }

  /**
   * Check if viewport is in landscape mode
   */
  static isLandscape(): boolean {
    return window.innerWidth > window.innerHeight;
  }

  /**
   * Check if viewport is in portrait mode
   */
  static isPortrait(): boolean {
    return window.innerHeight > window.innerWidth;
  }

  /**
   * Get scroll position
   */
  static getScrollPosition(): { x: number; y: number } {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }

  /**
   * Smooth scroll to element
   */
  static scrollToElement(element: HTMLElement, offset: number = 0) {
    const elementTop = element.offsetTop - offset;
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    });
  }
}

// Responsive image utilities
export class ResponsiveImageUtils {
  /**
   * Generate responsive image srcset
   */
  static generateSrcSet(basePath: string, sizes: number[]): string {
    return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
  }

  /**
   * Generate responsive image sizes attribute
   */
  static generateSizes(breakpoints: Array<{ breakpoint: Breakpoint | 'xs'; size: string }>): string {
    return breakpoints
      .map(({ breakpoint, size }) => {
        if (breakpoint === 'xs') {
          return size;
        }
        return `(min-width: ${BREAKPOINTS[breakpoint]}px) ${size}`;
      })
      .join(', ');
  }

  /**
   * Lazy load image with intersection observer
   */
  static lazyLoadImage(img: HTMLImageElement, src: string, srcset?: string) {
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
  }
}

// Responsive grid utilities
export class ResponsiveGridUtils {
  /**
   * Calculate optimal grid columns based on container width
   */
  static calculateGridColumns(
    containerWidth: number,
    minItemWidth: number,
    gap: number = 16
  ): number {
    return Math.floor((containerWidth + gap) / (minItemWidth + gap));
  }

  /**
   * Generate responsive grid classes
   */
  static getResponsiveGridClasses(
    columns: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  ): string {
    const classes: string[] = [];
    
    if (columns.xs) classes.push(`grid-cols-${columns.xs}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  }

  /**
   * Auto-fit grid with minimum item width
   */
  static createAutoFitGrid(container: HTMLElement, minItemWidth: number) {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`;
    container.style.gap = '1rem';
  }

  /**
   * Auto-fill grid with fixed item width
   */
  static createAutoFillGrid(container: HTMLElement, itemWidth: number) {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(auto-fill, ${itemWidth}px)`;
    container.style.gap = '1rem';
    container.style.justifyContent = 'center';
  }
}

// Responsive typography utilities
export class ResponsiveTypography {
  /**
   * Generate fluid typography using clamp()
   */
  static generateFluidSize(
    minSize: number,
    maxSize: number,
    minViewport: number = BREAKPOINTS.sm,
    maxViewport: number = BREAKPOINTS.xl
  ): string {
    const slope = (maxSize - minSize) / (maxViewport - minViewport);
    const yAxisIntersection = -minViewport * slope + minSize;
    
    return `clamp(${minSize}px, ${yAxisIntersection}px + ${slope * 100}vw, ${maxSize}px)`;
  }

  /**
   * Apply responsive text scaling
   */
  static applyResponsiveText(element: HTMLElement, config: {
    mobile: number;
    tablet: number;
    desktop: number;
  }) {
    const deviceType = ResponsiveUtils.getDeviceType();
    const fontSize = config[deviceType];
    element.style.fontSize = `${fontSize}px`;
  }

  /**
   * Generate responsive line height
   */
  static getResponsiveLineHeight(fontSize: number): number {
    // Smaller line heights for larger text, larger for smaller text
    if (fontSize >= 24) return 1.2;
    if (fontSize >= 18) return 1.4;
    if (fontSize >= 16) return 1.5;
    return 1.6;
  }
}

// Media query utilities
export class MediaQueryUtils {
  /**
   * Create media query listener
   */
  static createMediaQueryListener(
    query: string,
    callback: (matches: boolean) => void
  ): () => void {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    callback(mediaQuery.matches); // Call immediately with current state
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handler);
  }

  /**
   * Create breakpoint listener
   */
  static createBreakpointListener(
    breakpoint: Breakpoint,
    callback: (matches: boolean) => void
  ): () => void {
    return this.createMediaQueryListener(
      `(min-width: ${BREAKPOINTS[breakpoint]}px)`,
      callback
    );
  }

  /**
   * Create orientation listener
   */
  static createOrientationListener(
    callback: (orientation: 'portrait' | 'landscape') => void
  ): () => void {
    return this.createMediaQueryListener(
      '(orientation: landscape)',
      (matches) => callback(matches ? 'landscape' : 'portrait')
    );
  }

  /**
   * Create reduced motion listener
   */
  static createReducedMotionListener(
    callback: (prefersReducedMotion: boolean) => void
  ): () => void {
    return this.createMediaQueryListener(
      '(prefers-reduced-motion: reduce)',
      callback
    );
  }
}

// Container query utilities (for modern browsers)
export class ContainerQueryUtils {
  /**
   * Check if container queries are supported
   */
  static isSupported(): boolean {
    return 'container' in document.documentElement.style;
  }

  /**
   * Apply container query styles
   */
  static applyContainerQuery(
    container: HTMLElement,
    queries: Array<{ minWidth: number; styles: Record<string, string> }>
  ) {
    if (!this.isSupported()) return;

    container.style.containerType = 'inline-size';
    
    // Use ResizeObserver as fallback for container queries
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const width = entry.contentRect.width;
        
        queries.forEach(({ minWidth, styles }) => {
          if (width >= minWidth) {
            Object.entries(styles).forEach(([property, value]) => {
              container.style.setProperty(property, value);
            });
          }
        });
      });
    });

    observer.observe(container);
    
    return () => observer.disconnect();
  }
}

// All utilities are exported individually above