import cx from "clsx";
import React, { useState } from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";
import { Icon } from "./Icon";

const noop = () => {};

const asNumber = (value: number | string) => {
  if (value === "") return 0;
  return Number(value);
};

export type InputNumberProps = ExtendElementProps<
  "input",
  {
    className?: string;
    size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
    vertical?: boolean;
    disabled?: boolean;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    step?: number;
    min?: number;
    max?: number;
  }
>;

export function InputNumber({
  className,
  size,
  vertical,
  disabled,
  value: valueProp,
  defaultValue,
  onChange,
  ...rest
}: InputNumberProps) {
  const [valueState, setValueState] = useState(defaultValue ?? "");
  const value = valueProp ?? valueState;
  const step = rest.step ?? 1;
  const min = rest.min ?? -Infinity;
  const max = rest.max ?? +Infinity;
  const setValue =
    valueProp !== undefined ? onChange ?? setValueState : setValueState;

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(ev.target.value));
  };

  const onUp = () => setValue(asNumber(value) + step);
  const onDown = () => setValue(asNumber(value) - step);

  const downDisabled = disabled || asNumber(value) - step < min;
  const upDisabled = disabled || asNumber(value) + step > max;

  const buttonClassNames = vertical ? "Button image-button" : undefined;

  return (
    <div className={cx("InputNumber", className, size, { disabled, vertical })}>
      <div className="Input__area">
        <input
          type="number"
          disabled={disabled}
          value={value}
          onChange={onInputChange}
          {...rest}
        />
      </div>
      <button
        tabIndex={-1}
        className={cx("InputNumber__button down", buttonClassNames)}
        disabled={downDisabled}
        onClick={onDown}
      >
        <Icon name="list-remove" />
      </button>
      <button
        tabIndex={-1}
        className={cx("InputNumber__button up", buttonClassNames)}
        disabled={upDisabled}
        onClick={onUp}
      >
        <Icon name="list-add" />
      </button>
    </div>
  );
}

InputNumber.defaultProps = {
  size: "medium",
  onChange: noop,
};
