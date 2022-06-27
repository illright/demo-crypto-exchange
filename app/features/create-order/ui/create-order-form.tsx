import { Form, useSearchParams } from "@remix-run/react";

import type { OrderType } from "~/entities/order";
import { Button } from "~/shared/ui";

export interface CreateOrderFormProps {
  action?: OrderType;
}

export function CreateOrderForm(props: CreateOrderFormProps) {
  const [params] = useSearchParams();

  return (
    <Form reloadDocument method="post" className="flex flex-col p-2 space-y-2">
      <input type="hidden" name="currencyFromId" value={params.get("price")!} />
      <input type="hidden" name="currencyToId" value={params.get("what")!} />
      <input
        type="hidden"
        name="action"
        value={props.action ?? params.get("action") ?? "buy"}
      />
      <div>
        <label htmlFor="amount" className="mr-4">
          How much?
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          min="0"
          required
          className="border border-dark-50"
        />
      </div>
      <div>
        <label htmlFor="price" className="mr-4">
          For what price?
        </label>
        <input
          type="number"
          id="price"
          name="price"
          min="0"
          required
          className="border border-dark-50"
        />
      </div>
      <Button type="submit">Create order</Button>
    </Form>
  );
}
