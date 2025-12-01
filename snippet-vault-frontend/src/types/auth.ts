export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}
