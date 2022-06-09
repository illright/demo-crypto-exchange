import type { Order } from "~/entities/order";

export type OrderBookEntry = Omit<Order, 'id' | 'amount' | 'price'> & {
  amount: string;
  price: string;
};
