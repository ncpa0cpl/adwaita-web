import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

export type ButtonProps = ExtendElementProps<
  "button",
  {
    className?: string;
    size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
    /** An icon name */
    icon?: IconName;
    /** HTML button type */
    type?: "button" | "submit" | "reset";
    /** Shows a spinner and disables the button */
    loading?: boolean;
    /** Round style button */
    circular?: boolean;
    /** Flat style button */
    flat?: boolean;
    /** Link style button */
    link?: boolean;
    /** Primary style button */
    primary?: boolean;
    /** Danger style button */
    danger?: boolean;
    /** Active state */
    active?: boolean;
    /** Hover state */
    hover?: boolean;
    /** Button containing text */
    text?: boolean;
    /** Button containing an image only */
    image?: boolean;
  }
>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      size = "medium",
      icon,
      type = "button",
      disabled,
      loading,
      circular,
      flat,
      link,
      active,
      hover,
      text,
      image,
      primary,
      danger,
      ...rest
    },
    ref
  ) {
    const isImageButton = image !== undefined ? image : Boolean(!children);
    return (
      <button
        className={
          cx("Button", size, {
            disabled,
            circular,
            flat,
            link,
            active,
            hover,
            "text-button": text,
            "image-button": isImageButton,
            "suggested-action": primary,
            "destructive-action": danger,
          }) +
          " " +
          cx(className)
        }
        disabled={disabled || loading}
        type={type}
        ref={ref}
        {...rest}
      >
        {loading && <Spinner />}
        {icon &&
          (typeof icon === "string" ? (
            <Icon name={icon} colored className="Button__icon" />
          ) : (
            icon
          ))}
        {children}
      </button>
    );
  }
);
