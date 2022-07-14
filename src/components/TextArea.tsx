import cx from "clsx";
import React, { useRef } from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";
import { useForceUpdate } from "../utils/useForceUpdates";

export type TextAreaProps = ExtendElementProps<
  "textarea",
  {
    className?: string;
    disabled?: boolean;
    error?: boolean;
    size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
    placeholder?: string;
    flat?: boolean;
    warning?: boolean;
    progress?: number;
    value?: string;
    onChange?: (value: string, ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }
>;

export const TextAreaImpl = function TextArea(
  {
    className,
    size = "medium",
    placeholder,
    flat,
    disabled: disabledValue,
    error,
    warning,
    progress,
    onChange,
    ...rest
  }: TextAreaProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const disabled = disabledValue;

  const forceUpdate = useForceUpdate();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const isControlled = typeof rest.value === "string";
  const value = isControlled
    ? rest.value
    : inputRef.current?.value || rest.defaultValue || "";

  const inputClassName =
    cx("Input TextArea", size, {
      flat,
      disabled,
      error,
      warning,
      progress: progress !== undefined,
    }) +
    " " +
    cx(className);

  const onTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) forceUpdate();
    onChange && onChange(ev.target.value, ev);
  };

  const onClickContainer = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target !== inputRef.current && inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={inputClassName} ref={ref} onClick={onClickContainer}>
      <textarea
        placeholder={placeholder}
        disabled={disabled}
        className={cx("Input__area", { empty: !value })}
        ref={inputRef as any}
        onChange={onTextAreaChange}
        {...rest}
      />
    </div>
  );
};

export const TextArea = React.forwardRef<HTMLDivElement, TextAreaProps>(
  TextAreaImpl
);
