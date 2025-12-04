import { User } from './user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
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
