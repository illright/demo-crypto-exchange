import invariant from "tiny-invariant";
import { redirect } from "@remix-run/node";

import { listCurrencies } from "~/entities/currency";

/**
 * Adds an arbitrary pair of currencies to the current URL and redirects.
 *
 * The currencies are added to the `what` and `price` query parameters.
 */
export async function selectArbitraryCurrencies(currentUrl: URL) {
  const [what, price] = await listCurrencies(2);
  invariant(
    what === undefined || price === undefined,
    "There are not enough currencies in the database :/"
  );

  if (!currentUrl.searchParams.has("what")) {
    currentUrl.searchParams.set("what", what.id);
  }
  if (!currentUrl.searchParams.has("price")) {
    currentUrl.searchParams.set("price", price.id);
  }
  if (addAction && !currentUrl.searchParams.has("action")) {
    currentUrl.searchParams.set("action", "buy");
  }

  return redirect(currentUrl.toString());
}
