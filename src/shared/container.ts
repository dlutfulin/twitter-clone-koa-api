import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "../services/user/user.repository";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { UserController } from "../application/api/controllers/user.controller";
import { UserRepositoryImpl } from "../services/user/user.repository.impl";
import { IAuthRepository } from "../services/auth/auth.repository";
import { AuthRepositoryImpl } from "../services/auth/auth.repository.impl";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepositoryImpl,
});

container.register<IAuthRepository>("IAuthRepository", {
  useClass: AuthRepositoryImpl,
});

container.register(AuthService, {
  useClass: AuthService,
});

container.register(UserService, {
  useClass: UserService,
});

container.register(UserController, {
  useClass: UserController,
});

export { container };
