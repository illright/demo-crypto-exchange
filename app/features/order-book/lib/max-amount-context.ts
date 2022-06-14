import { createContext } from "react";

/** The context for all order book entries to measure themselves against the maximum. */
export const MaxAmountContext = createContext(NaN);
