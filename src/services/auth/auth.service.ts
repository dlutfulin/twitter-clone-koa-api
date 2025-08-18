import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../user/user.repository";
import { IAuthRepository } from "../auth/auth.repository";
import { User } from "../../domain/entities/user.entity";
import { LoginDTO, RegisterDTO } from "../../domain/types/auth.types";
import {
  TokenPair,
  AccessTokenPayload,
  LoginResult,
} from "./types/auth.local.types";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

@injectable()
export class AuthService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IAuthRepository") private authRepository: IAuthRepository
  ) {}

  async register(data: RegisterDTO): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exist");
    }

    const existingUsername = await this.userRepository.findByUsername(
      data.username
    );
    if (existingUsername) {
      throw new Error("Username already exist");
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const newUser = User.create({
      email: data.email,
      username: data.username,
      passwordHash,
    });

    return this.userRepository.save(newUser);
  }

  async login(data: LoginDTO): Promise<LoginResult> {
    let user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      user = await this.userRepository.findByUsername(data.email);
    }

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const tokens = await this.generateTokenPair(user);

    return {
      user: {
        id: user.id!,
        email: user.email,
        username: user.username,
        isActive: user.isActive!,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const tokenData = await this.authRepository.findRefreshToken(refreshToken);

    if (!tokenData) {
      throw new Error("Invalid refresh token");
    }

    if (tokenData.isRevoked) {
      throw new Error("Refresh token has been revoked");
    }

    if (new Date() > tokenData.expiresAt) {
      await this.authRepository.revokeRefreshToken(tokenData.id!);
      throw new Error("Refresh token has expired");
    }

    const user = await this.userRepository.findById(
      tokenData.userId.toString()
    );
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    await this.authRepository.revokeRefreshToken(tokenData.id!);

    return this.generateTokenPair(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenData = await this.authRepository.findRefreshToken(refreshToken);
    if (tokenData && !tokenData.isRevoked) {
      await this.authRepository.revokeRefreshToken(tokenData.id!);
    }
  }

  async verifyAccessToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;

      if (decoded.tokenType !== "access") {
        throw new Error("Invalid token type");
      }

      const user = await this.userRepository.findById(
        decoded.userId.toString()
      );

      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      return user;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  private async generateTokenPair(user: User): Promise<TokenPair> {
    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id!,
      email: user.email,
      username: user.username,
      tokenType: "access",
    };

    const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshTokenString = this.generateSecureToken();
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setTime(
      refreshTokenExpiresAt.getTime() +
        this.parseTimeToMs(REFRESH_TOKEN_EXPIRES_IN)
    );

    const savedRefreshToken = await this.authRepository.saveRefreshToken({
      userId: user.id!,
      token: refreshTokenString,
      expiresAt: refreshTokenExpiresAt,
      isRevoked: false,
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
    };
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  private parseTimeToMs(timeString: string): number {
    const timeValue = parseInt(timeString.slice(0, -1));
    const timeUnit = timeString.slice(-1);

    switch (timeUnit) {
      case "m":
        return timeValue * 60 * 1000;
      case "h":
        return timeValue * 60 * 60 * 1000;
      case "d":
        return timeValue * 24 * 60 * 60 * 1000;
      default:
        return timeValue * 1000;
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.authRepository.cleanExpiredTokens();
  }
}
