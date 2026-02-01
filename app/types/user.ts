export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'User';
  avatar?: string;
}

export interface UserSession {
  user: User | null;
  isAuthenticated: boolean;
}
