export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  avatar?: string;
}

export interface UserSession {
  user: User | null;
  isAuthenticated: boolean;
}
