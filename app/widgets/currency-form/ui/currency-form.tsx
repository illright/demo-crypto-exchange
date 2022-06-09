import { useRef, useState, type ReactNode } from "react";
import { Form, useSearchParams, useTransition } from "@remix-run/react";

import { CurrencyPicker } from "~/features/select-currency";
import { OrderTypeTabs } from "~/features/select-order-type";
import { type Currency } from "~/entities/currency";
import type { OrderType } from "~/entities/order";
import { Button } from "~/shared/ui";

import { useStateWithSubmitOnChange } from "./use-state-with-submit-on-change";

interface CurrencyFormProps {
  options: Currency[];
}

export function CurrencyForm(props: CurrencyFormProps) {
  const formElement = useRef<HTMLFormElement>(null);
  const [params] = useSearchParams();
  const transition = useTransition();

  const [orderType, setOrderType] = useStateWithSubmitOnChange(
    (params.get("action") as OrderType) ?? "buy",
    formElement
  );
  const [sourceCurrency, setSourceCurrency] = useStateWithSubmitOnChange(
    params.get("price") ?? props.options[0].id,
    formElement
  );
  const [targetCurrency, setTargetCurrency] = useStateWithSubmitOnChange(
    params.get("what") ?? props.options[1].id,
    formElement
  );

  return (
    <OrderTypeTabs value={orderType} onChange={setOrderType}>
      {
        ["buy", "sell"].map((orderType) => (
          <Form
            method="get"
            action="/trade"
            ref={formElement}
            className="flex flex-col"
            key={orderType}
          >
            <input type="hidden" name="action" value={orderType} />
            <CurrencyPicker
              name="price"
              label={
                orderType === "buy" ? "Desired currency" : "Owned currency"
              }
              description={
                orderType === "buy"
                  ? "I want to buy this currency..."
                  : "I want to sell this currency..."
              }
              options={props.options}
              disabled={transition.state === "submitting"}
              value={sourceCurrency}
              onChange={setSourceCurrency}
            />
            <CurrencyPicker
              name="what"
              label={
                orderType === "buy" ? "Owned currency" : "Desired currency"
              }
              description={
                orderType === "buy"
                  ? "...by paying with this currency"
                  : "...to get this currency"
              }
              options={props.options}
              disabled={transition.state === "submitting"}
              value={targetCurrency}
              onChange={setTargetCurrency}
            />
            <Button type="submit" className="mt-2">
              {transition.state === "submitting"
                ? "Opening the order page..."
                : "Select"}
            </Button>
          </Form>
        )) as [ReactNode, ReactNode]
      }
    </OrderTypeTabs>
  );
}
