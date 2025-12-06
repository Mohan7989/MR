export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_in: number;
}