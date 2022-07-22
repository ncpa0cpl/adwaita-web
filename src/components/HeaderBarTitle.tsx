import clsx from "clsx";
import React from "react";
import { Box } from "./Box";

export type HeaderBarTitleProps = React.PropsWithChildren<{
  /** A text to be displayed below the Title. */
  subtitle?: string;
  /** Class names to be added to the HeaderBarTitle container. */
  className?: string;
  /** When set to true, will expand to fill all the available space within a HeaderBar. */
  fill?: boolean;
}>;

/** A component that can be used inside the HeaderBar component to display the header's title. */
export function HeaderBarTitle({
  children,
  subtitle,
  className,
  fill,
}: HeaderBarTitleProps) {
  return (
    <Box
      vertical
      fill
      align
      justify
      className={clsx("HeaderBar__title", className, { Box__fill: fill })}
    >
      <div className="title">{children}</div>
      {subtitle && <div className="subtitle">{subtitle}</div>}
    </Box>
  );
}
