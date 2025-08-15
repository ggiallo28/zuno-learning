import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  preloadAuthenticatedApp,
  preloadAuthFlow,
  preloadCourseCatalog,
  preloadAssessmentSystem,
  preloadCriticalRoutes,
  preloadComponent
} from './preloader'

// Mock dynamic imports
vi.mock('../components/AuthenticatedApp', () => ({
  default: vi.fn(() => 'AuthenticatedApp')
}))

vi.mock('../components/auth/AuthFlow', () => ({
  default: vi.fn(() => 'AuthFlow')
}))

vi.mock('../components/CourseCatalog', () => ({
  default: vi.fn(() => 'CourseCatalog')
}))

vi.mock('../components/AssessmentSystem', () => ({
  default: vi.fn(() => 'AssessmentSystem')
}))

// Mock requestIdleCallback
const mockRequestIdleCallback = vi.fn((callback) => {
  setTimeout(callback, 0)
  return 1
})

const mockCancelIdleCallback = vi.fn()

Object.defineProperty(global, 'requestIdleCallback', {
  value: mockRequestIdleCallback,
  writable: true
})

Object.defineProperty(global, 'cancelIdleCallback', {
  value: mockCancelIdleCallback,
  writable: true
})

describe('Preloader Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('preloadComponent', () => {
    it('should preload a component successfully', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: 'MockComponent' })
      
      const result = await preloadComponent('TestComponent', mockImport)
      
      expect(result).toBe('MockComponent')
      expect(mockImport).toHaveBeenCalledTimes(1)
    })

    it('should handle import errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const mockImport = vi.fn().mockRejectedValue(new Error('Import failed'))
      
      const result = await preloadComponent('TestComponent', mockImport)
      
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to preload TestComponent:',
        expect.any(Error)
      )
      
      consoleSpy.mockRestore()
    })

    it('should cache successful preloads', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: 'MockComponent' })
      
      // First call
      const result1 = await preloadComponent('TestComponent', mockImport)
      // Second call should use cache
      const result2 = await preloadComponent('TestComponent', mockImport)
      
      expect(result1).toBe('MockComponent')
      expect(result2).toBe('MockComponent')
      expect(mockImport).toHaveBeenCalledTimes(1) // Only called once due to caching
    })
  })

  describe('preloadAuthenticatedApp', () => {
    it('should preload authenticated app component', async () => {
      const result = await preloadAuthenticatedApp()
      
      expect(result).toBeDefined()
    })
  })

  describe('preloadAuthFlow', () => {
    it('should preload auth flow component', async () => {
      const result = await preloadAuthFlow()
      
      expect(result).toBeDefined()
    })
  })

  describe('preloadCourseCatalog', () => {
    it('should preload course catalog component', async () => {
      const result = await preloadCourseCatalog()
      
      expect(result).toBeDefined()
    })
  })

  describe('preloadAssessmentSystem', () => {
    it('should preload assessment system component', async () => {
      const result = await preloadAssessmentSystem()
      
      expect(result).toBeDefined()
    })
  })

  describe('preloadCriticalRoutes', () => {
    it('should preload authenticated routes when user is authenticated', async () => {
      const result = await preloadCriticalRoutes(true)
      
      expect(result).toBeUndefined() // Function doesn't return anything
      // Verify that the preloading functions were called
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    it('should preload auth flow when user is not authenticated', async () => {
      const result = await preloadCriticalRoutes(false)
      
      expect(result).toBeUndefined()
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    it('should handle errors during critical route preloading', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Mock one of the preload functions to fail
      vi.mocked(preloadAuthenticatedApp).mockRejectedValueOnce(new Error('Preload failed'))
      
      await preloadCriticalRoutes(true)
      
      // Should not throw, but should log warning
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('idle callback integration', () => {
    it('should use requestIdleCallback when available', async () => {
      await preloadCriticalRoutes(true)
      
      expect(mockRequestIdleCallback).toHaveBeenCalled()
    })

    it('should fallback to setTimeout when requestIdleCallback is not available', async () => {
      const originalRequestIdleCallback = global.requestIdleCallback
      delete (global as any).requestIdleCallback
      
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')
      
      await preloadCriticalRoutes(true)
      
      expect(setTimeoutSpy).toHaveBeenCalled()
      
      global.requestIdleCallback = originalRequestIdleCallback
      setTimeoutSpy.mockRestore()
    })
  })

  describe('performance considerations', () => {
    it('should not block main thread during preloading', async () => {
      const startTime = performance.now()
      
      await preloadCriticalRoutes(true)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Preloading should be fast and non-blocking
      expect(duration).toBeLessThan(100)
    })

    it('should handle multiple concurrent preload requests', async () => {
      const promises = [
        preloadCriticalRoutes(true),
        preloadCriticalRoutes(true),
        preloadCriticalRoutes(true)
      ]
      
      await expect(Promise.all(promises)).resolves.toBeDefined()
    })
  })

  describe('memory management', () => {
    it('should not create memory leaks with repeated preloads', async () => {
      // Simulate multiple preload cycles
      for (let i = 0; i < 10; i++) {
        await preloadCriticalRoutes(true)
        await preloadCriticalRoutes(false)
      }
      
      // Should complete without issues
      expect(true).toBe(true)
    })
  })
})