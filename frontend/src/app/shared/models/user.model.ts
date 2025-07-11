export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDATE' | 'ADMIN' | 'SUPER_ADMIN';
  profilePhoto?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}