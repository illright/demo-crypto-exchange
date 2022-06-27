import type { ActionFunction } from "@remix-run/server-runtime";

import { createOrder } from "~/entities/order";
import type { DataFunctionArgsWithSocket } from "~/shared/api";

import { validateOrder } from "./validate-order.server";

export const createOrderAction: ActionFunction = async ({
  request,
  context: io,
}: DataFunctionArgsWithSocket) => {
  const formData = await request.formData();
  const order = await validateOrder(formData);
  await createOrder(order);
  io.emit(`refresh:${order.currencyFromId}:${order.currencyToId}`);
};
