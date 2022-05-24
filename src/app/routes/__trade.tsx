import { Form, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export interface Currency {
  id: string;
  name: string;
}

export const loader: LoaderFunction = async () => {
  return json<Currency[]>([
    { id: "usd", name: "US Dollar (USD)" },
    { id: "btc", name: "Bitcoin (BTC)" },
  ]);
};

export default function TradePage() {
  const currencies = useLoaderData<Currency[]>();
  return (
    <>
      <Form>
        <label htmlFor="input-currency">Which currency would you like to trade?</label>
        <select id="input-currency">
          {currencies.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <label htmlFor="output-currency">Which currency would you like to receive?</label>
        <select id="output-currency">
          {currencies.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </Form>
      <Outlet />
    </>
  );
}
