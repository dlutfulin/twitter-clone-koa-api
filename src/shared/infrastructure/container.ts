import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserRepositoryImpl } from '../../modules/user/infrastructure/user.repository.impl';
import { AuthService } from '../../modules/user/application/auth.service';
import { UserService } from '../../modules/user/application/user.service';
import { UserController } from '../../application/api/controllers/user.controller';
import { IUserRepository } from '../../modules/user/domain/user.repository';

container.register<IUserRepository>('IUserRepository', {
  useClass: UserRepositoryImpl
});

container.register(AuthService, {
  useClass: AuthService
});

container.register(UserService, {
  useClass: UserService
});

container.register(UserController, {
  useClass: UserController
});

export { container };