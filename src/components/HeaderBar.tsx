import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

import { Box } from "./Box";

export type HeaderBarProps = ExtendElementProps<
  "div",
  {
    titlebar?: boolean;
  }
>;

export function HeaderBar({
  className,
  children,
  titlebar,
  ...rest
}: HeaderBarProps) {
  return (
    <div className={cx("HeaderBar", className, { titlebar })} {...rest}>
      <Box horizontal align fill>
        {children}
      </Box>
    </div>
  );
}
