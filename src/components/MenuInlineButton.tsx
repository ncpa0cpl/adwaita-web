import clsx from "clsx";
import React from "react";
import type { BoxProps } from "./Box";
import { Box } from "./Box";
import { Label } from "./Label";

// Required for proper typedoc generation
export type { BoxProps };

export type MenuInlineButtonProps = BoxProps & {
  label?: string;
};

export function MenuInlineButton({
  children,
  className,
  label,
  ...rest
}: MenuInlineButtonProps) {
  return (
    <Box
      horizontal
      className={clsx("Menu__item inline-buttons", className)}
      align
      {...rest}
    >
      <Label className="Box__fill">{label}</Label>
      <Box horizontal compact>
        {children}
      </Box>
    </Box>
  );
}
