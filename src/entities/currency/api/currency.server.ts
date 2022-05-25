import { prisma } from "~/app/db.server";

export function listCurrencies() {
  return prisma.currency.findMany();
}
