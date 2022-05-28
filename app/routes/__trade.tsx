import { Outlet, useLoaderData } from "@remix-run/react";
import { type LoaderFunction } from "@remix-run/node";

import { CurrencyPickers } from "~/features/select-currencies";
import { listCurrencies, type Currency } from "~/entities/currency";

export const loader: LoaderFunction = async () => {
  return await listCurrencies();
};

export default function TradePage() {
  const currencies = useLoaderData<Currency[]>();

  return (
    <>
      <CurrencyPickers options={currencies} />
      <Outlet />
    </>
  );
}
