import { Module } from '@nestjs/common';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { UserConfigModule } from '@config/user/config.module';
import { EncryptionModule } from '@encryption/encryption.module';
import { UserController } from './user.controller';
import { UserSerializerService } from './serializers/user.serializer';
import { AvatarSerializerService } from './serializers/avatar.serializer';
import { UserService } from './user.service';

@Module({
  imports: [UserConfigModule, EncryptionModule, PrismaModule],
  controllers: [UserController],
  providers: [UserSerializerService, AvatarSerializerService, UserService],
})
export class UserModule {}
