import { Module } from '@nestjs/common';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { UserConfigModule } from '@config/user/config.module';
import { EncryptionModule } from '@encryption/encryption.module';
import { UserController } from './user.controller';
import { RoleSerializerService } from './serializers/role.serializer';
import { UserSerializerService } from './serializers/user.serializer';
import { AvatarSerializerService } from './serializers/avatar.serializer';
import { ProfileSerializerService } from './serializers/profile.serializer';
import { UserService } from './user.service';

@Module({
  imports: [UserConfigModule, EncryptionModule, PrismaModule],
  controllers: [UserController],
  providers: [
    RoleSerializerService,
    UserSerializerService,
    AvatarSerializerService,
    ProfileSerializerService,
    UserService,
  ],
})
export class UserModule {}
