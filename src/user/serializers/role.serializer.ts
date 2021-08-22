import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Role as RolePrisma } from '@prisma/client';
import { Role as RoleProto } from '@cryptomath/cryptomath-api-proto/types/user';

@Injectable()
export class RoleSerializerService extends BaseSerializerService<
  RolePrisma,
  RoleProto
> {
  async serialize(role: RolePrisma): Promise<RoleProto> {
    return RoleProto[role] || RoleProto.USER;
  }
}
