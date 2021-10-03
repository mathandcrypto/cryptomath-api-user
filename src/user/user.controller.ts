import { Controller } from '@nestjs/common';
import {
  UserServiceControllerMethods,
  UserServiceController,
  CreateUserRequest,
  CreateUserResponse,
  FindOneRequest,
  FindOneResponse,
  FindByEmailRequest,
  FindByEmailResponse,
  FindByEmailAndPasswordRequest,
  FindByEmailAndPasswordResponse,
  FindFromListRequest,
  FindFromListResponse,
  FindAvatarRequest,
  FindAvatarResponse,
  CreateAvatarRequest,
  CreateAvatarResponse,
  DeleteAvatarRequest,
  DeleteAvatarResponse,
  FindProfileRequest,
  FindProfileResponse,
  User as UserProto,
} from '@cryptomath/cryptomath-api-proto/types/user';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';
import { EncryptionService } from '@user/encryption.service';
import { UserSerializerService } from './serializers/user.serializer';
import { AvatarSerializerService } from './serializers/avatar.serializer';
import { ProfileSerializerService } from './serializers/profile.serializer';

@Controller()
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly userSerializerService: UserSerializerService,
    private readonly avatarSerializerService: AvatarSerializerService,
    private readonly profileSerializerService: ProfileSerializerService,
  ) {}

  async createUser({
    displayName,
    email,
    password,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const [isUserExists] = await this.userService.findByEmail(email);

    if (isUserExists) {
      return {
        isUserCreated: false,
        isUserAlreadyExists: true,
        createdUser: null,
      };
    }

    const [isUserCreated, createUserResponse] =
      await this.userService.createUser(displayName, email, password);

    if (!isUserCreated) {
      return {
        isUserCreated: false,
        isUserAlreadyExists: false,
        createdUser: null,
      };
    }

    const { id, confirmCode } = createUserResponse;

    return {
      isUserCreated: true,
      isUserAlreadyExists: false,
      createdUser: { id, confirmCode },
    };
  }

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

  async findByEmail({
    email,
  }: FindByEmailRequest): Promise<FindByEmailResponse> {
    const [isUserExists, user] = await this.userService.findByEmail(email);

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

  private async prepareUsersMap(
    users: User[],
  ): Promise<{ [key: number]: UserProto }> {
    const usersMap = {} as { [key: number]: UserProto };
    const serializedUsers = await Promise.all(
      users.map((user) => this.userSerializerService.serialize(user)),
    );

    serializedUsers.forEach((user) => {
      usersMap[user.id] = user;
    });

    return usersMap;
  }

  async findFromList({
    idList,
  }: FindFromListRequest): Promise<FindFromListResponse> {
    const [isUsersFound, users] = await this.userService.findFromList(idList);

    if (!isUsersFound) {
      return {
        isUsersFound: false,
        users: {},
      };
    }

    return {
      isUsersFound: true,
      users: await this.prepareUsersMap(users),
    };
  }

  async findAvatar({ userId }: FindAvatarRequest): Promise<FindAvatarResponse> {
    const [isAvatarExists, avatar] = await this.userService.findAvatar(userId);

    if (!isAvatarExists) {
      return {
        isAvatarExists: false,
        avatar: null,
      };
    }

    return {
      isAvatarExists: true,
      avatar: await this.avatarSerializerService.serialize(avatar),
    };
  }

  async createAvatar({
    userId,
    key,
    url,
  }: CreateAvatarRequest): Promise<CreateAvatarResponse> {
    const [isAvatarExists] = await this.userService.findAvatar(userId);

    if (isAvatarExists) {
      return {
        isAvatarCreated: false,
        isAvatarAlreadyExists: true,
        avatar: null,
      };
    }

    const [isAvatarCreated, avatarId] = await this.userService.createAvatar(
      userId,
      key,
      url,
    );

    if (!isAvatarCreated) {
      return {
        isAvatarCreated: false,
        isAvatarAlreadyExists: false,
        avatar: null,
      };
    }

    return {
      isAvatarCreated: true,
      isAvatarAlreadyExists: false,
      avatar: {
        id: avatarId,
        key,
        url,
      },
    };
  }

  async deleteAvatar({
    userId,
    avatarId,
  }: DeleteAvatarRequest): Promise<DeleteAvatarResponse> {
    const [isAvatarDeleted, avatar] = await this.userService.deleteAvatar(
      userId,
      avatarId,
    );

    if (!isAvatarDeleted) {
      return {
        isAvatarDeleted: false,
        avatar: null,
      };
    }

    return {
      isAvatarDeleted: true,
      avatar: await this.avatarSerializerService.serialize(avatar),
    };
  }

  async findProfile({
    userId,
  }: FindProfileRequest): Promise<FindProfileResponse> {
    const [isProfileExists, profile] = await this.userService.findProfile(
      userId,
    );

    if (!isProfileExists) {
      return {
        isProfileExists: false,
        profile: null,
      };
    }

    return {
      isProfileExists: true,
      profile: await this.profileSerializerService.serialize(profile),
    };
  }
}
