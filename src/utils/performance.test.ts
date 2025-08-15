import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  measureComponentLoad,
  getPerformanceMetrics,
  getAverageLoadTime,
  clearPerformanceMetrics,
  reportPerformanceSummary,
  initWebVitalsMonitoring,
  estimateBundleImpact,
  initPerformanceMonitoring
} from './performance'

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => 1000),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => [])
}

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true
})

describe('Performance Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearPerformanceMetrics()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('measureComponentLoad', () => {
    it('should measure component load time', () => {
      const componentName = 'TestComponent'
      const route = '/test'

      mockPerformance.now
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1100) // end time

      const measurement = measureComponentLoad(componentName, route)
      const result = measurement.end()

      expect(result.componentName).toBe(componentName)
      expect(result.loadTime).toBe(100)
      expect(result.route).toBe(route)
      expect(result.timestamp).toBeDefined()
    })

    it('should track multiple measurements', () => {
      const measurement1 = measureComponentLoad('Component1')
      const measurement2 = measureComponentLoad('Component2')

      mockPerformance.now
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1050)
        .mockReturnValueOnce(2000)
        .mockReturnValueOnce(2075)

      measurement1.end()
      measurement2.end()

      const metrics = getPerformanceMetrics()
      expect(metrics).toHaveLength(2)
      expect(metrics[0].componentName).toBe('Component1')
      expect(metrics[1].componentName).toBe('Component2')
    })

    it('should warn about slow components in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const componentName = 'SlowComponent'

      mockPerformance.now
        .mockReturnValueOnce(1000) // start time
        .mockReturnValueOnce(1200) // end time (200ms - over threshold)

      const measurement = measureComponentLoad(componentName)
      measurement.end()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('SlowComponent took 200.00ms')
      )

      consoleSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('initWebVitalsMonitoring', () => {
    it('should initialize web vitals monitoring', () => {
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn()
      }

      // Mock PerformanceObserver
      global.PerformanceObserver = vi.fn().mockImplementation((callback) => {
        return mockObserver
      })

      initWebVitalsMonitoring()

      expect(global.PerformanceObserver).toHaveBeenCalled()
      expect(mockObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['largest-contentful-paint']
      })
    })

    it('should handle missing PerformanceObserver', () => {
      const originalPerformanceObserver = global.PerformanceObserver
      delete (global as any).PerformanceObserver

      expect(() => initWebVitalsMonitoring()).not.toThrow()

      global.PerformanceObserver = originalPerformanceObserver
    })
  })

  describe('getPerformanceMetrics', () => {
    it('should return empty metrics initially', () => {
      clearPerformanceMetrics()
      const metrics = getPerformanceMetrics()

      expect(metrics).toEqual([])
    })

    it('should return metrics after measurements', () => {
      clearPerformanceMetrics()
      
      mockPerformance.now
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1050)

      const measurement = measureComponentLoad('TestComponent')
      measurement.end()

      const metrics = getPerformanceMetrics()

      expect(metrics).toHaveLength(1)
      expect(metrics[0].componentName).toBe('TestComponent')
      expect(metrics[0].loadTime).toBe(50)
    })
  })

  describe('getAverageLoadTime', () => {
    it('should calculate average load time for component', () => {
      clearPerformanceMetrics()
      
      mockPerformance.now
        .mockReturnValueOnce(1000).mockReturnValueOnce(1050) // 50ms
        .mockReturnValueOnce(2000).mockReturnValueOnce(2100) // 100ms

      const measurement1 = measureComponentLoad('TestComponent')
      measurement1.end()
      
      const measurement2 = measureComponentLoad('TestComponent')
      measurement2.end()

      const avgTime = getAverageLoadTime('TestComponent')
      expect(avgTime).toBe(75) // (50 + 100) / 2
    })

    it('should return 0 for unknown component', () => {
      const avgTime = getAverageLoadTime('UnknownComponent')
      expect(avgTime).toBe(0)
    })
  })

  describe('reportPerformance', () => {
    it('should log performance summary', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const loadFunction = vi.fn().mockResolvedValue('loaded')
      
      mockPerformance.now
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1075)

      await measureComponentLoad('TestComponent', loadFunction)
      reportPerformance()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance Summary')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Components loaded: 1')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Average load time: 75ms')
      )

      consoleSpy.mockRestore()
    })

    it('should not log when no metrics available', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      reportPerformance()

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('clearPerformanceMetrics', () => {
    it('should clear all metrics', async () => {
      const loadFunction = vi.fn().mockResolvedValue('loaded')
      mockPerformance.now
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1050)

      await measureComponentLoad('TestComponent', loadFunction)
      
      let metrics = getPerformanceMetrics()
      expect(metrics.totalComponents).toBe(1)

      clearPerformanceMetrics()
      
      metrics = getPerformanceMetrics()
      expect(metrics.totalComponents).toBe(0)
      expect(metrics.componentLoads).toEqual({})
    })
  })
})