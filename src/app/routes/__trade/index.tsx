import {
  Form, useLoaderData, useSearchParams,
} from "@remix-run/react";
import { type LoaderFunction, type ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";

import { createOrder, listOrders, type Order } from "~/app/models/order.server";
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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const currencyFromId = url.searchParams.get('from') ?? 'usd';
  const currencyToId = url.searchParams.get('to') ?? 'btc';

  return await listOrders({ currencyFromId, currencyToId });
}

export default function TradeIndex() {
  const [params] = useSearchParams();
  const data = useLoaderData<Pick<Order, 'id' | 'price' | 'amount'>[]>();

  return (
    <>
      <Form method="post" className="flex flex-col p-2 space-y-2">
        <input
          type="hidden"
          name="currencyFromId"
          value={params.get("from") ?? "usd"}
        />
        <input
          type="hidden"
          name="currencyToId"
          value={params.get("to") ?? "btc"}
        />

        <fieldset className="flex flex-col">
          <legend className="mb-1 block">Buy or sell?</legend>
          <label>
            <input type="radio" name="action" value="buy" className="mr-2" />
            Buy
          </label>
          <label>
            <input type="radio" name="action" value="sell" className="mr-2" />
            Sell
          </label>
        </fieldset>
        <div>
          <label htmlFor="amount" className="mr-4">
            How much?
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            required
            className="border border-dark-50"
          />
        </div>
        <div>
          <label htmlFor="price" className="mr-4">
            For what price?
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            required
            className="border border-dark-50"
          />
        </div>
        <button type="submit" className="border border-dark-50 bg-slate-200">Submit</button>
      </Form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
