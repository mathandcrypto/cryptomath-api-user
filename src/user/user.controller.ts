import { Controller } from '@nestjs/common';
import {
  UserServiceControllerMethods,
  UserServiceController,
  FindOneRequest,
  FindOneResponse,
  FindByEmailAndPasswordRequest,
  FindByEmailAndPasswordResponse,
} from 'cryptomath-api-proto/proto/build/user';
import { UserService } from './user.service';
import { EncryptionService } from '@encryption/encryption.service';
import { UserSerializerService } from './serializers/user.serializer';

@Controller('user')
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly userSerializerService: UserSerializerService,
  ) {}

  async findOne({ id }: FindOneRequest): Promise<FindOneResponse> {
    const [isUserExists, user] = await this.userService.findOne(id);

    if (!isUserExists) {
      return { isUserExists: false, user: null };
    }

    return {
      isUserExists: true,
      user: await this.userSerializerService.serialize(user),
    };
  }

  async findByEmailAndPassword({
    email,
    password,
  }: FindByEmailAndPasswordRequest): Promise<FindByEmailAndPasswordResponse> {
    const [isUserExists, user] = await this.userService.findByEmail(email);

    if (!isUserExists) {
      return { isUserExists: false, isValidPassword: false, user: null };
    }

    const isValidPassword = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      return { isUserExists: true, isValidPassword: false, user: null };
    }

    return {
      isUserExists: true,
      isValidPassword: true,
      user: await this.userSerializerService.serialize(user),
    };
  }
}
