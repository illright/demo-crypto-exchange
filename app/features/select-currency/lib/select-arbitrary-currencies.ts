import invariant from "tiny-invariant";

import { listCurrencies } from "~/entities/currency";

/**
 * Adds an arbitrary pair of currencies to the current search parameters of a URL.
 *
 * The currencies are added to the `what` and `price` query parameters.
 */
export async function selectArbitraryCurrencies(currentSearchParams: URLSearchParams) {
  const [what, price] = await listCurrencies(2);
  invariant(
    what !== undefined && price !== undefined,
    "There are not enough currencies in the database :/"
  );

  if (!currentSearchParams.has("what")) {
    currentSearchParams.set("what", what.id);
  }
  if (!currentSearchParams.has("price")) {
    currentSearchParams.set("price", price.id);
  }
}
