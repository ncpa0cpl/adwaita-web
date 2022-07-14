import cx from "clsx";
import React from "react";

export type ToolbarProps = React.PropsWithChildren<{
  className?: string;
  horizontal?: boolean;
  vertical?: boolean;
}>;

export function ToolbarImpl({
  className,
  children,
  horizontal,
  vertical,
}: ToolbarProps) {
  return (
    <div className={cx("Toolbar", className, { horizontal, vertical })}>
      {children}
    </div>
  );
}

export const Toolbar = ToolbarImpl;
