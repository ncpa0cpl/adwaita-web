import clsx from "clsx";
import React from "react";
import type { AdwaitaIcon } from "../icons";
import { EmblemOk, GoNext, Radio } from "../icons";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type MenuButtonProps = ExtendElementProps<
  "button",
  {
    className?: string;
    icon?: AdwaitaIcon;
    radio?: boolean;
    checkbox?: boolean;
    accelerator?: string;
    menu?: boolean;
    selected?: boolean;
  }
>;

export function MenuButton({
  children,
  className,
  radio,
  checkbox,
  accelerator,
  icon: IconElement,
  menu,
  ...rest
}: MenuButtonProps) {
  return (
    <button className={clsx("ModelButton Menu__button", className)} {...rest}>
      {checkbox !== undefined && (
        <EmblemOk containerProps={{ className: "Menu__icon" }} />
      )}
      {radio && <Radio containerProps={{ className: "Menu__icon" }} />}
      <span className="Label Menu__button__text">{children}</span>
      {accelerator && (
        <span className="Label Menu__button__accelerator">{accelerator}</span>
      )}
      {IconElement && (
        <IconElement containerProps={{ className: "Menu__iconAfter" }} />
      )}
      {menu && <GoNext containerProps={{ className: "Menu__iconAfter submenu" }} />}
    </button>
  );
}
