import cx from "clsx";
import React from "react";

import { DialogInformation, DialogWarning, EmblemOk, WindowClose } from "../icons";
import { Box } from "./Box";
import { Button } from "./Button";

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

export function AlertImpl({
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
  const IconElement =
    iconProp ?? info
      ? DialogInformation
      : success
      ? EmblemOk
      : warning
      ? DialogWarning
      : danger
      ? DialogWarning
      : DialogWarning;
  const showIcon = Boolean(IconElement);

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
          <IconElement />
        </Box>
      )}
      <Box.Fill className="Alert__content">
        {title && <div className="Alert__title">{title}</div>}
        <div className="Alert__message">{children}</div>
      </Box.Fill>
      {showClose && (
        <Button className="Alert__close" icon={WindowClose} onClick={onClose} />
      )}
    </Box>
  );
}

AlertImpl.defaultProps = {
  showClose: false,
  onClose: () => {},
};

export const Alert = AlertImpl;
