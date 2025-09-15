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
import { S3Service } from "../services/aws/s3.service";
import { SNSService } from "../services/aws/sns.service";
import { LikeService } from "../services/like/like.service";
import { LikeController } from "../application/api/controllers/like.controller";
import { ILikeRepository } from "../services/like/like.repository";
import { LikeRepositoryImpl } from "../services/like/like.repository.impl";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepositoryImpl,
});

container.register<IAuthRepository>("IAuthRepository", {
  useClass: AuthRepositoryImpl,
});

container.register<IPostRepository>("IPostRepository", {
  useClass: PostRepositoryImpl,
});

container.register<ILikeRepository>("ILikeRepository", {
  useClass: LikeRepositoryImpl,
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

container.register(LikeService, {
  useClass: LikeService,
});

container.register(UserController, {
  useClass: UserController,
});

container.register(PostController, {
  useClass: PostController,
});

container.register(LikeController, {
  useClass: LikeController,
});

container.registerSingleton(S3Service);
container.registerSingleton(SNSService);

export { container };
