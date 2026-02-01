'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';

/**
 * Hook to sync state with URL query parameters
 * Supports browser back/forward, sharing links with state, and refresh persistence
 */
export function useUrlState<T extends Record<string, any>>(
  defaultState: T,
  options: {
    replace?: boolean; // Use router.replace instead of router.push
    debounce?: number; // Debounce URL updates (ms)
  } = {}
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { replace = false, debounce = 0 } = options;
  
  // Track if update is from URL (to prevent loop)
  const isUpdatingFromUrl = useRef(false);

  // Parse state from URL on mount
  const getStateFromUrl = useCallback((): T => {
    const state = { ...defaultState };
    
    searchParams.forEach((value, key) => {
      if (key in defaultState) {
        // Parse value based on default type
        const defaultValue = defaultState[key];
        
        if (typeof defaultValue === 'number') {
          const parsed = Number(value);
          if (!isNaN(parsed)) {
            state[key as keyof T] = parsed as any;
          }
        } else if (typeof defaultValue === 'boolean') {
          state[key as keyof T] = (value === 'true') as any;
        } else if (Array.isArray(defaultValue)) {
          state[key as keyof T] = value.split(',') as any;
        } else {
          state[key as keyof T] = value as any;
        }
      }
    });
    
    return state;
  }, [searchParams, defaultState]);

  const [state, setState] = useState<T>(() => getStateFromUrl());

  // Update URL when state changes (but not when state changes from URL)
  const updateUrl = useCallback(
    (newState: T) => {
      // Prevent updating URL if this state change came from URL
      if (isUpdatingFromUrl.current) {
        return;
      }

      const params = new URLSearchParams();
      
      Object.entries(newState).forEach(([key, value]) => {
        // Only add to URL if different from default
        if (value !== undefined && value !== null && value !== defaultState[key]) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(','));
            }
          } else if (value !== '') {
            params.set(key, String(value));
          }
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      
      // Only update if URL actually changed
      const currentUrl = window.location.pathname + window.location.search;
      const targetUrl = newUrl;
      
      if (currentUrl !== targetUrl) {
        if (replace) {
          router.replace(newUrl, { scroll: false });
        } else {
          router.push(newUrl, { scroll: false });
        }
      }
    },
    [pathname, router, replace, defaultState]
  );

  // Debounced URL update
  useEffect(() => {
    if (debounce > 0) {
      const timer = setTimeout(() => {
        updateUrl(state);
      }, debounce);
      
      return () => clearTimeout(timer);
    } else {
      updateUrl(state);
    }
  }, [state, debounce, updateUrl]);

  // Listen to URL changes (browser back/forward)
  useEffect(() => {
    isUpdatingFromUrl.current = true;
    const urlState = getStateFromUrl();
    
    // Only update state if different
    const isDifferent = JSON.stringify(urlState) !== JSON.stringify(state);
    if (isDifferent) {
      setState(urlState);
    }
    
    // Reset flag after state update
    setTimeout(() => {
      isUpdatingFromUrl.current = false;
    }, 0);
  }, [searchParams]);

  // Custom setState that triggers URL update
  const setUrlState = useCallback((updater: T | ((prev: T) => T)) => {
    isUpdatingFromUrl.current = false;
    setState((prevState) => {
      const newState = typeof updater === 'function' ? updater(prevState) : updater;
      return newState;
    });
  }, []);

  return [state, setUrlState] as const;
}

/**
 * Hook specifically for order filters with URL sync
 */
export function useOrderFiltersUrl() {
  const defaultFilters = {
    sortBy: 'newest' as 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'customer-asc' | 'customer-desc',
    customerId: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    cursor: undefined as string | undefined,
  };

  return useUrlState(defaultFilters, {
    replace: true, // Use replace to avoid cluttering browser history
    debounce: 300, // Debounce 300ms to avoid too many URL updates
  });
}
