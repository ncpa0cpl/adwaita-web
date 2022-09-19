import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type LabelProps = ExtendElementProps<
  "label",
  {
    size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
    align?: "left" | "center" | "right";
    fill?: boolean | "width" | "height";
    ellipsis?: boolean;
    title?: string;
    disabled?: boolean;
    muted?: boolean;
    info?: boolean;
    success?: boolean;
    warning?: boolean;
    danger?: boolean;
    italic?: boolean;
    bold?: boolean;
    noSelect?: boolean;
    /**
     * Makes this component grow to fill the available space, requires the container
     * to be a flexbox to work.
     */
    grow?: boolean | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 999;
  }
>;

export function Label({
  children,
  className,
  size = "medium",
  align,
  fill,
  ellipsis,
  title,
  disabled,
  muted,
  info,
  success,
  warning,
  danger,
  italic,
  bold,
  noSelect,
  grow,
  ...rest
}: LabelProps) {
  const as = rest.htmlFor ? "label" : "span";
  return React.createElement(
    as,
    {
      className:
        cx(
          "Label",
          size,
          align ? `align-${align}` : undefined,
          typeof fill === "string" ? `fill-${fill}` : fill ? "fill" : undefined,
          typeof grow === "number" ? `grow-${grow}` : grow ? "grow" : undefined,
          {
            ellipsis,
            title,
            disabled,
            info,
            success,
            warning,
            danger,
            "text-muted": muted,
            "text-italic": italic,
            "text-bold": bold,
            "user-select-none": noSelect,
          }
        ) +
        " " +
        cx(className),
      ...rest,
    },
    children
  );
}
