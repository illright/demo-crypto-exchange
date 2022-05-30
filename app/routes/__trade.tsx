import { Outlet, useLoaderData } from "@remix-run/react";
import { type LoaderFunction } from "@remix-run/node";

import { CurrencyForm } from "~/widgets/currency-form";
import { listCurrencies, type Currency } from "~/entities/currency";

export const loader: LoaderFunction = async () => {
  return await listCurrencies();
};

export default function TradePage() {
  const currencies = useLoaderData<Currency[]>();

  return (
    <>
      <div className="p-2">
        <CurrencyForm options={currencies} />
      </div>
      <Outlet />
    </>
  );
}
