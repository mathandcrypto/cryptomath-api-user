import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { User } from '../interfaces/user.interface';
import { User as UserProto } from 'cryptomath-api-proto/types/user';
import { RoleSerializerService } from './role.serializer';
import { AvatarSerializerService } from './avatar.serializer';
import { getUnixTime } from 'date-fns';

@Injectable()
export class UserSerializerService extends BaseSerializerService<
  User,
  UserProto
> {
  constructor(
    private readonly roleSerializerService: RoleSerializerService,
    private readonly avatarSerializerService: AvatarSerializerService,
  ) {
    super();
  }

  async serialize(user: User): Promise<UserProto> {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: await this.roleSerializerService.serialize(user.role),
      reputation: user.reputation,
      avatar: user.avatar
        ? await this.avatarSerializerService.serialize(user.avatar)
        : null,
      createdAt: getUnixTime(user.createdAt),
    };
  }
}
