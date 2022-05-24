import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.currency.deleteMany({});
  await prisma.currency.create({
    data: {
      id: 'usd',
      name: 'US Dollar'
    },
  });
  await prisma.currency.create({
    data: {
      id: 'btc',
      name: 'Bitcoin'
    },
  });
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
