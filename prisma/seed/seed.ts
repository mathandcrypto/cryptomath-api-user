import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { users } from './users';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log(`Start seeding user...`);

  await Promise.all(
    users.map(async (user) => {
      const createdUser = await prisma.user.create({
        data: user,
      });

      console.log(`Created user with id: ${createdUser.id}`);
    }),
  );

  console.log(`Seeding user finished.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
