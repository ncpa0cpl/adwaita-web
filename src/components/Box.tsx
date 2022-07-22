import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type BoxProps = ExtendElementProps<
  "div",
  React.PropsWithChildren<{
    /** Define how the items inside the Box should be aligned in relation to the Box. */
    align?: true | "center" | "start" | "end";
    /** Define how the items inside the Box should be justified inside the Box. */
    justify?: true | "center" | "start" | "end";
    /** Class names that will be added to the Box's div element. */
    className?: string;
    /** When set to true Box will be displayed as a `inline-flex`. */
    inline?: boolean;
    compact?: boolean;
    /** Makes the Box grow to fill the available space, vertically, horizontally, or both. */
    fill?: boolean | "horizontal" | "vertical";
    /** Adds border to the Box. */
    border?: boolean;
    /** Set the layout of the box to be horizontal. (children are placed one next to the other) */
    horizontal?: boolean;
    /** Set the layout of the box to be vertical. (children are placed one below the other) */
    vertical?: boolean;
    space?: "around" | "between";
    /** Adds padding inside the Box. */
    padded?: boolean;
    /** Makes all of the direct children of the box to grow to fill as much space as possible. */
    expandChildren?: boolean;
  }>
>;

/** A simple flexbox container. */
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

// Helpers

function alignClass(align: true | "center" | "start" | "end" | undefined) {
  if (align === true) return "align";
  if (typeof align === "string") return `align-${align}`;
  return undefined;
}

function justifyClass(justify: true | "center" | "start" | "end" | undefined) {
  if (justify === true) return "justify";
  if (typeof justify === "string") return `justify-${justify}`;
  return undefined;
}
