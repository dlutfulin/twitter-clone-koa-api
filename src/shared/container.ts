import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "../services/user/user.repository";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { UserController } from "../application/api/controllers/user.controller";
import { UserRepositoryImpl } from "../services/user/user.repository.impl";
import { IAuthRepository } from "../services/auth/auth.repository";
import { AuthRepositoryImpl } from "../services/auth/auth.repository.impl";
import { PostRepositoryImpl } from "../services/post/post.repository.impl";
import { IPostRepository } from "../services/post/post.repository";
import { PostService } from "../services/post/post.service";
import { PostController } from "../application/api/controllers/post.controller";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepositoryImpl,
});

container.register<IAuthRepository>("IAuthRepository", {
  useClass: AuthRepositoryImpl,
});

container.register<IPostRepository>("IPostRepository", {
  useClass: PostRepositoryImpl,
});

container.register(AuthService, {
  useClass: AuthService,
});

container.register(UserService, {
  useClass: UserService,
});

container.register(PostService, {
  useClass: PostService,
});

container.register(UserController, {
  useClass: UserController,
});

container.register(PostController, {
  useClass: PostController,
});

export { container };
