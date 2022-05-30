import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export function Button({ children, className, type, ...restProps }: ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type={type ?? "button"}
      className={clsx(
        "inline-flex justify-center",
        "rounded-md",
        "border border-transparent",
        "bg-teal-100 hover:bg-teal-200",
        "px-4 py-2",
        "text-sm font-medium text-teal-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}
