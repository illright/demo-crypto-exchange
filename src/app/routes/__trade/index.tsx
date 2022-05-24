import { useEffect, useState } from "react";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { type LoaderFunction, type ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { Server } from "socket.io";
import { Decimal } from "@prisma/client/runtime";

import { createOrder, listOrders, type Order } from "~/app/models/order.server";
import { listCurrencies } from "~/app/models/currency.server";
import { useSocket } from "~/app/socket-context";

export const action: ActionFunction = async ({ request, context: io }) => {
  const formData = await request.formData();
  const currencies = await listCurrencies();

  const rawAmount = formData.get("amount");
  invariant(typeof rawAmount === "string", "Trade amount has to be a string");
  const amount = new Decimal(rawAmount);
  invariant(!amount.isNaN(), "The amount has to be a decimal number");
  invariant(amount.gt(0), "The amount has to be positive");

  const rawPrice = formData.get("price");
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

  const action = formData.get("action");
  invariant(
    action === "buy" || action === "sell",
    "Action should be either 'buy' or 'sell'"
  );

  await createOrder({
    amount,
    price,
    currencyFromId,
    currencyToId,
    type: action,
  });

  (io as Server).emit(
    `refresh:${currencyFromId}:${currencyToId}`,
    await listOrders({ currencyFromId, currencyToId })
  );
  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const currencyFromId = url.searchParams.get("from") ?? "usd";
  const currencyToId = url.searchParams.get("to") ?? "btc";

  return await listOrders({ currencyFromId, currencyToId });
};

interface OrderBookProps {
  currencyFromId: string;
  currencyToId: string;
  data: OrderSelected[];
}

type OrderSelected = Pick<Order, "id" | "price" | "amount">;

function OrderBook({ currencyFromId, currencyToId, data }: OrderBookProps) {
  const socket = useSocket();
  const [orders, setOrders] = useState<OrderSelected[]>(data);

  useEffect(() => {
    if (!socket) return;

    socket.on(`refresh:${currencyFromId}:${currencyToId}`, (data) => {
      setOrders(data);
    });
  }, [socket, currencyFromId, currencyToId]);

  return <pre>{JSON.stringify(orders, null, 2)}</pre>;
}

export default function TradeIndex() {
  const [params] = useSearchParams();
  const data = useLoaderData<OrderSelected[]>()

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
        <button type="submit" className="border border-dark-50 bg-slate-200">
          Submit
        </button>
      </Form>
      <OrderBook
        data={data}
        currencyFromId={params.get("from") ?? "usd"}
        currencyToId={params.get("to") ?? "btc"}
      />
    </>
  );
}
