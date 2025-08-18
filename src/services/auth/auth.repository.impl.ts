import { eq, and, lt } from "drizzle-orm";
import { IAuthRepository } from "./auth.repository";
import { getDb } from "../../shared/drizzle-orm";
import { RefreshTokenData } from "./types/auth.local.types";
import { refreshTokens } from "../../shared/schema";

export class AuthRepositoryImpl implements IAuthRepository {
    async saveRefreshToken(tokenData: RefreshTokenData): Promise<RefreshTokenData> {
      const db = await getDb();
      const [row] = await db
        .insert(refreshTokens)
        .values({
          user_id: tokenData.userId,
          token: tokenData.token,
          expires_at: tokenData.expiresAt,
          is_revoked: tokenData.isRevoked,
        })
        .returning();
  
      return {
        id: row.id,
        userId: row.user_id,
        token: row.token,
        expiresAt: row.expires_at,
        isRevoked: row.is_revoked,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }

    async findRefreshToken(token: string): Promise<RefreshTokenData | null> {
        const db = await getDb();
        const record = await db
          .select()
          .from(refreshTokens)
          .where(
            and(
              eq(refreshTokens.token, token),
              eq(refreshTokens.is_revoked, false)
            )
          )
          .limit(1);
    
        if (!record.length) return null;
    
        const row = record[0];
        return {
          id: row.id,
          userId: row.user_id,
          token: row.token,
          expiresAt: row.expires_at,
          isRevoked: row.is_revoked,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }

      async findRefreshTokenById(id: number): Promise<RefreshTokenData | null> {
        const db = await getDb();
        const record = await db
          .select()
          .from(refreshTokens)
          .where(eq(refreshTokens.id, id))
          .limit(1);
    
        if (!record.length) return null;
    
        const row = record[0];
        return {
          id: row.id,
          userId: row.user_id,
          token: row.token,
          expiresAt: row.expires_at,
          isRevoked: row.is_revoked,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }

      async revokeRefreshToken(tokenId: number): Promise<void> {
        const db = await getDb();
        await db
          .update(refreshTokens)
          .set({ 
            is_revoked: true,
            updated_at: new Date()
          })
          .where(eq(refreshTokens.id, tokenId));
      }

      async revokeAllUserTokens(userId: number): Promise<void> {
        const db = await getDb();
        await db
          .update(refreshTokens)
          .set({ 
            is_revoked: true,
            updated_at: new Date()
          })
          .where(eq(refreshTokens.user_id, userId));
      }

      async cleanExpiredTokens(): Promise<void> {
        const db = await getDb();
        await db
          .delete(refreshTokens)
          .where(
            and(
              lt(refreshTokens.expires_at, new Date()),
              eq(refreshTokens.is_revoked, true)
            )
          );
      }
    }