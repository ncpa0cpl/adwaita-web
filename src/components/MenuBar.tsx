/*
 * MenuBar.js
 */

import cx from "clsx";
import React, { useState } from "react";

import type { ExtendElementProps } from "../utils/extendElementProp";
import { Label } from "./Label";
import { Menu } from "./Menu";
import { Popover } from "./Popover";

export type MenuBarProps = ExtendElementProps<"div", {}>;

export function MenuBar({ children, className, ...rest }: MenuBarProps) {
  return (
    <div className={cx("MenuBar", className)} {...rest}>
      {children}
    </div>
  );
}

export type MenuBarButtonProps = ExtendElementProps<
  "button",
  {
    label?: string;
  }
>;

export function Button({ label, children, className, ...rest }: MenuBarButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      method="click-controlled"
      className="MenuBar__popover"
      placement="bottom-start"
      arrow={false}
      delay={50}
      content={children || <EmptyMenu />}
      open={open}
      onClose={() => setOpen(false)}
    >
      <button
        className={
          cx("MenuBar__button", className, { active: open }) +
          (open ? " active" : "")
        }
        onClick={() => setOpen(!open)}
        {...rest}
      >
        {label}
      </button>
    </Popover>
  );
}

MenuBar.Button = Button;

// Helpers

function EmptyMenu() {
  return (
    <Menu>
      <Menu.Item>
        <Label muted italic noSelect>
          (Empty menu)
        </Label>
      </Menu.Item>
    </Menu>
  );
}
