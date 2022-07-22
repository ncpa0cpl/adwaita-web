import React from "react";
import useControlled from "../utils/useControlled";
import { Box } from "./Box";
import { Radio } from "./Radio";

export type RadioGroupProps = {
  name?: string;
  className?: string;
  size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
  options: Array<{
    value: string;
    label: string;
    data?: any;
  }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  horizontal?: boolean;
  compact?: boolean;
};

export function RadioGroup({
  size,
  compact = false,
  horizontal = true,
  value: valueProp,
  defaultValue,
  onChange,
  name,
  options,
}: RadioGroupProps) {
  const isControlled = valueProp !== undefined;
  const [value, setValue] = useControlled(valueProp, defaultValue, onChange);
  return (
    <Box horizontal={horizontal} vertical={!horizontal} compact={compact}>
      {options.map((o) => (
        <Radio
          key={o.value}
          size={size}
          name={name}
          value={o.value}
          checked={value === o.value}
          defaultChecked={defaultValue === o.value}
          label={o.label}
          onChange={(checked) => {
            if (checked) setValue(o.value);
            if (!isControlled && onChange) onChange(o.value);
          }}
        />
      ))}
    </Box>
  );
}
