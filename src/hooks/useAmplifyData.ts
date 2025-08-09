import { useState, useEffect, useCallback } from 'react';
import { client } from '@/lib/graphql';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

// Generic hook for GraphQL operations with caching and error handling
interface UseAmplifyDataOptions<T> {
  query: string;
  variables?: Record<string, any>;
  skip?: boolean;
  pollInterval?: number;
  cacheKey?: string;
  onCompleted?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseAmplifyDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateCache: (updater: (prevData: T | null) => T | null) => void;
}

// In-memory cache for GraphQL results
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useAmplifyData<T = any>(
  options: UseAmplifyDataOptions<T>
): UseAmplifyDataReturn<T> {
  const { query, variables = {}, skip = false, pollInterval, cacheKey, onCompleted, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  // Generate cache key
  const getCacheKey = useCallback(() => {
    return cacheKey || `${query}_${JSON.stringify(variables)}`;
  }, [query, variables, cacheKey]);

  // Check cache
  const getCachedData = useCallback(() => {
    const key = getCacheKey();
    const cached = queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return null;
  }, [getCacheKey]);

  // Set cache
  const setCachedData = useCallback((newData: T) => {
    const key = getCacheKey();
    queryCache.set(key, { data: newData, timestamp: Date.now() });
  }, [getCacheKey]);

  // Execute GraphQL query
  const executeQuery = useCallback(async () => {
    if (skip) return;

    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      onCompleted?.(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await client.graphql({
        query,
        variables,
      }) as GraphQLResult<any>;

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      const responseData = response.data
      setData(responseData);
      setCachedData(responseData);
      onCompleted?.(responseData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      onError?.(error);
      console.error('GraphQL query error:', error);
    } finally {
      setLoading(false);
    }
  }, [query, variables, skip, getCachedData, setCachedData, onCompleted, onError]);

  // Refetch function
  const refetch = useCallback(async () => {
    // Clear cache for this query
    const key = getCacheKey();
    queryCache.delete(key);
    await executeQuery();
  }, [executeQuery, getCacheKey]);

  // Update cache function for optimistic updates
  const updateCache = useCallback((updater: (prevData: T | null) => T | null) => {
    const newData = updater(data);
    if (newData !== null && newData !== undefined) {
      setData(newData);
      setCachedData(newData);
    }
  }, [data, setCachedData]);

  // Execute query on mount and when dependencies change
  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  // Set up polling if specified
  useEffect(() => {
    if (pollInterval && !skip) {
      const interval = setInterval(executeQuery, pollInterval);
      return () => clearInterval(interval);
    }
  }, [executeQuery, pollInterval, skip]);

  return {
    data,
    loading,
    error,
    refetch,
    updateCache,
  };
}

// Hook for GraphQL mutations
interface AmplifyMutationOptions<TData> {
  mutation: string;
  onCompleted?: (data: TData) => void;
  onError?: (error: Error) => void;
  optimisticResponse?: TData;
  update?: (cache: Map<string, any>, result: TData) => void;
}

interface AmplifyMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  loading: boolean;
  error: Error | null;
  data: TData | null;
}

export function useAmplifyMutation<TData = any, TVariables = Record<string, any>>(
  options: AmplifyMutationOptions<TData>
): AmplifyMutationReturn<TData, TVariables> {
  const { mutation, onCompleted, onError, optimisticResponse, update } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setLoading(true);
    setError(null);

    // Apply optimistic response immediately
    if (optimisticResponse) {
      setData(optimisticResponse);
      onCompleted?.(optimisticResponse);
    }

    try {
      const response = await client.graphql({
        query: mutation,
        variables,
      }) as GraphQLResult<any>;

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      const responseData = response.data as TData;
      setData(responseData);
      
      // Update cache if update function provided
      if (update) {
        update(queryCache, responseData);
      }

      onCompleted?.(responseData);
      return responseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      onError?.(error);
      
      // Revert optimistic response on error
      if (optimisticResponse) {
        setData(null);
      }
      
      console.error('GraphQL mutation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutation, onCompleted, onError, optimisticResponse, update]);

  return {
    mutate,
    loading,
    error,
    data,
  };
}

// Hook for real-time subscriptions
interface UseAmplifySubscriptionOptions<T> {
  subscription: string;
  variables?: Record<string, any>;
  skip?: boolean;
  onData?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseAmplifySubscriptionReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAmplifySubscription<T = any>(
  options: UseAmplifySubscriptionOptions<T>
): UseAmplifySubscriptionReturn<T> {
  const { subscription, variables = {}, skip = false, onData, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (skip) return;

    let isCancelled = false;

    const setupSubscription = async () => {
      try {
        const sub = client.graphql({
          query: subscription,
          variables,
        });

        // Handle subscription data
        if ('subscribe' in sub) {
          const subscription = sub.subscribe({
            next: (result: any) => {
              if (isCancelled) return;
              
              if (result.errors) {
                const error = new Error(`Subscription errors: ${JSON.stringify(result.errors)}`);
                setError(error);
                onError?.(error);
                return;
              }

              const responseData = result.data;
              setData(responseData);
              setLoading(false);
              onData?.(responseData);
            },
            error: (err: any) => {
              if (isCancelled) return;
              
              const error = err instanceof Error ? err : new Error('Subscription error');
              setError(error);
              setLoading(false);
              onError?.(error);
              console.error('GraphQL subscription error:', error);
            },
          });

          return () => {
            subscription.unsubscribe();
          };
        }
      } catch (err) {
        if (isCancelled) return;
        
        const error = err instanceof Error ? err : new Error('Failed to setup subscription');
        setError(error);
        setLoading(false);
        onError?.(error);
        console.error('Subscription setup error:', error);
      }
    };

    const cleanup = setupSubscription();

    return () => {
      isCancelled = true;
      cleanup?.then(unsubscribe => unsubscribe?.());
    };
  }, [subscription, variables, skip, onData, onError]);

  return {
    data,
    loading,
    error,
  };
}

// Utility function to clear all cached data
export function clearAmplifyCache() {
  queryCache.clear();
}

// Utility function to clear specific cache entries
export function clearCacheByPattern(pattern: string | RegExp) {
  const keysToDelete: string[] = [];
  
  for (const key of queryCache.keys()) {
    if (typeof pattern === 'string' && key.includes(pattern)) {
      keysToDelete.push(key);
    } else if (pattern instanceof RegExp && pattern.test(key)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => queryCache.delete(key));
}