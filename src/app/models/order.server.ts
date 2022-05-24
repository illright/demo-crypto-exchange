import type { Order } from "@prisma/client";

import { prisma } from "~/app/db.server";

export type { Order } from "@prisma/client";

export function getOrders({
  currencyFromId,
  currencyToId,
}: Pick<Order, "currencyFromId" | "currencyToId">) {
  return prisma.order.findMany({
    where: { currencyFromId, currencyToId },
    select: { id: true, amount: true, price: true },
  });
}

export function createOrder(order: Omit<Order, 'id'>) {
  return prisma.order.create({ data: order });
}
