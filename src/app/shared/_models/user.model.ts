// src/app/_models/user.model.ts

export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    role: string;
  }
  
  export interface AuthResponse {
    status: boolean;
    message?: string;
    error_message?: string;
    user?: User;
  }