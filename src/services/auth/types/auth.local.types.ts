export interface TokenPair {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface RefreshTokenData {
    id?: number;
    userId: number;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface AccessTokenPayload {
    userId: number;
    email: string;
    username: string;
    tokenType: 'access';
  }
  
  export interface RefreshTokenPayload {
    userId: number;
    tokenId: number;
    tokenType: 'refresh';
  }
  
  export interface TokenValidationResult {
    isValid: boolean;
    payload?: AccessTokenPayload | RefreshTokenPayload;
    error?: string;
  }
  
  export interface LoginResult {
    user: {
      id: number;
      email: string;
      username: string;
      isActive: boolean;
    };
    tokens: TokenPair;
  }