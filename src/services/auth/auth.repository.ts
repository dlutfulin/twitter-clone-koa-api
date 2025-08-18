import { RefreshTokenData } from './types/auth.local.types';

export interface IAuthRepository {
  saveRefreshToken(tokenData: RefreshTokenData): Promise<RefreshTokenData>;
  findRefreshToken(token: string): Promise<RefreshTokenData | null>;
  findRefreshTokenById(id: number): Promise<RefreshTokenData | null>;
  revokeRefreshToken(tokenId: number): Promise<void>;
  revokeAllUserTokens(userId: number): Promise<void>;
  cleanExpiredTokens(): Promise<void>;
}