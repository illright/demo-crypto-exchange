import { type OrderType } from "~/entities/order";

/**
 * Adds an arbitrary order type to the current search parameters of a URL.
 *
 * The order type is added to the `action` query parameter and is either "buy" or "sell".
 */
export function selectArbitraryOrderType(currentSearchParams: URLSearchParams) {
  currentSearchParams.set("action", "buy" as OrderType);
}
