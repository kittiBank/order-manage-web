'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext';

interface UseAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Hook to handle authentication and protected routes
 */
export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = true, redirectTo = '/' } = options;
  const { user, isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    if (requireAuth && !isAuthenticated) {
      // Store the current path for redirect after login
      const returnUrl = pathname || '/order/infinite';
      const loginUrl = `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
