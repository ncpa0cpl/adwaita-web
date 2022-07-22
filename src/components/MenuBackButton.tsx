import clsx from "clsx";
import React from "react";
import { GoPrevious } from "../icons";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type MenuBackButtonProps = ExtendElementProps<
  "button",
  React.PropsWithChildren<{
    className?: string;
  }>
>;

export function MenuBackButton({
  children,
  className,
  ...rest
}: MenuBackButtonProps) {
  return (
    <button
      className={clsx("ModelButton Menu__button Menu__back", className)}
      {...rest}
    >
      <GoPrevious containerProps={{ className: "Menu__icon submenu" }} />
      <span className="Label Menu__button__text">{children}</span>
    </button>
  );
}
