import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync();

export const users: Prisma.UserCreateInput[] = [
  {
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin', salt),
    salt,
  },
];