import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../domain/user.repository";
import { RegisterDTO } from "../interfaces/dtos/register.dto";
import { User } from "../domain/user.entity";
import { LoginDTO } from "../interfaces/dtos/login.dto";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

@injectable()
export class AuthService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
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

  async login(data: LoginDTO): Promise<{ token: string; user: any }> {
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

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { passwordHash, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await this.userRepository.findByEmail(decoded.email);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
