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

export type HeaderBarTitleProps = React.PropsWithChildren<{
  subtitle?: string;
  className?: string;
  fill?: boolean;
}>;

export function Title({ children, subtitle, className, fill }: HeaderBarTitleProps) {
  return (
    <Box
      vertical
      fill
      align
      justify
      className={cx("HeaderBar__title", className, { Box__fill: fill })}
    >
      <div className="title">{children}</div>
      {subtitle && <div className="subtitle">{subtitle}</div>}
    </Box>
  );
}

export function Controls({ children }: React.PropsWithChildren) {
  return (
    <Box horizontal align className="HeaderBar__controls control-buttons">
      {children}
    </Box>
  );
}

HeaderBar.Title = Title;
HeaderBar.Controls = Controls;
