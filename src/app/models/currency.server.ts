import { prisma } from "~/app/db.server";

export type { Currency } from "@prisma/client";

export function listCurrencies() {
  return prisma.currency.findMany();
}
