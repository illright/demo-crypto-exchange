import clsx from "clsx";
import plur from "plur";
import { useRef, useContext } from "react";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
import { useOption } from "@react-aria/listbox";
import { Item } from "@react-stately/collections";
import type { ListState } from "@react-stately/list";
import type { Node } from "@react-types/shared";

import type { OrderType } from "~/entities/order";

import { MaxAmountContext } from '../lib/max-amount-context';
import type { OrderBookEntry as OrderBookEntryType } from "../type";

export interface OrderBookEntryProps {
  item: Node<OrderBookEntryType>;
  state: ListState<OrderBookEntryType>;
}

/**
 * Compute the relative size of `value`, taking `maxValue` as a 100%.
 *
 * Doesn't represent the actual percentage for better appearance.
 */
function reasonableScale(value: number, maxValue: number) {
  const minPercentage = 10;
  return `${
    minPercentage + Math.floor((value / maxValue) * (100 - minPercentage))
  }%`;
}

export function OrderBookEntry({ item, state }: OrderBookEntryProps) {
  const ref = useRef<HTMLLIElement>(null);
  const maxAmount = useContext(MaxAmountContext);
  const { optionProps, isSelected } = useOption(
    { key: item.key, "aria-label": item.textValue },
    state,
    ref
  );
  const { focusProps } = useFocusRing();

  const [price, amount, type] = item.rendered as [string, string, OrderType];

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      className={clsx(
        "grid grid-cols-3 justify-items-center items-center",
        "border-t last:border-b border-gray-200",
        isSelected && "bg-teal-100",
        "focus:outline-orange-200"
      )}
    >
      <div
        className={
          clsx(
            "p-3 flex",
            type === "buy"
              ? "col-start-1 bg-orange-200 justify-self-start rounded-r-md"
              : "col-start-3 bg-blue-200 justify-self-end rounded-l-md justify-end"
          )
        }
        style={{
          width: reasonableScale(parseFloat(amount), maxAmount),
        }}
      >
        {amount}
      </div>
      <span className="row-start-1 col-start-2">{price}</span>
    </li>
  );
}

export function renderOrderBookEntry(orderBookEntry: OrderBookEntryType) {
  const formattedPrice = `${
    orderBookEntry.price
  } ${orderBookEntry.currencyFromId.toUpperCase()}`;
  return (
    <Item
      key={orderBookEntry.amount}
      textValue={`${formattedPrice}, ${orderBookEntry.amount} ${
        orderBookEntry.type
      } ${plur("order", parseFloat(orderBookEntry.amount))} placed`}
    >
      {[formattedPrice, orderBookEntry.amount, orderBookEntry.type]}
    </Item>
  );
}
