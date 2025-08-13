import { inject, injectable } from "tsyringe";
import { User } from "../domain/user.entity";
import { IUserRepository } from "../domain/user.repository";

@injectable()
export class UserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUser(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }
}
