// import { useLoaderData } from "@remix-run/react";
import { type LoaderFunction } from "@remix-run/node";

import { selectArbitraryCurrencies } from "~/features/select-currency";

interface SellPageData {
  // orderBook: Awaited<ReturnType<typeof getOrderBook>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const what = url.searchParams.get("what");
  const price = url.searchParams.get("price");
  if (what === null || price === null) {
    return selectArbitraryCurrencies(url);
  }

  return {
    // orderBook: await getOrderBook(what, price),
  } as SellPageData;
};

export default function SellPage() {
  // const { } = useLoaderData<SellPageData>();
  return (
    <div>
      {/* <OrderForm /> */}
      {/* <OrderBook /> */}
    </div>
  );
}
