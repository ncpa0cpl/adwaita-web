import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

import type { BoxProps } from "./Box";
import { Box } from "./Box";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
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
    icon?: IconName;
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
  icon,
  menu,
  ...rest
}: MenuButtonProps) {
  return (
    <button className={cx("ModelButton Menu__button", className)} {...rest}>
      {checkbox !== undefined && <Icon name="emblem-ok" className="Menu__icon" />}
      {radio && <Icon name="radio" className="Menu__icon" />}
      <span className="Label Menu__button__text">{children}</span>
      {accelerator && (
        <span className="Label Menu__button__accelerator">{accelerator}</span>
      )}
      {icon && <Icon name={icon} className="Menu__iconAfter" />}
      {menu && <Icon name="go-next" className="Menu__iconAfter submenu" />}
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
      <Icon name="go-previous" className="Menu__icon submenu" />
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
