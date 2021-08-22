import { Injectable, Logger } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { Avatar, Profile, ConfirmationType } from '@prisma/client';
import { PrismaService } from '@providers/prisma/prisma.service';
import { EncryptionService } from '@user/encryption.service';
import { CreatedUser } from './interfaces/created-user.interface';
import { CreatedAvatar } from './interfaces/created-avatar.interface';
import { UserConfigService } from '@config/user/config.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly userConfigService: UserConfigService,
  ) {}

  async createUser(
    displayName: string,
    email: string,
    password: string,
  ): Promise<[boolean, CreatedUser]> {
    const passwordHash = await this.encryptionService.hash(password);
    const confirmationSecret = await this.encryptionService.generateConfirmationSecret(
      email,
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          displayName,
          email,
          password: passwordHash,
          confirmations: {
            create: [
              {
                type: ConfirmationType.REGISTER,
                code: confirmationSecret,
                expiresAt: this.userConfigService.registerConfirmExpirationDate,
              },
            ],
          },
        },
      });

      return [
        true,
        {
          id: user.id,
          confirmCode: confirmationSecret,
        },
      ];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findOne(id: number): Promise<[boolean, User]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { avatar: true },
      });

      if (!user) {
        return [false, null];
      }

      return [true, user];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findByEmail(email: string): Promise<[boolean, User]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: { avatar: true },
      });

      if (!user) {
        return [false, null];
      }

      return [true, user];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findFromList(userIds: number[]): Promise<[boolean, User[]]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { id: { in: userIds } },
        include: {
          avatar: true,
        },
      });

      return [true, users];
    } catch (error) {
      this.logger.error(error);

      return [false, []];
    }
  }

  async findAvatar(userId: number): Promise<[boolean, Avatar]> {
    try {
      const avatar = await this.prisma.avatar.findFirst({ where: { userId } });

      if (!avatar) {
        return [false, null];
      }

      return [true, avatar];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async createAvatar(
    userId: number,
    key: string,
    url: string,
  ): Promise<[boolean, CreatedAvatar]> {
    try {
      const avatar = await this.prisma.avatar.create({
        data: {
          key,
          url,
          userId,
        },
      });

      return [true, { id: avatar.id }];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async deleteAvatar(
    userId: number,
    avatarId: number,
  ): Promise<[boolean, Avatar]> {
    try {
      const avatar = await this.prisma.avatar.findFirst({
        where: { AND: [{ id: avatarId }, { userId }] },
      });

      if (!avatar) {
        return [false, null];
      }

      const deletedAvatar = await this.prisma.avatar.delete({
        where: { id: avatarId },
      });

      return [true, deletedAvatar];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findProfile(userId: number): Promise<[boolean, Profile]> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { userId },
      });

      if (!profile) {
        return [false, null];
      }

      return [true, profile];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}
