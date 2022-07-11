import cx from "clsx";
import React from "react";

import { Box } from "./Box";
import { Button } from "./Button";
import { Icon } from "./Icon";

export type AlertProps = React.PropsWithChildren<{
  title: string;
  className: string;
  size: "mini" | "small" | "medium" | "large" | "huge" | "mega";
  icon: string;
  showClose: boolean;
  onClose: () => void;
  info: boolean;
  success: boolean;
  warning: boolean;
  danger: boolean;
}>;

export function Alert({
  title,
  children,
  className,
  size,
  icon: iconProp,
  showClose,
  onClose,
  info,
  success,
  warning,
  danger,
  ...rest
}: AlertProps) {
  const icon =
    iconProp ?? info
      ? "dialog-information"
      : success
      ? "emblem-ok"
      : warning
      ? "dialog-warning"
      : danger
      ? "dialog-warning"
      : "dialog-information";
  const showIcon = Boolean(icon);

  const alertClassName = cx("Alert", className, size, {
    info,
    success,
    warning,
    danger,
  });

  return (
    <Box horizontal className={alertClassName} {...rest}>
      {showIcon && (
        <Box className="Alert__icon">
          {typeof icon === "string" ? <Icon name={icon} /> : icon}
        </Box>
      )}
      <Box.Fill className="Alert__content">
        {title && <div className="Alert__title">{title}</div>}
        <div className="Alert__message">{children}</div>
      </Box.Fill>
      {showClose && (
        <Button className="Alert__close" icon="window-close" onClick={onClose} />
      )}
    </Box>
  );
}

Alert.defaultProps = {
  showClose: false,
  onClose: () => {},
};
