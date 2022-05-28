import type { Currency } from "../type";

/** Construct a human-readable name for a currency. */
export function displayName(currency: Currency | undefined) {
  if (currency === undefined) {
    return "Unknown (???)";
  }
  return `${currency.name} (${currency.id.toUpperCase()})`;
}
