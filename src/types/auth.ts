export type UserRole = "ROLE_CLIENT" | "ROLE_EMPLOYEE";

export interface User {
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  message: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  email: string;
  roles: string[];
  id: number;
  name: string;
  balance: number;
}
