import { redirect } from "@remix-run/node";

import { type OrderType } from "~/entities/order";

/**
 * Adds an arbitrary order type to the current URL and redirects.
 *
 * The order type are added to the `action` query parameter and is either "buy" or "sell".
 */
export async function selectArbitraryOrderType(currentUrl: URL) {
  if (!currentUrl.searchParams.has("action")) {
    currentUrl.searchParams.set("action", "buy" as OrderType);
  }

  return redirect(currentUrl.toString());
}
