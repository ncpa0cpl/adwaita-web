import cx from "clsx";
import React from "react";
import type { AdwaitaIcon } from "../icons";
import { EmblemOk, GoNext, GoPrevious, Radio } from "../icons";
import type { ExtendElementProps } from "../utils/extendElementProp";

import type { BoxProps } from "./Box";
import { Box } from "./Box";
import type { LabelProps } from "./Label";
import { Label } from "./Label";
import { Separator } from "./Separator";

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

export function Button({
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
    <button className={cx("ModelButton Menu__button", className)} {...rest}>
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

export type MenuBackProps = ExtendElementProps<
  "button",
  React.PropsWithChildren<{
    className?: string;
  }>
>;

export function Back({ children, className, ...rest }: MenuBackProps) {
  return (
    <button
      className={cx("ModelButton Menu__button Menu__back", className)}
      {...rest}
    >
      <GoPrevious containerProps={{ className: "Menu__icon submenu" }} />
      <span className="Label Menu__button__text">{children}</span>
    </button>
  );
}

export type MenuInlineButtonProps = BoxProps & {
  label?: string;
};

export function InlineButtons({
  children,
  className,
  label,
  ...rest
}: MenuInlineButtonProps) {
  return (
    <Box
      horizontal
      className={cx("Menu__item inline-buttons", className)}
      align
      {...rest}
    >
      <Label className="Box__fill">{label}</Label>
      <Box horizontal compact>
        {children}
      </Box>
    </Box>
  );
}

export type MenuCircularButtonProps = BoxProps;

export function CircularButtons({
  children,
  className,
  ...rest
}: MenuCircularButtonProps) {
  return (
    <Box
      horizontal
      className={cx("circular-buttons", className)}
      space="around"
      {...rest}
    >
      {children}
    </Box>
  );
}

export type MenuItemProps = BoxProps;

export function Item({ children, className, ...rest }: MenuItemProps) {
  return (
    <Box horizontal className={cx("Menu__item", className)} {...rest}>
      {children}
    </Box>
  );
}

export type MenuTitleProps = LabelProps;

export function Title({ children, className, ...rest }: MenuTitleProps) {
  return (
    <Label className={cx("Menu__item title", className)} {...rest}>
      {children}
    </Label>
  );
}

Menu.Button = Button;
Menu.Item = Item;
Menu.Back = Back;
Menu.Title = Title;
Menu.CircularButtons = CircularButtons;
Menu.InlineButtons = InlineButtons;
Menu.Separator = Separator;
