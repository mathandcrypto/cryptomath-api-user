import { User as UserPrisma, Avatar } from '@prisma/client';

export interface User extends UserPrisma {
  avatar?: Avatar;
}
