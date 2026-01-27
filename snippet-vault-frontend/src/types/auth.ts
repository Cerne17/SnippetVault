export interface User {
  _id: string;
  email: string;
  name: string;
  insightPoints?: number;
  preferences?: {
    themeMode: 'light' | 'dark';
    primaryColor: string;
  };
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
