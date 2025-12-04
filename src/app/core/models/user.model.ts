export interface User {
  user_id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type UserRole = 'Admin' | 'Manager' | 'Receptionist';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}
