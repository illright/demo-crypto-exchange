import { type RefObject, useEffect, useRef, useState } from "react";
import {
  Form,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";

import { CurrencyPicker, type Currency } from "~/entities/currency";
import type { OrderType } from "~/entities/order";
import { Button } from "~/shared/ui";

export interface CurrencyPickersProps {
  options: Currency[];
  orderType: OrderType;
}

function useStateWithSubmitOnChange(
  defaultValue: string,
  formElement: RefObject<HTMLFormElement>
) {
  const submit = useSubmit();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (formElement.current !== null) {
      submit(formElement.current, { replace: true });
    }
  }, [value, submit, formElement]);

  return [value, setValue] as const;
}

/**
 * A pair of pickers to select the source and target currencies.
 *
 * Persists the state in the URL parameters and auto-submits on change.
 */
export function CurrencyPickers(props: CurrencyPickersProps) {
  const formElement = useRef<HTMLFormElement>(null);
  const transition = useTransition();

  const [params] = useSearchParams();
  const [sourceCurrency, setSourceCurrency] = useStateWithSubmitOnChange(
    params.get("from") ?? props.options[0].id,
    formElement
  );
  const [targetCurrency, setTargetCurrency] = useStateWithSubmitOnChange(
    params.get("to") ?? props.options[1].id,
    formElement
  );

  return (
    <Form method="get" ref={formElement} className="flex flex-col">
      <input type="hidden" name="action" value={props.orderType} />
      <CurrencyPicker
        name="from"
        label={
          props.orderType === "buy" ? "Desired currency" : "Owned currency"
        }
        description={
          props.orderType === "buy"
            ? "I want to buy this currency..."
            : "I want to sell this currency..."
        }
        options={props.options}
        disabled={transition.state === "submitting"}
        value={sourceCurrency}
        onChange={setSourceCurrency}
      />
      <CurrencyPicker
        name="to"
        label={
          props.orderType === "buy" ? "Owned currency" : "Desired currency"
        }
        description={
          props.orderType === "buy"
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
  );
}
