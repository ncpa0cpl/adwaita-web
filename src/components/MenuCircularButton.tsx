import clsx from "clsx";
import React from "react";
import type { BoxProps } from "./Box";
import { Box } from "./Box";

// Required for proper typedoc generation
export type { BoxProps };

export type MenuCircularButtonProps = BoxProps;

export function MenuCircularButton({
  children,
  className,
  ...rest
}: MenuCircularButtonProps) {
  return (
    <Box
      horizontal
      className={clsx("circular-buttons", className)}
      space="around"
      {...rest}
    >
      {children}
    </Box>
  );
}
