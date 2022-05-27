import { prisma } from "~/db.server";

export function listCurrencies(limit?: number) {
  return prisma.currency.findMany({ take: limit });
}
