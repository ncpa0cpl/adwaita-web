import clsx from "clsx";
import React from "react";
import { GoNext } from "../icons";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type ListItemProps = ExtendElementProps<
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

export function ListItem({
  as,
  children,
  className,
  title,
  selected,
  expandable,
  activatable,
  needsAttention,
  ...rest
}: ListItemProps) {
  const Element = as ? as : activatable ? "button" : "div";
  return (
    // @ts-ignore
    <Element
      className={clsx("List__item", className, {
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
      {expandable && <GoNext className="arrow" />}
    </Element>
  );
}
