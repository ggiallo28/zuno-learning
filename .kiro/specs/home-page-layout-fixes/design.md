# Design Document

## Overview

This design document outlines the technical approach to fix critical layout and styling issues in the Zuno home page. The fixes focus on improving visual consistency, proper alignment, and responsive behavior across desktop and mobile devices.

## Documentation Strategy

### Context7 Documentation Integration

This design will be informed by comprehensive documentation research using Context7 to ensure all layout fixes follow current best practices and standards:

#### CSS Layout Documentation
- **Modern CSS Layout**: Flexbox and Grid layout patterns for complex layouts
- **Responsive Design**: Mobile-first design principles and breakpoint strategies
- **Cross-browser Compatibility**: CSS property support and fallback techniques
- **Performance Optimization**: CSS optimization and rendering performance

#### Framework-Specific Documentation
- **Tailwind CSS**: Utility-first CSS framework patterns and responsive utilities
- **React Styling**: Component styling patterns and dynamic class management
- **CSS Architecture**: Maintainable CSS organization and naming conventions
- **Design Systems**: Consistent spacing, typography, and layout patterns

#### Testing and Quality Assurance Documentation
- **Cross-browser Testing**: Testing strategies for layout consistency
- **Responsive Testing**: Device testing and viewport validation
- **Accessibility Testing**: Layout accessibility and WCAG compliance
- **Visual Regression Testing**: Automated layout testing techniques

This documentation foundation ensures all design decisions are based on current industry standards and best practices.

## Architecture

The home page layout fixes will be implemented through targeted CSS and component structure improvements without affecting the overall application architecture. The changes will be made to the existing home page components and styles.

### Component Structure
```
HomePage.tsx (Main Container)
├── Hero Section
├── Coach Showcase
├── Features Grid
├── Pricing Section (NEEDS FIXES)
│   ├── Pricing Cards
│   └── Calculator Section (price per lesson positioning)
├── Testimonials
├── Newsletter Section (NEEDS SPACING FIXES)
└── Footer (NEEDS ALIGNMENT FIXES)
    ├── Desktop Layout (centering issues)
    └── Mobile Grid Layout (column balancing)
```

## Components and Interfaces

### 1. Pricing Section Component
**File:** `src/components/HomePage.tsx` (Pricing section)

**Current Issues:**
- Price per lesson (€0.08/lezione) positioned incorrectly
- "Paghi solo per ciò che usi" text needs to stay at top

**Design Solution:**
- Restructure pricing card layout to move price per lesson to calculator bottom
- Maintain "Paghi solo per ciò che usi" at the top of the pricing information
- Ensure proper visual hierarchy and spacing

### 2. Footer Component
**File:** `src/components/HomePage.tsx` (Footer section)

**Desktop Issues:**
- Text in "Zuno", "Risorse", "Legale", "Contatti" sections not centered
- Separator bar protruding from sides
- Overall footer section not properly centered

**Mobile Issues:**
- 4-column grid layout with unbalanced content
- Second row column 2 longer than column 1

**Design Solution:**
- Implement proper CSS flexbox/grid centering for desktop footer
- Fix separator bar width and alignment
- Rebalance mobile grid layout for equal column heights
- Ensure responsive behavior across breakpoints

### 3. Newsletter Form Component
**File:** `src/components/HomePage.tsx` (Newsletter section)

**Current Issues:**
- Insufficient bottom margins
- Cramped spacing around form elements

**Design Solution:**
- Increase bottom margins and padding
- Improve form element spacing
- Ensure proper touch targets for mobile
- Maintain visual consistency with overall design

## Data Models

No data model changes are required for these layout fixes. All changes are purely presentational and will be implemented through CSS and component structure improvements.

## Error Handling

### Layout Fallbacks
- Implement CSS fallbacks for older browsers
- Ensure graceful degradation of grid layouts
- Provide fallback spacing for unsupported CSS properties

### Responsive Breakpoint Handling
- Test layout fixes across all breakpoints
- Ensure smooth transitions between desktop and mobile layouts
- Handle edge cases for tablet and intermediate screen sizes

## Testing Strategy

### Visual Regression Testing
1. **Desktop Testing:**
   - Verify footer alignment and centering
   - Check pricing section layout
   - Validate newsletter form spacing

2. **Mobile Testing:**
   - Test 4-column footer grid balance
   - Verify pricing section mobile layout
   - Check form touch targets and spacing

3. **Cross-Browser Testing:**
   - Test layout fixes in Chrome, Firefox, Safari, Edge
   - Verify CSS compatibility across browsers
   - Check responsive behavior consistency

### Manual Testing Checklist
- [ ] Pricing section: "Paghi solo per ciò che usi" at top
- [ ] Pricing section: €0.08/lezione moved to calculator bottom
- [ ] Desktop footer: All sections properly centered
- [ ] Desktop footer: Separator bar aligned correctly
- [ ] Mobile footer: 4-column grid balanced
- [ ] Mobile footer: Column heights equal in second row
- [ ] Newsletter form: Adequate bottom margins
- [ ] Newsletter form: Proper element spacing
- [ ] Responsive behavior: Smooth transitions between breakpoints

### Implementation Approach

#### Phase 1: CSS Analysis and Planning
1. Analyze current CSS structure for pricing, footer, and newsletter sections
2. Identify specific CSS properties causing alignment issues
3. Plan CSS changes with minimal impact on existing styles

#### Phase 2: Pricing Section Fixes
1. Restructure pricing card HTML structure if needed
2. Adjust CSS positioning for price per lesson element
3. Ensure "Paghi solo per ciò che usi" remains at top
4. Test responsive behavior

#### Phase 3: Footer Alignment Fixes
1. Fix desktop footer centering issues
2. Adjust separator bar width and positioning
3. Rebalance mobile grid layout
4. Test across different screen sizes

#### Phase 4: Newsletter Form Spacing
1. Increase bottom margins and padding
2. Improve form element spacing
3. Ensure proper touch targets
4. Test form usability

#### Phase 5: Cross-Browser and Device Testing
1. Test all fixes across major browsers
2. Verify mobile and tablet layouts
3. Check for any regression issues
4. Validate accessibility compliance

### CSS Implementation Strategy

#### Desktop Footer Centering
```css
/* Use flexbox for proper centering */
.footer-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Fix separator bar alignment */
.footer-separator {
  width: 100%;
  max-width: container-width;
  margin: 0 auto;
}
```

#### Mobile Grid Balancing
```css
/* Ensure equal column heights */
.footer-mobile-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  align-items: start;
}

/* Balance content distribution */
.footer-column {
  display: flex;
  flex-direction: column;
  min-height: fit-content;
}
```

#### Pricing Section Layout
```css
/* Move price per lesson to bottom */
.pricing-calculator {
  display: flex;
  flex-direction: column;
}

.price-per-lesson {
  order: 2; /* Move to bottom */
  margin-top: auto;
}

.usage-text {
  order: 1; /* Keep at top */
}
```

### Performance Considerations

- All changes will be CSS-only or minimal HTML structure adjustments
- No impact on JavaScript performance
- Minimal CSS additions to maintain bundle size
- Use efficient CSS selectors to avoid performance issues

### Accessibility Compliance

- Maintain proper heading hierarchy
- Ensure adequate color contrast ratios
- Preserve keyboard navigation functionality
- Keep proper focus indicators
- Maintain screen reader compatibility