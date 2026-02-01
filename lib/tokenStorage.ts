/**
 * Secure Token Storage Utilities
 * Manages access and refresh tokens with better security practices
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  TOKEN_EXPIRY: 'tokenExpiry',
} as const;

export const tokenStorage = {
  /**
   * Set access token with expiry time
   */
  setAccessToken(token: string, expiresIn: number = 3600): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    
    // Store expiry time (current time + expiresIn seconds - 5 minutes buffer)
    const expiryTime = Date.now() + (expiresIn - 300) * 1000;
    localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRY, expiryTime.toString());
  },

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  },

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  },

  /**
   * Set user data
   */
  setUser(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Get user data
   */
  getUser(): any | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem(TOKEN_KEYS.USER);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  },

  /**
   * Check if token is expired or about to expire
   */
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const expiryTime = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (!expiryTime) return true;
    
    return Date.now() >= parseInt(expiryTime);
  },

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(): number {
    if (typeof window === 'undefined') return 0;
    
    const expiryTime = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (!expiryTime) return 0;
    
    const timeLeft = parseInt(expiryTime) - Date.now();
    return Math.max(0, timeLeft);
  },

  /**
   * Clear all tokens and user data
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
  },

  /**
   * Check if user is authenticated (has valid tokens)
   */
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const user = this.getUser();
    return !!(accessToken && user);
  },
};
