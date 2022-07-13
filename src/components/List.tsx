import cx from "clsx";
import React from "react";
import { GoNext } from "../icons";
import type { ExtendElementProps } from "../utils/extendElementProp";
import { Separator } from "./Separator";

export type ListProps = ExtendElementProps<
  "div",
  React.PropsWithChildren<{
    className?: string;
    size?: "medium" | "large";
    separators?: boolean;
    horizontal?: boolean;
    rich?: boolean;
    border?: boolean;
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

export type ItemProps = ExtendElementProps<
  "div",
  React.PropsWithChildren<{
    className?: string;
    title?: boolean;
    selected?: boolean;
    activatable?: boolean;
    expandable?: boolean;
    as?: keyof JSX.IntrinsicElements; // TODO: add generic support
    needsAttention?: boolean;
  }>
>;

export function Item({
  as,
  children,
  className,
  title,
  selected,
  expandable,
  activatable,
  needsAttention,
  ...rest
}: ItemProps) {
  const Element = as ? as : activatable ? "button" : "div";
  return (
    // @ts-ignore
    <Element
      className={cx("List__item", className, {
        title,
        activatable,
        expandable,
        selected,
        "needs-attention": needsAttention,
      })}
      role={activatable ? "button" : undefined}
      tabIndex={activatable ? 0 : undefined}
      {...rest}
    >
      {children}
      {expandable && <GoNext className="arrow" colored={false} />}
    </Element>
  );
}

List.Item = Item;
List.Separator = Separator;

// Helpers

function borderClass(border: boolean | string | string[]): string | undefined {
  if (border === false) return "border-none";
  if (border === true) return "border";
  if (typeof border === "string") return `border-${border}`;
  if (Array.isArray(border)) return border.map(borderClass).join(" ");
  return undefined;
}
