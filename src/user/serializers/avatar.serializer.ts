import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Avatar as AvatarPrisma } from '@prisma/client';
import { Avatar as AvatarProto } from 'cryptomath-api-proto/types/user';

@Injectable()
export class AvatarSerializerService extends BaseSerializerService<
  AvatarPrisma,
  AvatarProto
> {
  async serialize(avatar: AvatarPrisma): Promise<AvatarProto> {
    return {
      url: avatar.url,
    };
  }
}
