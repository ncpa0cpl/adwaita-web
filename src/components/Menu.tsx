import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type MenuProps = ExtendElementProps<
  "div",
  React.PropsWithChildren<{
    className?: string;
    icons?: boolean;
  }>
>;

export function Menu({ children, className, icons, ...rest }: MenuProps) {
  return (
    <div className={cx("Menu", className, { icons })} {...rest}>
      {children}
    </div>
  );
}
