import { type RefObject, useEffect, useRef, useState } from "react";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import { CurrencyPicker, type Currency } from "~/entities/currency";

export interface CurrencyPickersProps {
  options: Currency[];
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
    <Form
      method="get"
      ref={formElement}
      reloadDocument
      className="flex flex-col items-start"
    >
      <label htmlFor="input-currency">From</label>
      <CurrencyPicker
        name="from"
        options={props.options}
        value={sourceCurrency}
        onChange={setSourceCurrency}
      />
      <label htmlFor="output-currency">To</label>
      <CurrencyPicker
        name="to"
        id="output-currency"
        options={props.options}
        value={targetCurrency}
        onChange={setTargetCurrency}
      />
      <button type="submit">Submit</button>
    </Form>
  );
}
