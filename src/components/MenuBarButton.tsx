import clsx from "clsx";
import React, { useState } from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";
import { Label } from "./Label";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { Popover } from "./Popover";

export type MenuBarButtonProps = ExtendElementProps<
  "button",
  {
    label?: string;
  }
>;

export function MenuBarButton({
  label,
  children,
  className,
  ...rest
}: MenuBarButtonProps) {
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
          clsx("MenuBar__button", className, { active: open }) +
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

// Helpers

function EmptyMenu() {
  return (
    <Menu>
      <MenuItem>
        <Label muted italic noSelect>
          (Empty menu)
        </Label>
      </MenuItem>
    </Menu>
  );
}
