'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, UserSession } from '@/app/types/user';
import { tokenStorage } from '@/lib/tokenStorage';
import { authAPI } from '@/lib/api/auth';

interface UserContextType extends UserSession {
  login: (user: User, accessToken: string, refreshToken: string, expiresIn?: number) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to refresh access token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedRefreshToken = tokenStorage.getRefreshToken();
      if (!storedRefreshToken) {
        console.log('No refresh token available');
        return false;
      }

      console.log('Refreshing access token...');
      const response = await authAPI.refreshToken({ refreshToken: storedRefreshToken });
      
      // Update tokens
      tokenStorage.setAccessToken(response.accessToken);
      setAccessToken(response.accessToken);
      
      console.log('Access token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // If refresh fails, logout user
      await logout();
      return false;
    }
  }, []);

  // Setup auto-refresh timer
  const setupRefreshTimer = useCallback(() => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const timeUntilExpiry = tokenStorage.getTimeUntilExpiry();
    
    if (timeUntilExpiry > 0) {
      console.log(`Setting up token refresh in ${Math.floor(timeUntilExpiry / 1000)} seconds`);
      
      // Refresh 5 minutes before expiry (already handled in tokenStorage)
      refreshTimerRef.current = setTimeout(async () => {
        await refreshAccessToken();
        setupRefreshTimer(); // Setup next refresh
      }, timeUntilExpiry);
    }
  }, [refreshAccessToken]);

  // Load user and tokens from storage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = tokenStorage.getUser();
        const storedAccessToken = tokenStorage.getAccessToken();
        const storedRefreshToken = tokenStorage.getRefreshToken();
        
        if (storedUser && storedAccessToken) {
          setUser(storedUser);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsAuthenticated(true);

          // Check if token is expired
          if (tokenStorage.isTokenExpired()) {
            console.log('Token expired, attempting refresh...');
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              // Refresh failed, clear everything
              tokenStorage.clearAll();
              setUser(null);
              setAccessToken(null);
              setRefreshToken(null);
              setIsAuthenticated(false);
            }
          }

          // Setup auto-refresh
          setupRefreshTimer();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        tokenStorage.clearAll();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [refreshAccessToken, setupRefreshTimer]);

  const login = (userData: User, token: string, refresh: string, expiresIn: number = 3600) => {
    setUser(userData);
    setAccessToken(token);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
    
    // Use secure token storage
    tokenStorage.setUser(userData);
    tokenStorage.setAccessToken(token, expiresIn);
    tokenStorage.setRefreshToken(refresh);

    // Setup auto-refresh timer
    setupRefreshTimer();
  };

  const logout = async () => {
    try {
      // Call logout API if we have a token
      if (accessToken) {
        await authAPI.logout(accessToken).catch((err) => {
          console.error('Logout API error:', err);
          // Continue with local logout even if API fails
        });
      }
    } finally {
      // Clear timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      // Clear all state and storage
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      tokenStorage.clearAll();
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
