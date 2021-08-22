import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { users } from './data/users';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
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
