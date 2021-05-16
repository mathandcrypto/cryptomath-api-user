import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@providers/prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<[boolean, User]> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

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
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        return [false, null];
      }

      return [true, user];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}
