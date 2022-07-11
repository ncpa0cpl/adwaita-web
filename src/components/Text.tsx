import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type TextProps<P extends keyof JSX.IntrinsicElements = "p"> =
  ExtendElementProps<
    P,
    React.PropsWithChildren<{
      as?: P;
      size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
      weight?: 100 | 300 | 400 | 700 | 900;
      className?: string;
      align?: "left" | "center" | "right";
      fill?: boolean | "left" | "right";
      hero?: boolean;
      muted?: boolean;
      info?: boolean;
      success?: boolean;
      warning?: boolean;
      danger?: boolean;
      italic?: boolean;
      bold?: boolean;
      noSelect?: boolean;
    }>
  >;

export function Text<P extends keyof JSX.IntrinsicElements = "p">({
  children,
  className,
  size,
  align,
  weight,
  fill,
  hero,
  muted,
  info,
  success,
  warning,
  danger,
  italic,
  bold,
  noSelect,
  as = "p" as P,
  ...rest
}: TextProps<P>) {
  return React.createElement(
    as,
    {
      className:
        cx(
          "Text",
          size,
          align ? `align-${align}` : undefined,
          fill === undefined ? undefined : fill === true ? "fill" : `fill-${fill}`,
          weight ? `weight-${weight}` : undefined,
          {
            hero,
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
