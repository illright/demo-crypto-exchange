import invariant from "tiny-invariant";
import { Decimal } from "@prisma/client/runtime";

import type { Order } from "~/entities/order";
import { listCurrencies } from "~/entities/currency";

export async function validateOrder(
  formData: FormData
): Promise<Omit<Order, "id">> {
  const rawAmount = formData.get("amount");
  const rawPrice = formData.get("price");
  const currencyFromId = formData.get("currencyFromId");
  const currencyToId = formData.get("currencyToId");
  const action = formData.get("action");

  const currencies = await listCurrencies();

  invariant(typeof rawAmount === "string", "Trade amount has to be a string");
  const amount = new Decimal(rawAmount);
  invariant(!amount.isNaN(), "The amount has to be a decimal number");
  invariant(amount.gt(0), "The amount has to be positive");

  invariant(typeof rawPrice === "string", "Trade price has to be a string");
  const price = new Decimal(rawPrice);
  invariant(!price.isNaN(), "The price has to be a decimal number");
  invariant(price.gt(0), "The price has to be positive");

  invariant(
    typeof currencyFromId === "string",
    "Source currency ID has to be a string"
  );
  invariant(
    currencies.some((currency) => currency.id === currencyFromId),
    "Source currency ID should be valid"
  );

  invariant(
    typeof currencyToId === "string",
    "Target currency ID has to be a string"
  );
  invariant(
    currencies.some((currency) => currency.id === currencyToId),
    "Target currency ID should be valid"
  );

  invariant(
    action === "buy" || action === "sell",
    "Action should be either 'buy' or 'sell'"
  );

  return {
    price,
    amount,
    currencyFromId,
    currencyToId,
    type: action,
  };
}
