import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

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

  await prisma.order.deleteMany({});
  await prisma.order.create({
    // I would like to buy 1337 BTC for no more than 1.337 USD each
    data: {
      type: 'buy',
      currencyToId: 'btc',
      amount: new Decimal(1337),
      currencyFromId: 'usd',
      price: new Decimal(1.337),
    }
  });
  await prisma.order.create({
    // I would like to buy 1 BTC for no more than 1.337 USD each
    data: {
      type: 'buy',
      currencyToId: 'btc',
      amount: new Decimal(1),
      currencyFromId: 'usd',
      price: new Decimal(1.337),
    }
  });
  await prisma.order.create({
    // I would like to sell 100 BTC for no less than 2.337 USD each
    data: {
      type: 'sell',
      currencyToId: 'btc',
      amount: new Decimal(100),
      currencyFromId: 'usd',
      price: new Decimal(2.337),
    }
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
