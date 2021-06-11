import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Profile as ProfilePrisma } from '@prisma/client';
import { Profile as ProfileProto } from 'cryptomath-api-proto/types/user';

@Injectable()
export class ProfileSerializerService extends BaseSerializerService<
  ProfilePrisma,
  ProfileProto
> {
  async serialize(profile: ProfilePrisma): Promise<ProfileProto> {
    return {
      bio: profile.bio,
      url: profile.url,
      location: profile.location,
    };
  }
}
