// import { useLoaderData } from "@remix-run/react";
import { redirect, type LoaderFunction } from "@remix-run/node";

import { selectArbitraryCurrencies } from "~/features/select-currency";
import { isMobileDevice } from "~/shared/lib";

interface SellPageData {
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
    await selectArbitraryCurrencies(url.searchParams);
    return redirect(url.toString());
  }

  return {
    // orderBook: await getOrderBook(what, price),
  } as SellPageData;
};

/**
 * Select the amount of currency to sell and at what price. Examine the order book.
 *
 * This page is solely intended for mobile devices. On tablets and desktops,
 * the `/trade` page offers this functionality.
 */
export default function SellPage() {
  // const { } = useLoaderData<SellPageData>();
  return (
    <div>
      {/* <OrderForm /> */}
      {/* <OrderBook /> */}
    </div>
  );
}
