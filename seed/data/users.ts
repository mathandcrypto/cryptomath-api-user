import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync();

export const users: Prisma.UserCreateInput[] = [
  {
    email: 'admin@cryptomath.xyz',
    password: bcrypt.hashSync('admin', salt),
    displayName: 'Admin user',
    role: Role.ADMIN,
  },
  {
    email: 'moderator@cryptomath.xyz',
    password: bcrypt.hashSync('moderator', salt),
    displayName: 'Moderator user',
    role: Role.MODERATOR,
  },
  {
    email: 'user@cryptomath.xyz',
    password: bcrypt.hashSync('user', salt),
    displayName: 'Regular user',
    role: Role.USER,
  },
];
