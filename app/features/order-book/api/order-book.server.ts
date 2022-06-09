import type { Order } from "@prisma/client";

import { prisma } from "~/db.server";
import type { OrderBookEntry } from "../type";

/**
 * Generate an order book for a pair of currencies.
 *
 * An order book is a sum of all buy/sell orders, grouped by price.
 */
export async function getOrderBook({
  currencyFromId,
  currencyToId,
}: Pick<Order, "currencyFromId" | "currencyToId">) {
  const orderBookRaw = await prisma.order.groupBy({
    by: ["currencyFromId", "currencyToId", "type", "price"],
    where: { currencyFromId, currencyToId },
    _sum: {
      amount: true,
    },
    orderBy: {
      price: "desc",
    },
  });

  return orderBookRaw.map(rawEntry => ({
    amount: (rawEntry._sum.amount ?? Number(0)).toString(),
    type: rawEntry.type,
    price: rawEntry.price.toString(),
    currencyFromId: rawEntry.currencyFromId,
    currencyToId: rawEntry.currencyToId,
  } as OrderBookEntry))
}
