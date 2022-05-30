import clsx from "clsx";
import { Combobox } from "@headlessui/react";
import { HiCheck } from "react-icons/hi";

import { currencyDisplayName, type Currency } from "~/entities/currency";

/** Query the Iconify API for the icons from the Cryptocurrency pack. */
function iconForCurrency(currencyID: string) {
  return `https://api.iconify.design/cryptocurrency:${currencyID}.svg?color=%23111827`;
}

/** The option in the combobox of currencies. */
export function CurrencyPickerOption({ value }: { value: Currency }) {
  return (
    <Combobox.Option
      className={({ active }) =>
        clsx(
          "grid grid-cols-currency-picker items-center gap-2",
          "cursor-default select-none",
          "py-2 px-4",
          "text-gray-900",
          active && "bg-teal-600 bg-opacity-20"
        )
      }
      value={value.id}
    >
      {({ selected, active }) => (
        <>
          {selected ? (
            <span
              className={clsx(
                "flex items-center col-start-1",
                active && "text-teal-600"
              )}
            >
              <HiCheck className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
          <span
            className={clsx(
              "col-start-2 block truncate",
              selected ? "font-medium" : "font-normal"
            )}
          >
            {currencyDisplayName(value)}
          </span>
          <img className="col-start-3" src={iconForCurrency(value.id)} alt="" />
        </>
      )}
    </Combobox.Option>
  );
}
