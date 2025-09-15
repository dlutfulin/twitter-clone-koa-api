import { inject, injectable } from "tsyringe";
import { User } from "../../domain/entities/user.entity";
import { UserResponse } from "../../domain/types/user.types";
import { IUserRepository } from "./user.repository";

@injectable()
export class UserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toUserResponse(user));
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    return this.toUserResponse(user);
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.toUserResponse(user) : null;
  }

  async getUserByUsername(username: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByUsername(username);
    return user ? this.toUserResponse(user) : null;
  }

  async updateUser(
    id: string,
    updates: Partial<{ email: string; username: string }>
  ): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    if (updates.email && !user.isEmailSame(updates.email)) {
      const existingUser = await this.userRepository.findByEmail(updates.email);
      if (existingUser) {
        throw new Error("Email already exists");
      }
    }

    if (updates.username && !user.isUsernameSame(updates.username)) {
      const existingUser = await this.userRepository.findByUsername(
        updates.username
      );
      if (existingUser) {
        throw new Error("Username already exists");
      }
    }

    const updatedUser = new User(
      user.id,
      updates.email || user.email,
      updates.username || user.username,
      user.passwordHash,
      user.isActive,
      user.createdAt,
      new Date()
    );

    const savedUser = await this.userRepository.update(updatedUser);
    return this.toUserResponse(savedUser);
  }

  async deactivateUser(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    const deactivatedUser = user.deactivate();
    const savedUser = await this.userRepository.update(deactivatedUser);
    return this.toUserResponse(savedUser);
  }

  async activateUser(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    const activatedUser = user.activate();
    const savedUser = await this.userRepository.update(activatedUser);
    return this.toUserResponse(savedUser);
  }

  async updateUserAvatar(
    id: string,
    avatar_url: string,
    avatar_s3_key: string
  ): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    const updatedUser = new User(
      user.id,
      user.email,
      user.username,
      user.passwordHash,
      user.isActive,
      user.createdAt,
      new Date(),
      avatar_url,
      avatar_s3_key
    );

    const savedUser = await this.userRepository.update(updatedUser);
    return this.toUserResponse(savedUser);
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id!,
      email: user.email,
      username: user.username,
      isActive: user.isActive!,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatarUrl: user.avatarUrl || undefined,
      avatarS3Key: user.avatarS3Key || undefined,
    };
  }
}
