import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { User as UserPrisma } from '@prisma/client';
import { User as UserProto } from 'cryptomath-api-proto/types/user';

@Injectable()
export class UserSerializerService extends BaseSerializerService<
  UserPrisma,
  UserProto
> {
  async serialize(user: UserPrisma): Promise<UserProto> {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    };
  }
}
