import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { 
  useAmplifyData, 
  useAmplifyMutation, 
  useAmplifySubscription,
  clearAmplifyCache,
  clearCacheByPattern
} from './useAmplifyData'

// Mock the GraphQL client
const mockGraphQL = vi.fn()
vi.mock('@/lib/graphql', () => ({
  client: {
    graphql: mockGraphQL
  }
}))

describe('useAmplifyData Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearAmplifyCache()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('useAmplifyData', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: '1', name: 'Test Item' }
      mockGraphQL.mockResolvedValue({
        data: mockData
      })

      const { result } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual(mockData)
      expect(result.current.error).toBeNull()
      expect(mockGraphQL).toHaveBeenCalledWith({
        query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
        variables: { id: '1' }
      })
    })

    it('should handle GraphQL errors', async () => {
      const mockError = new Error('GraphQL Error')
      mockGraphQL.mockRejectedValue(mockError)

      const { result } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toBeNull()
      expect(result.current.error).toBe(mockError)
    })

    it('should handle GraphQL response errors', async () => {
      mockGraphQL.mockResolvedValue({
        data: null,
        errors: [{ message: 'Item not found' }]
      })

      const { result } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toBeNull()
      expect(result.current.error).toEqual(expect.objectContaining({
        message: expect.stringContaining('Item not found')
      }))
    })

    it('should use cached data when available', async () => {
      const mockData = { id: '1', name: 'Cached Item' }
      
      // First call - should fetch from API
      mockGraphQL.mockResolvedValue({
        data: mockData
      })

      const { result: result1 } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result1.current.loading).toBe(false)
      })

      expect(result1.current.data).toEqual(mockData)
      expect(mockGraphQL).toHaveBeenCalledTimes(1)

      // Second call - should use cache
      const { result: result2 } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      // Should immediately return cached data
      expect(result2.current.loading).toBe(false)
      expect(result2.current.data).toEqual(mockData)
      expect(mockGraphQL).toHaveBeenCalledTimes(1) // No additional API call
    })

    it('should refetch data when refetch is called', async () => {
      const mockData1 = { id: '1', name: 'Original Item' }
      const mockData2 = { id: '1', name: 'Updated Item' }

      mockGraphQL
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 })

      const { result } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual(mockData1)

      // Refetch
      await result.current.refetch()

      expect(result.current.data).toEqual(mockData2)
      expect(mockGraphQL).toHaveBeenCalledTimes(2)
    })

    it('should skip query when skip option is true', () => {
      const { result } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' },
          skip: true
        })
      )

      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(mockGraphQL).not.toHaveBeenCalled()
    })

    it('should update cache optimistically', async () => {
      const mockData = { id: '1', name: 'Original Item' }
      mockGraphQL.mockResolvedValue({ data: mockData })

      const { result } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual(mockData)

      // Update cache optimistically
      const updatedData = { id: '1', name: 'Updated Item' }
      result.current.updateCache(() => updatedData)

      expect(result.current.data).toEqual(updatedData)
    })
  })

  describe('useAmplifyMutation', () => {
    it('should execute mutation successfully', async () => {
      const mockResult = { id: '1', name: 'Created Item' }
      mockGraphQL.mockResolvedValue({
        data: mockResult
      })

      const { result } = renderHook(() =>
        useAmplifyMutation({
          mutation: 'mutation CreateItem($input: CreateItemInput!) { createItem(input: $input) { id name } }'
        })
      )

      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()

      const variables = { input: { name: 'New Item' } }
      const response = await result.current.mutate(variables)

      expect(response).toEqual(mockResult)
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual(mockResult)
      expect(result.current.error).toBeNull()
      expect(mockGraphQL).toHaveBeenCalledWith({
        query: 'mutation CreateItem($input: CreateItemInput!) { createItem(input: $input) { id name } }',
        variables
      })
    })

    it('should handle mutation errors', async () => {
      const mockError = new Error('Mutation Error')
      mockGraphQL.mockRejectedValue(mockError)

      const { result } = renderHook(() =>
        useAmplifyMutation({
          mutation: 'mutation CreateItem($input: CreateItemInput!) { createItem(input: $input) { id name } }'
        })
      )

      const variables = { input: { name: 'New Item' } }
      await expect(result.current.mutate(variables)).rejects.toThrow('Mutation Error')

      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBe(mockError)
    })

    it('should call onCompleted callback on success', async () => {
      const mockResult = { id: '1', name: 'Created Item' }
      const onCompleted = vi.fn()
      
      mockGraphQL.mockResolvedValue({
        data: mockResult
      })

      const { result } = renderHook(() =>
        useAmplifyMutation({
          mutation: 'mutation CreateItem($input: CreateItemInput!) { createItem(input: $input) { id name } }',
          onCompleted
        })
      )

      await result.current.mutate({ input: { name: 'New Item' } })

      expect(onCompleted).toHaveBeenCalledWith(mockResult)
    })

    it('should handle optimistic response', async () => {
      const optimisticResponse = { id: 'temp-1', name: 'Optimistic Item' }
      const actualResponse = { id: '1', name: 'Created Item' }
      
      mockGraphQL.mockResolvedValue({
        data: actualResponse
      })

      const { result } = renderHook(() =>
        useAmplifyMutation({
          mutation: 'mutation CreateItem($input: CreateItemInput!) { createItem(input: $input) { id name } }',
          optimisticResponse
        })
      )

      const mutationPromise = result.current.mutate({ input: { name: 'New Item' } })

      // Should immediately show optimistic response
      expect(result.current.data).toEqual(optimisticResponse)

      await mutationPromise

      // Should show actual response after completion
      expect(result.current.data).toEqual(actualResponse)
    })
  })

  describe('useAmplifySubscription', () => {
    it('should handle subscription data', async () => {
      const mockData = { id: '1', name: 'Subscription Data' }
      const onData = vi.fn()

      // Mock subscription
      const mockSubscription = {
        subscribe: vi.fn((callbacks) => {
          // Simulate receiving data
          setTimeout(() => {
            callbacks.next({ data: mockData })
          }, 10)
          
          return {
            unsubscribe: vi.fn()
          }
        })
      }

      mockGraphQL.mockReturnValue(mockSubscription)

      const { result } = renderHook(() =>
        useAmplifySubscription({
          subscription: 'subscription OnItemCreated { onItemCreated { id name } }',
          onData
        })
      )

      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBeNull()

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual(mockData)
      expect(onData).toHaveBeenCalledWith(mockData)
    })

    it('should handle subscription errors', async () => {
      const mockError = new Error('Subscription Error')
      const onError = vi.fn()

      const mockSubscription = {
        subscribe: vi.fn((callbacks) => {
          setTimeout(() => {
            callbacks.error(mockError)
          }, 10)
          
          return {
            unsubscribe: vi.fn()
          }
        })
      }

      mockGraphQL.mockReturnValue(mockSubscription)

      const { result } = renderHook(() =>
        useAmplifySubscription({
          subscription: 'subscription OnItemCreated { onItemCreated { id name } }',
          onError
        })
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe(mockError)
      expect(onError).toHaveBeenCalledWith(mockError)
    })
  })

  describe('Cache Management', () => {
    it('should clear all cache when clearAmplifyCache is called', async () => {
      const mockData = { id: '1', name: 'Test Item' }
      mockGraphQL.mockResolvedValue({ data: mockData })

      // Populate cache
      const { result } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockGraphQL).toHaveBeenCalledTimes(1)

      // Clear cache
      clearAmplifyCache()

      // Next query should fetch fresh data
      const { result: result2 } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result2.current.loading).toBe(false)
      })

      expect(mockGraphQL).toHaveBeenCalledTimes(2) // Fresh API call
    })

    it('should clear cache by pattern', async () => {
      const mockData1 = { id: '1', name: 'Item 1' }
      const mockData2 = { id: '2', name: 'Item 2' }
      
      mockGraphQL
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 })

      // Populate cache with different queries
      const { result: result1 } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      const { result: result2 } = renderHook(() =>
        useAmplifyData({
          query: 'query GetUser($id: ID!) { getUser(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result1.current.loading).toBe(false)
        expect(result2.current.loading).toBe(false)
      })

      // Clear only GetItem queries
      clearCacheByPattern('GetItem')

      mockGraphQL.mockClear()
      mockGraphQL
        .mockResolvedValueOnce({ data: { ...mockData1, name: 'Updated Item 1' } })

      // GetItem should fetch fresh data
      const { result: result3 } = renderHook(() =>
        useAmplifyData({
          query: 'query GetItem($id: ID!) { getItem(id: $id) { id name } }',
          variables: { id: '1' }
        })
      )

      await waitFor(() => {
        expect(result3.current.loading).toBe(false)
      })

      expect(mockGraphQL).toHaveBeenCalledTimes(1) // Only GetItem refetched
    })
  })
})