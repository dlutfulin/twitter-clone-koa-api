export interface UserProps {
    id?: number;
    email: string;
    username: string;
    passwordHash: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface CreateUserProps {
    email: string;
    username: string;
    passwordHash: string;
  }
  
  export interface UserResponse {
    id: number;
    email: string;
    username: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }