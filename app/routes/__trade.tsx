import { useState } from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import { type LoaderFunction } from "@remix-run/node";

import { CurrencyPickers } from "~/features/select-currencies";
import { OrderTypeTabs } from "~/features/select-order-type";
import { listCurrencies, type Currency } from "~/entities/currency";
import type { OrderType } from "~/entities/order";

export const loader: LoaderFunction = async () => {
  return await listCurrencies();
};

export default function TradePage() {
  const currencies = useLoaderData<Currency[]>();
  const [orderType, setOrderType] = useState<OrderType>("buy");

  return (
    <>
      <div className="p-2">
        <OrderTypeTabs value={orderType} onChange={setOrderType}>
          {[
            <CurrencyPickers key="buy" orderType="buy" options={currencies} />,
            <CurrencyPickers key="sell" orderType="sell" options={currencies} />,
          ]}
        </OrderTypeTabs>
      </div>
      <Outlet />
    </>
  );
}
