import clsx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";
import { Box } from "./Box";

export type HeaderBarControlsProps = ExtendElementProps<"div", {}>;

export function HeaderBarControls({
  children,
  className,
  ...rest
}: HeaderBarControlsProps) {
  return (
    <Box
      {...rest}
      horizontal
      align
      className={clsx("HeaderBar__controls", "control-buttons", className)}
    >
      {children}
    </Box>
  );
}
