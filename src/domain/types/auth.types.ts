export interface LoginDTO {
    email: string;
    password: string;
  }
  
  export interface RegisterDTO {
    email: string;
    username: string;
    password: string;
  }
  
  export interface AuthTokenPayload {
    userId: number;
    email: string;
    username: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: number;
      email: string;
      username: string;
      isActive: boolean;
    };
  }