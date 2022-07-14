import cx from "clsx";
import React from "react";

export const axisProps = {
  horizontal: (percent: number) => ({ width: `${percent}%` }),
  "horizontal-reverse": (percent: number) => ({ width: `${percent}%` }),
  vertical: (percent: number) => ({ height: `${percent}%` }),
};

export type ProgressProps = {
  /** The label of the slider. */
  "aria-label": string;
  /** The id of the element containing a label for the slider. */
  "aria-labelledby": string;
  /** A string value that provides a user-friendly name for the current value of the slider. */
  "aria-valuetext": string;
  className: string;
  /** The slider orientation. */
  orientation: "horizontal" | "vertical";
  /** The value of the slider. For indeterminate pass undefined. */
  value: number;
  /** If a label should be shown */
  label: boolean | React.ReactNode;
};

export function ProgressImpl(props: ProgressProps) {
  const {
    className,
    orientation = "horizontal",
    label = false,
    value,
    ...rest
  } = props;

  const isRtl = false;

  let axis: "horizontal" | "vertical" | "horizontal-reverse" = orientation;
  if (isRtl && orientation !== "vertical") {
    axis = "horizontal-reverse";
  }

  const trackSize = valueToPercent(value, 0, 100);
  const trackStyle = {
    display: trackSize === 0 ? "none" : undefined,
    ...axisProps[axis](trackSize),
  };

  return (
    <span
      className={cx(
        "Progress",
        {
          vertical: orientation === "vertical",
          indeterminate: typeof value !== "number",
          labeled: label,
        },
        className
      )}
      {...rest}
    >
      {label && (
        <span className="Progress__label text-muted">
          {typeof label === "boolean" ? `${value} %` : label}
        </span>
      )}
      <span className="Progress__content">
        <span className="Progress__rail" />
        <span className="Progress__track" style={trackStyle} />
      </span>
    </span>
  );
}

export const Progress = ProgressImpl;

// Helpers

function valueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min);
}
