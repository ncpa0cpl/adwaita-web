import React from "react";

export default function useControlled<T = undefined>(
  propValue: T | undefined,
  defaultValue: T | undefined,
  setValueProp?: (value: T) => void
) {
  const [valueState, setValueState] = React.useState(propValue || defaultValue);

  const setValue = React.useCallback((newValue: T) => {
    if (setValueProp) setValueProp(newValue);
    else setValueState(newValue);
  }, []);

  if (propValue !== undefined && propValue !== valueState) {
    setValueState(propValue);
  }

  return [valueState, setValue] as const;
}
