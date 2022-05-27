import type { Order } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

import { prisma } from "~/db.server";

export function listOrders({
  currencyFromId,
  currencyToId,
}: Pick<Order, "currencyFromId" | "currencyToId">) {
  return prisma.order.findMany({
    where: { currencyFromId, currencyToId },
    select: { id: true, amount: true, price: true },
  });
}

export async function createOrder(order: Omit<Order, "id">) {
  const oppositeType = order.type === "buy" ? "sell" : "buy";
  const orders = await prisma.order.findMany({
    where: {
      currencyFromId: order.currencyFromId,
      currencyToId: order.currencyToId,
      type: oppositeType,
      price: { lte: order.price },
    },
    select: { id: true, amount: true },
    orderBy: { price: "asc" },
  });

  let left = order.amount.toNumber();
  for (const otherOrder of orders) {
    if (left >= otherOrder.amount.toNumber()) {
      left -= otherOrder.amount.toNumber();
      await prisma.order.delete({ where: { id: otherOrder.id } });
    } else {
      await prisma.order.update({
        where: { id: otherOrder.id },
        data: { amount: otherOrder.amount.sub(left) },
      });
      left = 0;
      break;
    }
  }

  if (left !== 0) {
    order.amount = new Decimal(left);
    return prisma.order.create({ data: order });
  }
}
