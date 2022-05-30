import { useEffect, useState, type RefObject } from "react";
import { useSubmit } from "@remix-run/react";

// TODO: decide the threshold
const TWO_COLUMNS_WIDTH = 10240;

/**
 * Tracks a state variable, automatically submitting a given form on changes.
 *
 * Doesn't auto-submit on mobile screens.
 */
export function useStateWithSubmitOnChange<StateType>(
  defaultValue: StateType,
  formElement: RefObject<HTMLFormElement>
) {
  const submit = useSubmit();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (
      formElement.current !== null &&
      window.screen.width >= TWO_COLUMNS_WIDTH
    ) {
      submit(formElement.current, { replace: true });
    }
  }, [value, submit, formElement]);

  return [value, setValue] as const;
}
