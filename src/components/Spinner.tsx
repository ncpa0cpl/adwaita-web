import cx from "clsx";
import React from "react";
import { ProcessWorking } from "../icons";

export type SpinnerProps = {
  hidden?: boolean;
  disabled?: boolean;
};

export function SpinnerImpl({ hidden, disabled }: SpinnerProps) {
  return (
    <ProcessWorking
      containerProps={{ className: cx("Spinner", { hidden, disabled }) }}
    />
  );
}

export const Spinner = SpinnerImpl;
