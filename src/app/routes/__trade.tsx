import { type FormEvent } from "react";
import {
  Form,
  Outlet,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { type LoaderFunction, json } from "@remix-run/node";

export interface Currency {
  id: string;
  name: string;
}

export const loader: LoaderFunction = async () => {
  return json<Currency[]>([
    { id: "usd", name: "US Dollar (USD)" },
    { id: "btc", name: "Bitcoin (BTC)" },
  ]);
};

export default function TradePage() {
  const submit = useSubmit();

  function handleChange(event: FormEvent) {
    submit(event.currentTarget as HTMLFormElement, { replace: true });
  }

  const currencies = useLoaderData<Currency[]>();
  const [params] = useSearchParams();

  return (
    <>
      <Form method="get" onChange={handleChange}>
        <label htmlFor="input-currency">
          Which currency would you like to trade?
        </label>
        <select
          name="from"
          id="input-currency"
          defaultValue={params.get("from") ?? currencies[0].id}
        >
          {currencies.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <label htmlFor="output-currency">
          Which currency would you like to receive?
        </label>
        <select
          name="to"
          id="output-currency"
          defaultValue={params.get("to") ?? currencies[0].id}
        >
          {currencies.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </Form>
      <Outlet />
    </>
  );
}
