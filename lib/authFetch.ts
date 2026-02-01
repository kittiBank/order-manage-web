import { tokenStorage } from './tokenStorage';
import { authAPI } from './api/auth';

/**
 * Enhanced fetch wrapper with automatic token refresh
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get access token
  let accessToken = tokenStorage.getAccessToken();

  // Check if token is expired and refresh if needed
  if (accessToken && tokenStorage.isTokenExpired()) {
    console.log('Token expired, refreshing...');
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        const response = await authAPI.refreshToken({ refreshToken });
        tokenStorage.setAccessToken(response.accessToken);
        accessToken = response.accessToken;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // Clear tokens and redirect to login
        tokenStorage.clearAll();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        throw error;
      }
    }
  }

  // Add Authorization header if we have a token
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401, try to refresh token once and retry
  const headersObj = options.headers as Record<string, string> | undefined;
  if (response.status === 401 && !headersObj?.['X-Retry']) {
    console.log('Received 401, attempting token refresh...');
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        const refreshResponse = await authAPI.refreshToken({ refreshToken });
        tokenStorage.setAccessToken(refreshResponse.accessToken);
        
        // Retry the original request with new token
        headers.set('Authorization', `Bearer ${refreshResponse.accessToken}`);
        headers.set('X-Retry', 'true'); // Prevent infinite retry loop
        
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (error) {
        console.error('Failed to refresh token on 401:', error);
        // Clear tokens and redirect to login
        tokenStorage.clearAll();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        throw error;
      }
    } else {
      // No refresh token, redirect to login
      tokenStorage.clearAll();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }

  return response;
}

/**
 * Helper to make authenticated API calls with automatic token management
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
