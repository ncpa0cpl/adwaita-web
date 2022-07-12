import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type FrameProps = ExtendElementProps<
  "div",
  {
    className?: string;
    /** The label of the frame (using <fieldset>/<legend>) */
    label?: React.ReactNode;
    /** The background color */
    background?: "low" | "default" | "medium" | "high";
    /** If true, is displayed as an inline element */
    inline?: boolean;
    /** If true, is scrollable */
    scrollable?: boolean;
    /** If true, shows a border */
    border?: boolean;
    padded?: boolean;
  }
>;

const defaultProps = {
  border: true,
};

export function Frame({
  children,
  className,
  inline,
  background,
  scrollable,
  border,
  label,
  padded,
  ...rest
}: FrameProps) {
  const Component = label ? "fieldset" : "div";
  return (
    // @ts-ignore
    <Component
      className={cx(
        "Frame",
        className,
        background ? `background-${background}` : undefined,
        {
          inline,
          padded,
          scrollable,
          "no-border": !border,
        }
      )}
      role={Component === "fieldset" ? "presentation" : undefined}
      {...rest}
    >
      {label && <legend>{label}</legend>}
      {children}
    </Component>
  );
}

Frame.defaultProps = defaultProps;
