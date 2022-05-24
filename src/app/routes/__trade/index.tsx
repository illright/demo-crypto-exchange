import {
  Form, useSearchParams,
} from "@remix-run/react";
import { type ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";

import { createOrder } from "~/app/models/order.server";
import { listCurrencies } from "~/app/models/currency.server";
import { Decimal } from "@prisma/client/runtime";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const currencies = await listCurrencies();

  const rawAmount = formData.get('amount');
  invariant(typeof rawAmount === 'string', 'Trade amount has to be a string');
  const amount = new Decimal(rawAmount);
  invariant(!amount.isNaN(), "The amount has to be a decimal number");
  invariant(amount.gt(0), "The amount has to be positive");

  const rawPrice = formData.get('price');
  invariant(typeof rawPrice === "string", "Trade price has to be a string");
  const price = new Decimal(rawPrice);
  invariant(!price.isNaN(), "The price has to be a decimal number");
  invariant(price.gt(0), "The price has to be positive");

  const currencyFromId = formData.get("currencyFromId");
  invariant(
    typeof currencyFromId === "string",
    "Source currency ID has to be a string"
  );
  invariant(
    currencies.some((currency) => currency.id === currencyFromId),
    "Source currency ID should be valid"
  );

  const currencyToId = formData.get("currencyToId");
  invariant(
    typeof currencyToId === "string",
    "Target currency ID has to be a string"
  );
  invariant(
    currencies.some((currency) => currency.id === currencyToId),
    "Target currency ID should be valid"
  );

  await createOrder({
    amount,
    price,
    currencyFromId,
    currencyToId,
  });
  return null;
}

export default function TradeIndex() {
  const [params] = useSearchParams();

  return (
    <Form method="post">
      <input type="hidden" name="currencyFromId" value={params.get('from') ?? 'usd'} />
      <input type="hidden" name="currencyToId" value={params.get('to') ?? 'btc'} />

      <label htmlFor="amount">How much?</label>
      <input type="number" id="amount" name="amount" min="0" />
      <label htmlFor="price">For what price?</label>
      <input type="number" id="price" name="price" min="0" />
      <button type="submit">Submit</button>
    </Form>
  );
}
