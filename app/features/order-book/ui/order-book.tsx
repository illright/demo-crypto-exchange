import { useRef } from "react";
import { type AriaListBoxOptions, useListBox } from "@react-aria/listbox";
import { useListState } from "@react-stately/list";

import { OrderBookEntry, renderOrderBookEntry } from "./order-book-entry";
import { MaxAmountContext } from '../lib/max-amount-context';
import type { OrderBookEntry as OrderBookEntryType } from "../type";

interface OrderBookProps {
  items: OrderBookEntryType[];
  onPriceSelect?: (price: any) => void;
}

export function OrderBook(props: OrderBookProps) {
  const listBoxOptions: AriaListBoxOptions<OrderBookEntryType> = {
    label: "Order book",
    isVirtualized: true,
  };

  const state = useListState({
    children: renderOrderBookEntry,
    items: props.items,
    selectionMode: "single",
    onSelectionChange([selectedOption]) {
      props.onPriceSelect?.(selectedOption);
    },
  });

  const listRef = useRef<HTMLUListElement>(null);
  const { listBoxProps, labelProps } = useListBox(
    listBoxOptions,
    state,
    listRef
  );

  return (
    <>
      <div className="font-semibold mb-1 mt-2 px-3" {...labelProps}>
        {listBoxOptions.label}
      </div>
      <ul ref={listRef} {...listBoxProps}>
        <MaxAmountContext.Provider
          value={Math.max(
            ...props.items.map((entry) => parseFloat(entry.amount))
          )}
        >
          {[...state.collection].map((item) => (
            <OrderBookEntry key={item.key} item={item} state={state} />
          ))}
        </MaxAmountContext.Provider>
      </ul>
    </>
  );
}
