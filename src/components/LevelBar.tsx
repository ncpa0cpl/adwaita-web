import cx from "clsx";
import { range } from "rambda";
import React from "react";

export type LevelBarProps = {
  className?: string;
  vertical?: boolean;
  /** The number active of segments */
  value?: number;
  /** The number of segments */
  segments?: number;
  /** The coloration of the active segments */
  level?: "empty" | "danger" | "warning" | "info" | "success";
};

export const LevelBar = React.forwardRef<HTMLSpanElement, LevelBarProps>(
  function LevelBar(props, ref) {
    const {
      className,
      value = 0,
      segments = 5,
      vertical,
      level: levelValue,
      ...rest
    } = props;

    const percentage = value / (segments - 1);
    const level =
      percentage < 0.1
        ? "danger"
        : percentage < 0.5
        ? "warning"
        : percentage < 0.9
        ? "info"
        : "success";

    return (
      <span className={cx("LevelBar", className, { vertical })} {...rest} ref={ref}>
        <span className="LevelBar__content">
          {range(0, segments).map((n) => (
            <span
              key={n}
              className={cx(
                "LevelBar__rail",
                value < n ? "empty" : levelValue || level
              )}
            />
          ))}
        </span>
      </span>
    );
  }
);
