import clsx from "clsx";
import React from "react";
import type { BoxProps } from "./Box";
import { Box } from "./Box";

export type MenuItemProps = BoxProps;

export function MenuItem({ children, className, ...rest }: MenuItemProps) {
  return (
    <Box horizontal className={clsx("Menu__item", className)} {...rest}>
      {children}
    </Box>
  );
}
