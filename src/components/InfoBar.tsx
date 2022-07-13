import cx from "clsx";
import React, { useState } from "react";
import { WindowClose } from "../icons";
import type { ExtendElementProps } from "../utils/extendElementProp";

import { Box } from "./Box";
import { Button } from "./Button";

export type InfoBarProps = ExtendElementProps<
  "div",
  {
    className?: string;
    closable?: boolean;
    activatable?: boolean;
    info?: boolean;
    success?: boolean;
    warning?: boolean;
    danger?: boolean;
    close?: boolean;
    onClose?: () => void;
  }
>;

export function InfoBar({
  className,
  children,
  closable,
  activatable: activatableValue,
  info,
  success,
  warning,
  danger,
  close: closeValue,
  onClose,
  ...rest
}: InfoBarProps) {
  const [closeState, setClose] = useState(false);
  const close = closeValue ?? closeState;
  const activatable = activatableValue ?? Boolean(rest.onClick);

  return (
    <div
      className={cx("InfoBar", className, {
        activatable,
        info,
        success,
        warning,
        danger,
        close,
      })}
      role={activatable ? "button" : undefined}
      onTransitionEnd={onClose}
      {...rest}
    >
      <Box horizontal align fill>
        <span className="Box__fill">{children}</span>
        {closable && <Button icon={WindowClose} onClick={() => setClose(true)} />}
      </Box>
    </div>
  );
}
