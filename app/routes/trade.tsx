import { useLoaderData } from "@remix-run/react";
import { type LoaderFunction } from "@remix-run/node";

import { CurrencyForm } from "~/widgets/currency-form";
import { selectArbitraryCurrencies } from "~/features/select-currency";
import { selectArbitraryOrderType } from "~/features/select-order-type";
import { listCurrencies } from "~/entities/currency";

interface TradePageData {
  currencies: Awaited<ReturnType<typeof listCurrencies>>;
  // priceHistory: Awaited<ReturnType<typeof listPriceHistoryPoints>>;
  // orderBook: Awaited<ReturnType<typeof getOrderBook>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const what = url.searchParams.get("what");
  const price = url.searchParams.get("price");
  const action = url.searchParams.get("action");

  if (what === null || price === null) {
    return selectArbitraryCurrencies(url);
  } else if (action === null) {
    return selectArbitraryOrderType(url);
  }

  return {
    currencies: await listCurrencies(),
    // priceHistory: await listPriceHistoryPoints(what),
    // orderBook: await getOrderBook(what, price),
  } as TradePageData;
};

export default function TradePage() {
  const { currencies } = useLoaderData<TradePageData>();

  return (
    <div>
      <CurrencyForm options={currencies} />
      {/* <PriceGraph /> */}
      {/* <OrderForm /> */}
      {/* <OrderBook /> */}
    </div>
  );
}
