import { useLoaderData } from "@remix-run/react";
import { redirect, type LoaderFunction } from "@remix-run/node";

import { CurrencyForm } from "~/widgets/currency-form";
import { selectArbitraryCurrencies } from "~/features/select-currency";
import { selectArbitraryOrderType } from "~/features/select-order-type";
import { listCurrencies } from "~/entities/currency";
import { isMobileDevice } from '~/shared/lib';

interface TradePageData {
  currencies: Awaited<ReturnType<typeof listCurrencies>>;
  // priceHistory: Awaited<ReturnType<typeof listPriceHistoryPoints>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userAgent = request.headers.get("User-Agent");
  if (userAgent !== null && isMobileDevice(userAgent) === false) {
    return redirect("/trade");
  }

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
  } as TradePageData;
};

/**
 * Select whether you want to buy or sell, pick a pair of currencies.
 * See the market price changes for the desired currency.
 *
 * This page is solely intended for mobile devices. On tablets and desktops,
 * the `/trade` page offers this functionality.
 */
export default function CurrencySelectionPage() {
  const { currencies } = useLoaderData<TradePageData>();

  return (
    <div>
      <CurrencyForm options={currencies} />
      {/* <PriceGraph /> */}
    </div>
  );
}
