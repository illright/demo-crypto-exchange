import { useLoaderData } from "@remix-run/react";
import { redirect, type LoaderFunction } from "@remix-run/node";

import { CurrencyForm } from "~/widgets/currency-form";
import { selectArbitraryCurrencies } from "~/features/select-currency";
import { selectArbitraryOrderType } from "~/features/select-order-type";
import { listCurrencies } from "~/entities/currency";
import { isMobileDevice } from "~/shared/lib";

interface TradePageData {
  currencies: Awaited<ReturnType<typeof listCurrencies>>;
  // priceHistory: Awaited<ReturnType<typeof listPriceHistoryPoints>>;
  // orderBook: Awaited<ReturnType<typeof getOrderBook>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userAgent = request.headers.get("User-Agent");
  if (userAgent !== null && isMobileDevice(userAgent) === true) {
    return redirect("/");
  }

  const url = new URL(request.url);
  let urlChanged = false;

  const what = url.searchParams.get("what");
  const price = url.searchParams.get("price");
  const action = url.searchParams.get("action");

  if (what === null || price === null) {
    urlChanged = true;
    await selectArbitraryCurrencies(url.searchParams);
  }
  if (action === null) {
    urlChanged = true;
    selectArbitraryOrderType(url.searchParams);
  }

  if (urlChanged) {
    return redirect(url.toString());
  } else {
    return {
      currencies: await listCurrencies(),
      // priceHistory: await listPriceHistoryPoints(what),
      // orderBook: await getOrderBook(what, price),
    } as TradePageData;
  }
};

/**
 * Change all parameters of orders, see the order book and market price changes
 * for the desired currency.
 *
 * This page is solely intended for tablets and desktop devices. On mobiles,
 * this functionality is split between the `/`, `/buy` and `/sell` pages.
 */
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
