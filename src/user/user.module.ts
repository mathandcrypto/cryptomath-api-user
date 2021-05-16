import { Module } from '@nestjs/common';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { EncryptionModule } from '@encryption/encryption.module';
import { UserController } from './user.controller';
import { UserSerializerService } from './serializers/user.serializer';
import { UserService } from './user.service';

@Module({
  imports: [EncryptionModule, PrismaModule],
  controllers: [UserController],
  providers: [UserSerializerService, UserService],
})
export class UserModule {}
