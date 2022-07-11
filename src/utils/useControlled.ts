import React from "react";

export default function useControlled<T = undefined>(
  controlled: T | undefined,
  defaultProp: T | undefined,
  setValueProp?: (value: T) => void
) {
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValueState] = React.useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  if (isControlled && typeof setValueProp !== "function")
    throw new Error(
      "useControlled: setValue function required for controlled components"
    );

  const setValue = React.useCallback((newValue: T) => {
    if (isControlled && setValueProp) setValueProp(newValue);
    else setValueState(newValue);
  }, []);

  return [value, setValue] as const;
}
