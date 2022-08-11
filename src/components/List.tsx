import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type Borders = "right" | "left" | "bottom" | "top" | "handle";

export type ListProps = ExtendElementProps<
  "div",
  React.PropsWithChildren<{
    className?: string;
    size?: "medium" | "large";
    separators?: boolean;
    horizontal?: boolean;
    rich?: boolean;
    border?: boolean | Borders | Borders[];
    rounded?: boolean;
    fill?: boolean | "width" | "height";
    sidebar?: boolean | "stack" | "navigation";
    sublist?: boolean;
  }>
>;

export function List({
  children,
  className,
  size = "medium",
  separators = true,
  horizontal,
  border = true,
  rounded,
  fill,
  rich,
  sidebar,
  sublist,
  ...rest
}: ListProps) {
  return (
    <div
      className={cx(
        "List",
        className,
        size,
        borderClass(border),
        {
          fill: fill === true,
          "fill-width": fill === "width",
          "fill-height": fill === "height",
        },
        {
          separators,
          horizontal,
          rounded,
          rich,
          sublist,
          sidebar: sidebar,
          "stack-sidebar": sidebar === "stack",
          "navigation-sidebar": sidebar === "navigation",
        }
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

// Helpers

function borderClass(border: boolean | string | string[]): string | undefined {
  if (border === false) return "border-none";
  if (border === true) return "border";
  if (typeof border === "string") return `border-${border}`;
  if (Array.isArray(border)) return border.map(borderClass).join(" ");
  return undefined;
}
