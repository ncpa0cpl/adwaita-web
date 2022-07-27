import cx from "clsx";
import React, { useRef } from "react";
import type { AdwaitaIcon } from "../icons";
import { WindowClose } from "../icons";
import type { ExtendElementProps } from "../utils/extendElementProp";

import useControlled from "../utils/useControlled";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

const noop = () => {};

export type InputProps = ExtendElementProps<
  "input",
  {
    /** The HTML input type */
    type?: string;
    value?: string;
    defaultValue?: string;
    className?: string;
    /** Size of the input */
    size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
    /** Shows a loading indicator */
    loading?: boolean;
    /** Icon name or node (left) */
    icon?: AdwaitaIcon;
    /** Icon name or node (right) */
    iconAfter?: AdwaitaIcon;
    placeholder?: string;
    /** Disable the input */
    disabled?: boolean;
    /** Flat style input */
    flat?: boolean;
    /** Error style input */
    error?: boolean;
    /** Warning style input */
    warning?: boolean;
    /**
     * Show a progress bar of `progress` percent size if it's a number, or an
     * undeterminate (loading) bar if `true`
     */
    progress?: boolean | number;
    /** Show a button to clear the input value */
    allowClear?: boolean;
    /** Called when the input value changes, with the new value */
    onChange?: (value: string) => void;
    /** Called when Enter is pressed (prevents default behavior) */
    onAccept?: (value: string) => void;
    /** Called when the `iconAfter` is clicked */
    onClickIconAfter?: () => void;
  }
>;

export const Input = React.forwardRef<HTMLDivElement, InputProps>(function Input(
  {
    type = "text",
    value: valueProp,
    defaultValue,
    className,
    size = "medium",
    loading,
    icon: IconElement,
    iconAfter: IconAfterElement,
    placeholder,
    flat,
    disabled: disabledValue,
    error,
    warning,
    progress,
    children,
    allowClear,
    onAccept,
    onKeyDown,
    onChange = noop,
    onClickIconAfter,
    ...rest
  },
  ref
) {
  const spinner = loading ? <Spinner /> : <></>;
  const disabled = disabledValue || loading;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useControlled(valueProp, defaultValue, onChange);

  const inputClassName =
    cx("Input", size, {
      flat,
      disabled,
      error,
      warning,
      progress: progress !== undefined,
    }) +
    " " +
    cx(className);

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(ev.currentTarget.value);
  };

  const onInputKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.nativeEvent.key === "Enter" && onAccept) {
      onAccept(ev.currentTarget.value);
      ev.preventDefault();
      return;
    }
    if (onKeyDown) {
      onKeyDown(ev);
    }
  };

  const onClickContainer = (
    ev: React.SyntheticEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (ev.target !== inputRef.current && inputRef.current) inputRef.current.focus();
  };

  if (allowClear) {
    if (value) {
      IconAfterElement = WindowClose;
      onClickIconAfter = () => setValue("");
    } else {
      IconAfterElement = undefined;
    }
  }

  return (
    <div className={inputClassName} ref={ref} onClick={onClickContainer}>
      <span className="Input__left">{IconElement ? <IconElement /> : spinner}</span>
      <div className="Input__area">
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={value === "" ? "empty" : undefined}
          ref={inputRef}
          value={value}
          onChange={onInputChange}
          onKeyDown={onAccept ? onInputKeyDown : onKeyDown}
          {...rest}
        />
        {children && <div className="Input__children">{children}</div>}
      </div>
      {progress && (
        <div
          className={cx(
            "Input__progress",
            progress === true ? "indeterminate" : undefined
          )}
        >
          <span
            className="Input__progress__bar"
            style={
              typeof progress === "number" ? { width: `${progress}%` } : undefined
            }
          />
        </div>
      )}
      {IconAfterElement &&
        (onClickIconAfter ? (
          <Button
            className="Input__right"
            flat
            size={size}
            onClick={onClickIconAfter}
          >
            <IconAfterElement />
          </Button>
        ) : (
          <span className="Input__right">
            <IconAfterElement />
          </span>
        ))}
    </div>
  );
});
