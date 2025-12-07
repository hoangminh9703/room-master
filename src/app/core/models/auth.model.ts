import { User } from './user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Account {
  accountId?: string;
  username?: string;
  email?: string;
  role?: string | number;
  status?: string;
  fullName?: string;
  phone?: string;
  [key: string]: any;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  account: Account | User | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Account | User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: User;
  expiresIn?: number;
}

export interface LogoutResponse {
  success: boolean;
}
