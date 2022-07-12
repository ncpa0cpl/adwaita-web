import cx from "clsx";
import React from "react";
import { Icon } from "./Icon";

export type SpinnerProps = {
  hidden?: boolean;
  disabled?: boolean;
};

export function Spinner({ hidden, disabled }: SpinnerProps) {
  return (
    <Icon
      className={cx("Spinner", { hidden, disabled })}
      type={Icon.Type.processWorking}
    />
  );
}
