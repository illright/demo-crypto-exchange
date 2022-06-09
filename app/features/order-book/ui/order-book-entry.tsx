import clsx from "clsx";
import plur from "plur";
import { useRef } from "react";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
import { useOption } from "@react-aria/listbox";
import { Item } from "@react-stately/collections";
import type { ListState } from "@react-stately/list";
import type { Node } from "@react-types/shared";

import type { OrderType } from "~/entities/order";

import type { OrderBookEntry as OrderBookEntryType } from "../type";

export interface OrderBookEntryProps {
  item: Node<OrderBookEntryType>;
  state: ListState<OrderBookEntryType>;
}

export function OrderBookEntry({ item, state }: OrderBookEntryProps) {
  let ref = useRef<HTMLLIElement>(null);
  let { optionProps, isSelected } = useOption(
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
        "grid grid-cols-3 justify-items-center",
        "py-2 px-3",
        "border-t last:border-b border-gray-200",
        isSelected && "bg-teal-100",
        "focus:outline-orange-200"
      )}
    >
      <span className={type === 'buy' ? "col-start-1" : "col-start-3"}>{amount}</span>
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
