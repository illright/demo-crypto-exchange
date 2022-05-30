import Fuse from "fuse.js";
import { Fragment, useId, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiSelector } from "react-icons/hi";

import { displayName } from "./currency-display-name";
import { CurrencyPickerOption } from "./currency-picker-option";
import type { Currency } from "../type";

export interface CurrencyPickerProps {
  name?: string;
  label: string;
  description: string;
  options: Currency[];
  disabled?: boolean;
  value: Currency["id"];
  onChange: (newCurrencyID: Currency["id"]) => void;
}

function EmptyState() {
  return (
    <div className="select-none py-2 px-4 text-gray-700">
      No such currency found.
    </div>
  );
}

/** Picker for currencies with fuzzy search on names and IDs. */
export function CurrencyPicker(props: CurrencyPickerProps) {
  const [query, setQuery] = useState("");
  const id = useId();
  const descriptionId = `${id}-description`;
  const fusedOptions = useMemo(
    () => new Fuse(props.options, { keys: ["id", "name"] }),
    [props.options]
  );

  const filteredOptions =
    query === ""
      ? props.options
      : fusedOptions.search(query).map((result) => result.item);

  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      disabled={props.disabled ?? false}
    >
      <div className="flex justify-between items-baseline px-3 py-1">
        <Combobox.Label className="font-medium mt-3">
          {props.label}
        </Combobox.Label>
        <span id={descriptionId} className="text-sm text-gray-500 italic">
          {props.description}
        </span>
      </div>
      <div className="relative min-w-52">
        <div
          className="
            flex
            overflow-hidden rounded-lg
            border border-gray-200
            bg-white
            focus-within:ring-2 focus-within:ring-teal-300
            sm:text-sm
          "
        >
          <Combobox.Input
            aria-describedby={descriptionId}
            className="flex-1 border-none py-2 px-3 text-gray-900 focus:outline-none"
            displayValue={(id) =>
              displayName(props.options.find((option) => option.id === id))
            }
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button
            aria-describedby={descriptionId}
            className="flex items-center px-2"
          >
            <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className="
              absolute w-full mt-1 max-h-60 z-10
              py-1 rounded-md
              bg-white shadow-lg
              border border-black border-opacity-5
              sm:text-sm
            "
          >
            {filteredOptions.length === 0 && query !== "" ? (
              <EmptyState />
            ) : (
              filteredOptions.map((option) => (
                <CurrencyPickerOption key={option.id} value={option} />
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
