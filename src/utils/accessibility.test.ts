import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AccessibilityUtils, FocusManager, ScreenReaderUtils } from './accessibility'

// Mock DOM elements
const createMockElement = (tag: string = 'div', attributes: Record<string, string> = {}) => {
  const element = document.createElement(tag)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
  return element
}

describe('AccessibilityUtils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('generateUniqueId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = AccessibilityUtils.generateUniqueId('test')
      const id2 = AccessibilityUtils.generateUniqueId('test')
      
      expect(id1).toMatch(/^test-\d+$/)
      expect(id2).toMatch(/^test-\d+$/)
      expect(id1).not.toBe(id2)
    })

    it('should generate unique IDs without prefix', () => {
      const id = AccessibilityUtils.generateUniqueId()
      expect(id).toMatch(/^id-\d+$/)
    })
  })

  describe('announceToScreenReader', () => {
    it('should create and remove announcement element', () => {
      const message = 'Test announcement'
      
      AccessibilityUtils.announceToScreenReader(message)
      
      const announcement = document.querySelector('[aria-live="polite"]')
      expect(announcement).toBeTruthy()
      expect(announcement?.textContent).toBe(message)
      
      // Should be removed after timeout
      vi.advanceTimersByTime(1000)
      expect(document.querySelector('[aria-live="polite"]')).toBeFalsy()
    })

    it('should create assertive announcements', () => {
      AccessibilityUtils.announceToScreenReader('Urgent message', 'assertive')
      
      const announcement = document.querySelector('[aria-live="assertive"]')
      expect(announcement).toBeTruthy()
    })
  })

  describe('setARIARelationship', () => {
    it('should set aria-describedby relationship', () => {
      const trigger = createMockElement('button')
      const target = createMockElement('div', { id: 'description' })
      
      document.body.appendChild(trigger)
      document.body.appendChild(target)
      
      AccessibilityUtils.setARIARelationship(trigger, target, 'describedby')
      
      expect(trigger.getAttribute('aria-describedby')).toBe('description')
    })

    it('should append to existing relationships', () => {
      const trigger = createMockElement('button', { 'aria-describedby': 'existing' })
      const target = createMockElement('div', { id: 'new-description' })
      
      document.body.appendChild(trigger)
      document.body.appendChild(target)
      
      AccessibilityUtils.setARIARelationship(trigger, target, 'describedby')
      
      expect(trigger.getAttribute('aria-describedby')).toBe('existing new-description')
    })
  })

  describe('calculateContrastRatio', () => {
    it('should calculate contrast ratios correctly', () => {
      // Black on white should have high contrast
      const blackWhite = AccessibilityUtils.calculateContrastRatio('#000000', '#ffffff')
      expect(blackWhite).toBeCloseTo(21, 1)
      
      // Same colors should have no contrast
      const sameColor = AccessibilityUtils.calculateContrastRatio('#ff0000', '#ff0000')
      expect(sameColor).toBe(1)
    })

    it('should handle different color formats', () => {
      const ratio1 = AccessibilityUtils.calculateContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')
      const ratio2 = AccessibilityUtils.calculateContrastRatio('#000', '#fff')
      
      expect(ratio1).toBeCloseTo(ratio2, 1)
    })
  })

  describe('meetsWCAGContrast', () => {
    it('should validate WCAG AA compliance', () => {
      expect(AccessibilityUtils.meetsWCAGContrast('#000000', '#ffffff', 'AA')).toBe(true)
      expect(AccessibilityUtils.meetsWCAGContrast('#777777', '#ffffff', 'AA')).toBe(false)
    })

    it('should validate WCAG AAA compliance', () => {
      expect(AccessibilityUtils.meetsWCAGContrast('#000000', '#ffffff', 'AAA')).toBe(true)
      expect(AccessibilityUtils.meetsWCAGContrast('#666666', '#ffffff', 'AAA')).toBe(false)
    })
  })
})

describe('FocusManager', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('trapFocus', () => {
    it('should trap focus within container', () => {
      const container = createMockElement('div')
      const button1 = createMockElement('button')
      const button2 = createMockElement('button')
      
      container.appendChild(button1)
      container.appendChild(button2)
      document.body.appendChild(container)
      
      const cleanup = FocusManager.trapFocus(container)
      
      expect(typeof cleanup).toBe('function')
      
      // Cleanup should remove event listeners
      cleanup()
    })
  })

  describe('getFocusableElements', () => {
    it('should find focusable elements', () => {
      const container = createMockElement('div')
      const button = createMockElement('button')
      const input = createMockElement('input')
      const hiddenInput = createMockElement('input', { style: 'display: none' })
      
      container.appendChild(button)
      container.appendChild(input)
      container.appendChild(hiddenInput)
      document.body.appendChild(container)
      
      const focusable = FocusManager.getFocusableElements(container)
      
      expect(focusable).toHaveLength(2)
      expect(focusable).toContain(button)
      expect(focusable).toContain(input)
      expect(focusable).not.toContain(hiddenInput)
    })
  })

  describe('restoreFocus', () => {
    it('should restore focus to previous element', () => {
      const button = createMockElement('button')
      document.body.appendChild(button)
      
      button.focus = vi.fn()
      
      FocusManager.restoreFocus(button)
      
      expect(button.focus).toHaveBeenCalled()
    })
  })
})

describe('ScreenReaderUtils', () => {
  describe('createScreenReaderText', () => {
    it('should create screen reader only text', () => {
      const text = ScreenReaderUtils.createScreenReaderText('Hidden text')
      
      expect(text.textContent).toBe('Hidden text')
      expect(text.className).toContain('sr-only')
    })
  })

  describe('announcePolitely', () => {
    it('should create polite announcement', () => {
      ScreenReaderUtils.announcePolitely('Polite message')
      
      const announcement = document.querySelector('[aria-live="polite"]')
      expect(announcement).toBeTruthy()
      expect(announcement?.textContent).toBe('Polite message')
    })
  })

  describe('announceAssertively', () => {
    it('should create assertive announcement', () => {
      ScreenReaderUtils.announceAssertively('Urgent message')
      
      const announcement = document.querySelector('[aria-live="assertive"]')
      expect(announcement).toBeTruthy()
      expect(announcement?.textContent).toBe('Urgent message')
    })
  })
})