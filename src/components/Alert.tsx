import cx from "clsx";
import React from "react";

import type { AdwaitaIcon } from "../icons";
import { DialogInformation, DialogWarning, EmblemOk, WindowClose } from "../icons";
import { Box } from "./Box";
import { Button } from "./Button";

export type AlertProps = React.PropsWithChildren<{
  /** The title/header of the alert. */
  title: string;
  /** Class names that will be added to the alert container. */
  className: string;
  /** Size of the alert. */
  size: "mini" | "small" | "medium" | "large" | "huge" | "mega";
  /**
   * Icon that will be displayed to the left of the alert message. If not provided a
   * default icon will be used depending of the alert type.
   */
  icon: AdwaitaIcon;
  /** Wether to show a close button in the alert. */
  showClose: boolean;
  /** A callback that will be invoked when a close button is clicked. */
  onClose: () => void;
  /**
   * When set to true the type of the alert will be set to "Information Message",
   * Information Alerts have a bulb icon and a blue background.
   */
  info: boolean;
  /**
   * When set to true the type of the alert will be set to "Success Message", Success
   * Alerts have a checkmark icon and a green background.
   */
  success: boolean;
  /**
   * When set to true the type of the alert will be set to "Warning Message", Warning
   * Alerts have a warning icon and a yellow background.
   */
  warning: boolean;
  /**
   * When set to true the type of the alert will be set to "Danger Message", Danger
   * Alerts have a warning icon and a red background.
   */
  danger: boolean;
}>;

/** Alert component for displaying messages to the user in a way that attracts attention. */
export function Alert({
  title,
  children,
  className,
  size,
  icon: iconProp,
  showClose = false,
  onClose = () => {},
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
      <Box className="Alert__content Box__fill">
        {title && <div className="Alert__title">{title}</div>}
        <div className="Alert__message">{children}</div>
      </Box>
      {showClose && (
        <Button className="Alert__close" icon={WindowClose} onClick={onClose} />
      )}
    </Box>
  );
}
