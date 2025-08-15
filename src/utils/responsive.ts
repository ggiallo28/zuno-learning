/**
 * Responsive design utilities for mobile-first development
 * Provides comprehensive responsive design features including breakpoint detection,
 * touch support, viewport management, and responsive utilities
 */

// Breakpoint definitions following Tailwind CSS conventions
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Responsive Utilities
export class ResponsiveUtils {
  static getCurrentBreakpoint(): Breakpoint {
    const width = window.innerWidth;
    
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }

  static isBreakpoint(breakpoint: Breakpoint): boolean {
    return window.innerWidth >= BREAKPOINTS[breakpoint];
  }

  static isMobile(): boolean {
    return window.innerWidth < BREAKPOINTS.md;
  }

  static isTablet(): boolean {
    return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
  }

  static isDesktop(): boolean {
    return window.innerWidth >= BREAKPOINTS.lg;
  }

  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  static watchBreakpoint(callback: (breakpoint: Breakpoint) => void): () => void {
    let currentBreakpoint = this.getCurrentBreakpoint();
    
    const handleResize = () => {
      const newBreakpoint = this.getCurrentBreakpoint();
      if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint;
        callback(newBreakpoint);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  static createMediaQuery(breakpoint: Breakpoint): MediaQueryList {
    return window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
  }
}

// Touch Utilities
export class TouchUtils {
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static supportsHover(): boolean {
    return window.matchMedia('(hover: hover)').matches;
  }

  static supportsFinePointer(): boolean {
    return window.matchMedia('(pointer: fine)').matches;
  }

  static getPointerType(): 'coarse' | 'fine' | 'none' {
    if (window.matchMedia('(pointer: coarse)').matches) return 'coarse';
    if (window.matchMedia('(pointer: fine)').matches) return 'fine';
    return 'none';
  }

  static addTouchFriendlyStyles(element: HTMLElement): void {
    element.style.minHeight = '44px';
    element.style.minWidth = '44px';
    element.style.touchAction = 'manipulation';
    element.style.userSelect = 'none';
    
    // Add touch feedback
    element.addEventListener('touchstart', () => {
      element.style.opacity = '0.7';
    });
    
    element.addEventListener('touchend', () => {
      element.style.opacity = '1';
    });
    
    element.addEventListener('touchcancel', () => {
      element.style.opacity = '1';
    });
  }

  static handleSwipeGesture(
    element: HTMLElement,
    onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void,
    threshold: number = 50
  ): () => void {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          onSwipe(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          onSwipe(deltaY > 0 ? 'down' : 'up');
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }
}

// Viewport Utilities
export class ViewportUtils {
  static getViewportSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  static getScrollPosition(): { x: number; y: number } {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }

  static isElementInViewport(element: HTMLElement, threshold: number = 0): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  }

  static scrollToElement(element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
    element.scrollIntoView({ behavior, block: 'start' });
  }

  static getSafeAreaInsets(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    const style = getComputedStyle(document.documentElement);
    
    return {
      top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
      right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
      bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
      left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0,
    };
  }

  static watchViewportChanges(callback: (size: { width: number; height: number }) => void): () => void {
    const handleResize = () => {
      callback(this.getViewportSize());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }
}

// Responsive Image Utilities
export class ResponsiveImageUtils {
  static generateSrcSet(basePath: string, sizes: number[]): string {
    return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
  }

  static generateSizes(breakpoints: { breakpoint: Breakpoint; size: string }[]): string {
    return breakpoints
      .map(({ breakpoint, size }) => 
        breakpoint === 'xs' 
          ? size 
          : `(min-width: ${BREAKPOINTS[breakpoint]}px) ${size}`
      )
      .join(', ');
  }

  static createResponsiveImage(
    src: string,
    alt: string,
    sizes: { breakpoint: Breakpoint; width: number }[]
  ): HTMLImageElement {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    
    const widths = sizes.map(s => s.width);
    img.srcset = this.generateSrcSet(src, widths);
    
    const sizeStrings = sizes.map(({ breakpoint, width }) => ({
      breakpoint,
      size: `${width}px`
    }));
    img.sizes = this.generateSizes(sizeStrings);
    
    return img;
  }
}

// Container Query Utilities (for modern browsers)
export class ContainerQueryUtils {
  static supportsContainerQueries(): boolean {
    return 'container' in document.documentElement.style;
  }

  static createContainerQuery(
    element: HTMLElement,
    containerName: string,
    queries: { minWidth?: number; maxWidth?: number; styles: Record<string, string> }[]
  ): void {
    if (!this.supportsContainerQueries()) {
      console.warn('Container queries not supported in this browser');
      return;
    }

    element.style.containerName = containerName;
    element.style.containerType = 'inline-size';

    const styleSheet = document.createElement('style');
    let css = '';

    queries.forEach(({ minWidth, maxWidth, styles }) => {
      let query = `@container ${containerName} (`;
      const conditions = [];
      
      if (minWidth) conditions.push(`min-width: ${minWidth}px`);
      if (maxWidth) conditions.push(`max-width: ${maxWidth}px`);
      
      query += conditions.join(' and ') + ') {\n';
      
      const selector = `[style*="container-name: ${containerName}"]`;
      query += `  ${selector} {\n`;
      
      Object.entries(styles).forEach(([property, value]) => {
        query += `    ${property}: ${value};\n`;
      });
      
      query += '  }\n}\n';
      css += query;
    });

    styleSheet.textContent = css;
    document.head.appendChild(styleSheet);
  }
}

// Responsive Grid Utilities
export class ResponsiveGridUtils {
  static calculateColumns(containerWidth: number, minColumnWidth: number, gap: number = 16): number {
    return Math.floor((containerWidth + gap) / (minColumnWidth + gap));
  }

  static createAutoFitGrid(
    element: HTMLElement,
    minColumnWidth: number,
    gap: number = 16
  ): void {
    element.style.display = 'grid';
    element.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`;
    element.style.gap = `${gap}px`;
  }

  static createResponsiveGrid(
    element: HTMLElement,
    breakpointColumns: { breakpoint: Breakpoint; columns: number }[],
    gap: number = 16
  ): void {
    element.style.display = 'grid';
    element.style.gap = `${gap}px`;

    // Sort by breakpoint size (smallest first)
    const sorted = breakpointColumns.sort((a, b) => BREAKPOINTS[a.breakpoint] - BREAKPOINTS[b.breakpoint]);

    // Apply base styles (mobile-first)
    element.style.gridTemplateColumns = `repeat(${sorted[0].columns}, 1fr)`;

    // Create media queries for larger breakpoints
    const styleSheet = document.createElement('style');
    let css = '';

    sorted.slice(1).forEach(({ breakpoint, columns }) => {
      css += `@media (min-width: ${BREAKPOINTS[breakpoint]}px) {\n`;
      css += `  .responsive-grid-${Date.now()} {\n`;
      css += `    grid-template-columns: repeat(${columns}, 1fr);\n`;
      css += `  }\n`;
      css += `}\n`;
    });

    if (css) {
      styleSheet.textContent = css;
      document.head.appendChild(styleSheet);
      element.classList.add(`responsive-grid-${Date.now()}`);
    }
  }
}

// Responsive Typography Utilities
export class ResponsiveTypographyUtils {
  static createFluidTypography(
    minSize: number,
    maxSize: number,
    minViewport: number = BREAKPOINTS.sm,
    maxViewport: number = BREAKPOINTS.xl
  ): string {
    return `clamp(${minSize}rem, ${minSize}rem + ${maxSize - minSize} * ((100vw - ${minViewport}px) / ${maxViewport - minViewport}), ${maxSize}rem)`;
  }

  static applyFluidTypography(
    element: HTMLElement,
    minSize: number,
    maxSize: number,
    minViewport?: number,
    maxViewport?: number
  ): void {
    element.style.fontSize = this.createFluidTypography(minSize, maxSize, minViewport, maxViewport);
  }

  static createResponsiveLineHeight(fontSize: string): string {
    // Automatically calculate line height based on font size
    const sizeValue = parseFloat(fontSize);
    if (sizeValue <= 1) return '1.6';
    if (sizeValue <= 1.25) return '1.5';
    if (sizeValue <= 1.5) return '1.4';
    return '1.3';
  }
}

// Orientation Utilities
export class OrientationUtils {
  static getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  static isPortrait(): boolean {
    return this.getOrientation() === 'portrait';
  }

  static isLandscape(): boolean {
    return this.getOrientation() === 'landscape';
  }

  static watchOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void {
    let currentOrientation = this.getOrientation();

    const handleOrientationChange = () => {
      const newOrientation = this.getOrientation();
      if (newOrientation !== currentOrientation) {
        currentOrientation = newOrientation;
        callback(newOrientation);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }

  static addOrientationClasses(): void {
    const updateClasses = () => {
      document.documentElement.classList.remove('portrait', 'landscape');
      document.documentElement.classList.add(this.getOrientation());
    };

    updateClasses();
    this.watchOrientationChange(updateClasses);
  }
}

// Comprehensive Responsive Manager
export class ResponsiveManager {
  private static initialized = false;

  static initialize(): void {
    if (this.initialized) return;

    // Add orientation classes
    OrientationUtils.addOrientationClasses();

    // Add device type classes
    this.addDeviceTypeClasses();

    // Add touch/hover classes
    this.addInteractionClasses();

    // Watch for changes
    this.watchForChanges();

    this.initialized = true;
  }

  private static addDeviceTypeClasses(): void {
    const updateDeviceClasses = () => {
      const deviceType = ResponsiveUtils.getDeviceType();
      document.documentElement.classList.remove('mobile', 'tablet', 'desktop');
      document.documentElement.classList.add(deviceType);
    };

    updateDeviceClasses();
    ResponsiveUtils.watchBreakpoint(updateDeviceClasses);
  }

  private static addInteractionClasses(): void {
    document.documentElement.classList.toggle('touch', TouchUtils.isTouchDevice());
    document.documentElement.classList.toggle('hover', TouchUtils.supportsHover());
    document.documentElement.classList.toggle('fine-pointer', TouchUtils.supportsFinePointer());
  }

  private static watchForChanges(): void {
    // Watch for viewport changes
    ViewportUtils.watchViewportChanges((size) => {
      document.documentElement.style.setProperty('--viewport-width', `${size.width}px`);
      document.documentElement.style.setProperty('--viewport-height', `${size.height}px`);
    });

    // Update safe area insets
    const updateSafeArea = () => {
      const insets = ViewportUtils.getSafeAreaInsets();
      document.documentElement.style.setProperty('--safe-area-top', `${insets.top}px`);
      document.documentElement.style.setProperty('--safe-area-right', `${insets.right}px`);
      document.documentElement.style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
      document.documentElement.style.setProperty('--safe-area-left', `${insets.left}px`);
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);
  }

  static cleanup(): void {
    // Cleanup function for when needed
    this.initialized = false;
  }
}

// All utilities are already exported individually above