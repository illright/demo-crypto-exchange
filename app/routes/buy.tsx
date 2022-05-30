// import { useLoaderData } from "@remix-run/react";
import { redirect, type LoaderFunction } from "@remix-run/node";

import { selectArbitraryCurrencies } from "~/features/select-currency";
import { isMobileDevice } from "~/shared/lib";

interface BuyPageData {
  // orderBook: Awaited<ReturnType<typeof getOrderBook>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userAgent = request.headers.get("User-Agent");
  if (userAgent !== null && isMobileDevice(userAgent) === false) {
    return redirect("/trade");
  }

  const url = new URL(request.url);

  const what = url.searchParams.get("what");
  const price = url.searchParams.get("price");
  if (what === null || price === null) {
    return selectArbitraryCurrencies(url);
  }

  return {
    // orderBook: await getOrderBook(what, price),
  } as BuyPageData;
};

/**
 * Select the amount of currency to buy and at what price. Examine the order book.
 *
 * This page is solely intended for mobile devices. On tablets and desktops,
 * the `/trade` page offers this functionality.
 */
export default function BuyPage() {
  // const { } = useLoaderData<BuyPageData>();
  return (
    <div>
      {/* <OrderForm /> */}
      {/* <OrderBook /> */}
    </div>
  );
}
