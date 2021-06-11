import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { User as UserPrisma } from '@prisma/client';
import { User as UserProto } from 'cryptomath-api-proto/types/user';
import { RoleSerializerService } from './role.serializer';

@Injectable()
export class UserSerializerService extends BaseSerializerService<
  UserPrisma,
  UserProto
> {
  constructor(private readonly roleSerializerService: RoleSerializerService) {
    super();
  }

  async serialize(user: UserPrisma): Promise<UserProto> {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: await this.roleSerializerService.serialize(user.role),
    };
  }
}
