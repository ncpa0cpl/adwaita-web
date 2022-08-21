import clsx from "clsx";
import React from "react";
import type { LabelProps } from "./Label";
import { Label } from "./Label";

// Required for proper typedoc generation
export type { LabelProps };

export type MenuTitleProps = LabelProps;

export function MenuTitle({ children, className, ...rest }: MenuTitleProps) {
  return (
    <Label className={clsx("Menu__item title", className)} {...rest}>
      {children}
    </Label>
  );
}
