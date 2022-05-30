import clsx from "clsx";
import { Tab } from "@headlessui/react";
import type { ReactNode } from "react";

import type { OrderType } from '~/entities/order'

export interface OrderTypeTabsProps {
  children: [ReactNode, ReactNode];
  value: OrderType;
  onChange: (newValue: OrderType) => void;
}

/**
 * Selection of order type: buy or sell.
 *
 * Requires two children (as an array):
 *  - the first is for the "buy" panel
 *  - the second is for the "sell" panel
 */
export function OrderTypeTabs(props: OrderTypeTabsProps) {
  return (
    <Tab.Group
      selectedIndex={props.value === "buy" ? 0 : 1}
      onChange={(index) => props.onChange(index === 0 ? "buy" : "sell")}
    >
      <Tab.List
        className="
          flex space-x-1
          p-1
          rounded-xl
          bg-teal-900/20
        "
      >
        {["Buy", "Sell"].map((tabName) => (
          <Tab
            key={tabName}
            className={({ selected }) =>
              clsx(
                "flex-1",
                "rounded-lg",
                "py-2.5",
                "text-sm font-medium text-teal-700",
                "ring-white/60 ring-offset-2 ring-offset-teal-400",
                "focus:outline-none focus:ring-2",
                selected
                  ? "bg-white shadow"
                  : "text-teal-900 hover:bg-white/[0.12] hover:text-teal-700"
              )
            }
          >
            {tabName}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {props.children.map((child, index) => (
          <Tab.Panel key={index}>{child}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
