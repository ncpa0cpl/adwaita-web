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
  const iconType =
    iconProp ?? info
      ? Icon.Type.dialogInformation
      : success
      ? Icon.Type.emblemOk
      : warning
      ? Icon.Type.dialogWarning
      : danger
      ? Icon.Type.dialogWarning
      : Icon.Type.dialogInformation;
  const showIcon = Boolean(iconType);

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
          <Icon type={iconType} />
        </Box>
      )}
      <Box.Fill className="Alert__content">
        {title && <div className="Alert__title">{title}</div>}
        <div className="Alert__message">{children}</div>
      </Box.Fill>
      {showClose && (
        <Button
          className="Alert__close"
          icon={Icon.Type.windowClose}
          onClick={onClose}
        />
      )}
    </Box>
  );
}

Alert.defaultProps = {
  showClose: false,
  onClose: () => {},
};
