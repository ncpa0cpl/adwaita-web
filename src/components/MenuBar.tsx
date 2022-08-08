import cx from "clsx";
import React from "react";

import type { ExtendElementProps } from "../utils/extendElementProp";

export type MenuBarProps = ExtendElementProps<"div", {}>;

export function MenuBar({ children, className, ...rest }: MenuBarProps) {
  return (
    <div className={cx("MenuBar", className)} {...rest}>
      {children}
    </div>
  );
}
