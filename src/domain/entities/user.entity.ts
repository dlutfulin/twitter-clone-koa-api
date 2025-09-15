import { Username } from "../../services/user/value-objects/username.vo";
import { CreateUserProps } from "../types/user.types";

export class User {
  constructor(
    public readonly id: number | null,
    public readonly email: string,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly isActive: boolean | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly avatarUrl: string | null = null,
    public readonly avatarS3Key: string | null = null
  ) {}

  static create(props: CreateUserProps): User {
    // UserEmail.validate(props.email);
    Username.validate(props.username);

    const now = new Date();
    return new User(
      null,
      props.email.toLowerCase(),
      props.username.toLowerCase(),
      props.passwordHash,
      true,
      now,
      now
    );
  }

  static fromPersistence(props: {
    id: number;
    email: string;
    username: string;
    passwordHash: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      props.email,
      props.username,
      props.passwordHash,
      props.isActive,
      props.createdAt,
      props.updatedAt
    );
  }

  updatePassword(newPasswordHash: string): User {
    return new User(
      this.id,
      this.email,
      this.username,
      newPasswordHash,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  deactivate(): User {
    return new User(
      this.id,
      this.email,
      this.username,
      this.passwordHash,
      false,
      this.createdAt,
      new Date()
    );
  }

  activate(): User {
    return new User(
      this.id,
      this.email,
      this.username,
      this.passwordHash,
      true,
      this.createdAt,
      new Date()
    );
  }

  isEmailSame(email: string): boolean {
    return this.email === email.toLowerCase();
  }

  isUsernameSame(username: string): boolean {
    return this.username === username.toLowerCase();
  }

    updateAvatar(avatarUrl: string, avatarS3Key: string): User {
    return new User(
      this.id,
      this.email,
      this.username,
      this.passwordHash,
      this.isActive,
      this.createdAt,
      new Date(),
      avatarUrl,
      avatarS3Key
    );
  }


 toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      isActive: this.isActive,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
