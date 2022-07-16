import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type BoxProps = ExtendElementProps<
  "div",
  React.PropsWithChildren<{
    align?: true | "start" | "end";
    justify?: true | "start" | "end";
    className?: string;
    inline?: boolean;
    compact?: boolean;
    fill?: boolean | "horizontal" | "vertical";
    border?: boolean;
    horizontal?: boolean;
    vertical?: boolean;
    space?: "around" | "between";
    padded?: boolean;
    expandChildren?: boolean;
  }>
>;

export function Box({
  children,
  className,
  inline,
  compact,
  fill,
  border = false,
  horizontal,
  vertical,
  align,
  justify,
  space,
  padded,
  expandChildren,
  ...rest
}: BoxProps) {
  return (
    <div
      className={cx(
        "Box",
        className,
        space ? `space-${space}` : undefined,
        typeof fill === "string" ? `fill-${fill}` : fill ? "fill" : undefined,
        alignClass(align),
        justifyClass(justify),
        {
          inline,
          compact,
          vertical,
          horizontal,
          border,
          padded,
          "expand-children": expandChildren,
        }
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type FillProps = ExtendElementProps<
  "div",
  React.PropsWithChildren<{
    className?: string;
    expandChildren?: boolean;
  }>
>;

function Fill({ children, className, expandChildren, ...rest }: FillProps) {
  return (
    <div
      className={cx("Box__fill", {
        "expand-children": expandChildren,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

Box.Fill = Fill;

// Helpers

function alignClass(align: true | "start" | "end" | undefined) {
  if (align === true) return "align";
  if (typeof align === "string") return `align-${align}`;
  return undefined;
}

function justifyClass(justify: true | "start" | "end" | undefined) {
  if (justify === true) return "justify";
  if (typeof justify === "string") return `justify-${justify}`;
  return undefined;
}
