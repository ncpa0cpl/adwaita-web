/*
 * Range.js
 * adapted from: https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Range/Range.js
 */

import cx from "clsx";
import { identity } from "rambda";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";
import { getPropAndCastOr } from "../utils/getPropAndCastOr";

import ownerDocument from "../utils/ownerDocument";
import { trackFinger } from "../utils/trackFinger";
import useControlled from "../utils/useControlled";
import useForkRef from "../utils/useForkRef";
import useIsFocusVisible from "../utils/useIsFocusVisible";

const axisProps = {
  horizontal: {
    offset: (percent: number) => ({ left: `${percent}%` }),
    leap: (percent: number) => ({ width: `${percent}%` }),
  },
  "horizontal-reverse": {
    offset: (percent: number) => ({ right: `${percent}%` }),
    leap: (percent: number) => ({ width: `${percent}%` }),
  },
  vertical: {
    offset: (percent: number) => ({ bottom: `${percent}%` }),
    leap: (percent: number) => ({ height: `${percent}%` }),
  },
};

export type RangeProps = ExtendElementProps<
  "span",
  {
    /** The label of the slider. */
    "aria-label"?: string;
    /** The id of the element containing a label for the slider. */
    "aria-labelledby"?: string;
    /** A string value that provides a user-friendly name for the current value of the slider. */
    "aria-valuetext"?: string;
    className?: string;
    size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
    /** The default element value. Use when the component is not controlled. */
    defaultValue?: number | number[];
    /** If `true`, the slider will be disabled. */
    disabled?: boolean;
    /**
     * Marks indicate predetermined values to which the user can move the slider. If
     * `true` the marks will be spaced according the value of the `step` prop. If an
     * array, it should contain objects with `value` and an optional `label` keys.
     */
    marks?: boolean | Array<{ value: number; label?: string }>;
    /** The maximum allowed value of the slider. Should not be equal to min. */
    max?: number;
    /** The minimum allowed value of the slider. Should not be equal to max. */
    min?: number;
    /** Name attribute of the hidden `input` element. */
    name?: string;
    /** Callback function that is fired when the slider's value changed. */
    onChange?: (
      value: number | number[],
      ev: React.ChangeEvent | React.MouseEvent | MouseEvent | TouchEvent
    ) => void;
    /** Callback function that is fired when the `mouseup` is triggered. */
    onChangeCommitted?: (
      ev: React.ChangeEvent | MouseEvent | TouchEvent,
      value: number | number[]
    ) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    /** If the slider is vertical. */
    vertical?: boolean;
    /** A transformation function, to change the scale of the slider. */
    scale?: <T>(value: T) => T;
    /**
     * The granularity with which the slider can step through values. (A "discrete"
     * slider.) The `min` prop serves as the origin for the valid values. We
     * recommend (max - min) to be evenly divisible by the step.
     *
     * When step is `null`, the thumb can only be slid onto marks provided with the
     * `marks` prop.
     */
    step?: number;
    /** The component used to display the value label. */
    ThumbComponent?: React.ComponentType;
    /**
     * The track presentation:
     *
     * - `normal` the track will render a bar representing the slider value.
     * - `inverted` the track will render a bar representing the remaining slider value.
     * - `false` the track will render without a bar.
     */
    track?: boolean | "normal" | "inverted";
    /** The value of the slider. For ranged sliders, provide an array with two values. */
    value?: number | number[];
    /**
     * Controls when the value label is displayed:
     *
     * - `auto` the value label will display when the thumb is hovered or focused.
     * - `on` will display persistently.
     * - `off` will never display.
     */
    valueLabelDisplay?: "off" | "auto" | "on";
    /**
     * The format function the value label's value.
     *
     * When a function is provided, it should have the following signature:
     *
     * - {number} value The value label's value to format
     * - {number} index The value label's index to format
     */
    valueLabelFormat?: string | ((value: number, index: number) => string);
  }
>;

export const Range = React.forwardRef<HTMLSpanElement, RangeProps>(
  (props: RangeProps, ref: React.ForwardedRef<HTMLSpanElement>) => {
    const {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-valuetext": ariaValuetext,
      className,
      size = "medium",
      defaultValue = 0,
      disabled = false,
      marks: marksProp = false,
      max = 100,
      min = 0,
      name,
      onChange,
      onChangeCommitted,
      onMouseDown,
      vertical = false,
      scale = identity,
      step = 1,
      ThumbComponent = "span",
      track = "normal",
      value: valueProp,
      valueLabelDisplay = "off",
      valueLabelFormat = identity,
      ...other
    } = props;
    const orientation = vertical ? "vertical" : "horizontal";

    const touchId = React.useRef<number>();
    // We can't use the :active browser pseudo-classes.
    // - The active state isn't triggered when clicking on the rail.
    // - The active state isn't transfered when inversing a range slider.
    const [active, setActive] = React.useState(-1);
    const [_, setOpen] = React.useState(-1);

    const [valueDerived, setValueState] = useControlled(valueProp, defaultValue);

    const range = Array.isArray(valueDerived);
    let values = range
      ? valueDerived.slice().sort(asc)
      : valueDerived !== undefined
      ? [valueDerived]
      : [];
    values = values.map((value) => clamp(value, min, max));
    const marks =
      marksProp === true && step !== null
        ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
            value: min + step * index,
            label: undefined,
          }))
        : Array.isArray(marksProp)
        ? marksProp
        : [];

    const {
      isFocusVisible,
      onBlurVisible,
      ref: focusVisibleRef,
    } = useIsFocusVisible();
    const [focusVisible, setFocusVisible] = React.useState(-1);

    const sliderRef = React.useRef<HTMLSpanElement | null>(null);
    const handleFocusRef = useForkRef(focusVisibleRef, sliderRef);
    const handleRef = useForkRef(ref, handleFocusRef);

    const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
      const index = Number(event.currentTarget.getAttribute("data-index"));
      if (isFocusVisible(event)) {
        setFocusVisible(index);
      }
      setOpen(index);
    };

    const handleBlur = () => {
      if (focusVisible !== -1) {
        setFocusVisible(-1);
        onBlurVisible();
      }
      setOpen(-1);
    };

    const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
      const index = Number(event.currentTarget.getAttribute("data-index"));
      setOpen(index);
    };

    const handleMouseLeave = () => {
      setOpen(-1);
    };

    const isRtl = false;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      const index = Number(event.currentTarget.getAttribute("data-index"));
      const value = values[index];
      if (!value) return;
      const tenPercents = (max - min) / 10;
      const marksValues = marks.map((mark) => mark.value);
      const marksIndex = marksValues.indexOf(value);
      let newValue: number | undefined;
      const increaseKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const decreaseKey = isRtl ? "ArrowRight" : "ArrowLeft";

      switch (event.key) {
        case "Home":
          newValue = min;
          break;
        case "End":
          newValue = max;
          break;
        case "PageUp":
          if (step) {
            newValue = value + tenPercents;
          }
          break;
        case "PageDown":
          if (step) {
            newValue = value - tenPercents;
          }
          break;
        case increaseKey:
        case "ArrowUp":
          if (step) {
            newValue = value + step;
          } else {
            newValue =
              marksValues[marksIndex + 1] || marksValues[marksValues.length - 1];
          }
          break;
        case decreaseKey:
        case "ArrowDown":
          if (step) {
            newValue = value - step;
          } else {
            newValue = marksValues[marksIndex - 1] || marksValues[0];
          }
          break;
        default:
          return;
      }

      // Prevent scroll of the page
      event.preventDefault();

      if (!newValue) {
        throw new Error("newValue is undefined");
      }

      if (step) {
        newValue = roundValueToStep(newValue, step, min);
      }

      newValue = clamp(newValue, min, max);

      let newValues: number[] | undefined = undefined;

      if (range) {
        const previousValue = newValue;
        newValues = setValueIndex({
          values,
          source: valueDerived,
          newValue,
          index,
        }).sort(asc);
        focusThumb({
          sliderRef,
          activeIndex: newValues.indexOf(previousValue),
          setActive() {},
        });
      }

      setValueState(newValues ?? newValue);
      setFocusVisible(index);

      if (onChange) {
        onChange(newValues ?? newValue, event);
      }
      if (onChangeCommitted) {
        onChangeCommitted(event, newValues ?? newValue);
      }
    };

    const previousIndex = React.useRef<number>();
    let axis: typeof orientation | "horizontal-reverse" = orientation;
    if (isRtl && vertical == false) {
      axis = "horizontal-reverse";
    }

    const getFingerNewValue = ({
      finger,
      move = false,
      values: values2,
      source,
    }: {
      finger: {
        x: number;
        y: number;
      };
      move?: boolean;
      values: number[];
      source: number[];
    }) => {
      if (!sliderRef.current) {
        throw new Error("sliderRef is null");
      }
      const { current: slider } = sliderRef;
      const { width, height, bottom, left } = slider.getBoundingClientRect();
      let percent;

      if (axis.indexOf("vertical") === 0) {
        percent = (bottom - finger.y) / height;
      } else {
        percent = (finger.x - left) / width;
      }

      if (axis.indexOf("-reverse") !== -1) {
        percent = 1 - percent;
      }

      let newValue = percentToValue(percent, min, max);
      if (step) {
        newValue = roundValueToStep(newValue, step, min);
      } else {
        const marksValues = marks.map((mark) => mark.value);
        const closestIndex = findClosest(marksValues, newValue);
        if (closestIndex) {
          const nv = marksValues[closestIndex];
          if (nv !== undefined) newValue = nv;
        }
      }

      newValue = clamp(newValue, min, max);
      let activeIndex = 0;

      let newValues: number[] | undefined = undefined;

      if (range) {
        if (!move) {
          activeIndex = findClosest(values2, newValue) ?? activeIndex;
        } else {
          activeIndex = previousIndex.current ?? activeIndex;
        }

        const previousValue = newValue;
        newValues = setValueIndex({
          values: values2,
          source,
          newValue,
          index: activeIndex,
        }).sort(asc);
        activeIndex = newValues.indexOf(previousValue);
        previousIndex.current = activeIndex;
      }

      return { newValue: newValues ?? newValue, activeIndex };
    };

    const [isMoving, setIsMoving] = React.useState(false);

    const handleTouchMove = (event: MouseEvent | TouchEvent) => {
      const finger = trackFinger(event, touchId);

      if (!finger) {
        return;
      }

      const { newValue, activeIndex } = getFingerNewValue({
        finger,
        move: true,
        values,
        source: Array.isArray(valueDerived)
          ? valueDerived
          : valueDerived !== undefined
          ? [valueDerived]
          : [],
      });

      focusThumb({ sliderRef, activeIndex, setActive });
      setValueState(newValue);

      if (onChange) {
        onChange(newValue, event);
      }
    };
    const handleTouchEnd = (event: MouseEvent | TouchEvent) => {
      if (!sliderRef.current) {
        return;
      }

      const finger = trackFinger(event, touchId);

      if (!finger) {
        return;
      }

      const { newValue } = getFingerNewValue({
        finger,
        values,
        source: Array.isArray(valueDerived)
          ? valueDerived
          : valueDerived !== undefined
          ? [valueDerived]
          : [],
      });

      setActive(-1);
      if (event.type === "touchend") {
        setOpen(-1);
      }

      if (onChangeCommitted) {
        onChangeCommitted(event, newValue);
      }

      touchId.current = undefined;

      const doc = ownerDocument(sliderRef.current);
      doc.removeEventListener("mousemove", handleTouchMove);
      doc.removeEventListener("mouseup", handleTouchEnd);
      doc.removeEventListener("touchmove", handleTouchMove);
      doc.removeEventListener("touchend", handleTouchEnd);

      setIsMoving(false);
    };
    const handleTouchStart = (event: TouchEvent) => {
      // Workaround as Safari has partial support for touchAction: 'none'.
      event.preventDefault();

      if (!sliderRef.current) {
        return;
      }

      const touch = event.changedTouches[0];
      if (touch != null) {
        // A number that uniquely identifies the current finger in the touch session.
        touchId.current = touch.identifier;
      }
      const finger = trackFinger(event, touchId);
      if (!finger) return;
      const { newValue, activeIndex } = getFingerNewValue({
        finger,
        values,
        source: Array.isArray(valueDerived)
          ? valueDerived
          : valueDerived !== undefined
          ? [valueDerived]
          : [],
      });
      focusThumb({ sliderRef, activeIndex, setActive });

      setValueState(newValue);

      if (onChange) {
        onChange(newValue, event);
      }

      const doc = ownerDocument(sliderRef.current);
      doc.addEventListener("touchmove", handleTouchMove);
      doc.addEventListener("touchend", handleTouchEnd);
    };

    React.useEffect(() => {
      if (!sliderRef.current) {
        return;
      }

      const { current: slider } = sliderRef;
      slider.addEventListener("touchstart", handleTouchStart);
      const doc = ownerDocument(slider);

      if (isMoving) {
        const doc = ownerDocument(sliderRef.current);
        doc.addEventListener("mousemove", handleTouchMove);
        doc.addEventListener("mouseup", handleTouchEnd);
      }

      return () => {
        slider.removeEventListener("touchstart", handleTouchStart);
        doc.removeEventListener("mousemove", handleTouchMove);
        doc.removeEventListener("mouseup", handleTouchEnd);
        doc.removeEventListener("touchmove", handleTouchMove);
        doc.removeEventListener("touchend", handleTouchEnd);
      };
    }, [handleTouchEnd, handleTouchMove, handleTouchStart]);

    const handleMouseDown = (event: React.MouseEvent) => {
      if (!sliderRef.current) {
        return;
      }

      if (onMouseDown) {
        onMouseDown(event);
      }

      event.preventDefault();
      const finger = trackFinger(event, touchId);
      if (!finger) {
        return;
      }
      const { newValue, activeIndex } = getFingerNewValue({
        finger,
        values,
        source: Array.isArray(valueDerived)
          ? valueDerived
          : valueDerived !== undefined
          ? [valueDerived]
          : [],
      });
      focusThumb({ sliderRef, activeIndex, setActive });

      setValueState(newValue);

      if (onChange) {
        onChange(newValue, event);
      }

      const doc = ownerDocument(sliderRef.current);
      doc.addEventListener("mousemove", handleTouchMove);
      doc.addEventListener("mouseup", handleTouchEnd);

      setIsMoving(true);
    };

    const trackOffset = valueToPercent(range ? values[0] ?? min : min, min, max);
    const trackLeap =
      valueToPercent(values[values.length - 1] ?? min, min, max) - trackOffset;
    const trackStyle = {
      ...axisProps[axis].offset(trackOffset),
      ...axisProps[axis].leap(trackLeap),
    };

    return (
      <span
        ref={handleRef}
        className={cx(
          "Range",
          size,
          {
            disabled,
            marked: marksProp,
            vertical,
            focus: focusVisible !== -1,
            "no-track": track === false,
          },
          className
        )}
        onMouseDown={handleMouseDown}
        {...other}
      >
        <span className="Range__content">
          <span className="Range__rail" />
          <span className="Range__track" style={trackStyle} />
          <input value={values.join(",")} name={name} type="hidden" />
          {marks.map((mark, index) => {
            const percent = valueToPercent(mark.value, min, max);
            const style = axisProps[axis].offset(percent);

            let markActive;
            if (track === false) {
              markActive = values.indexOf(mark.value) !== -1;
            } else {
              const firstValue = values[0];
              const lastValue = values[values.length - 1];
              markActive =
                (track === "normal" &&
                  (range
                    ? firstValue !== undefined &&
                      mark.value >= firstValue &&
                      lastValue !== undefined &&
                      mark.value <= lastValue
                    : firstValue !== undefined && mark.value <= firstValue)) ||
                (track === "inverted" &&
                  (range
                    ? (firstValue !== undefined && mark.value <= firstValue) ||
                      (lastValue !== undefined && mark.value >= lastValue)
                    : firstValue !== undefined && mark.value >= firstValue));
            }

            return (
              <React.Fragment key={mark.value}>
                <span
                  style={style}
                  data-index={index}
                  className={cx("Range__mark", {
                    active: markActive,
                  })}
                />
                {mark.label != null ? (
                  <span
                    aria-hidden
                    data-index={index}
                    style={style}
                    className="Range__mark__label"
                  >
                    {mark.label}
                  </span>
                ) : null}
              </React.Fragment>
            );
          })}
          {values.map((value, index) => {
            const percent = valueToPercent(value, min, max);
            const style = axisProps[axis].offset(percent);

            return (
              <ThumbComponent
                key={index}
                className={cx("Range__thumb", {
                  active: active === index,
                  disabled: disabled,
                  focus: focusVisible === index,
                })}
                tabIndex={disabled ? undefined : 0}
                role="slider"
                style={style}
                data-index={index}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                aria-orientation={orientation}
                aria-valuemax={scale(max)}
                aria-valuemin={scale(min)}
                aria-valuenow={scale(value)}
                aria-valuetext={ariaValuetext}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </span>
      </span>
    );
  }
);

// Helpers

function asc(a: number, b: number) {
  return a - b;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(min, value), max);
}

function findClosest(values: number[], currentValue: number) {
  const result = values.reduce(
    (acc: null | { distance: number; index: number }, value, index) => {
      const distance = Math.abs(currentValue - value);

      if (acc === null || distance < acc.distance || distance === acc.distance) {
        return {
          distance,
          index,
        };
      }

      return acc;
    },
    null
  );
  return result ? result.index : result;
}

function valueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min);
}

function percentToValue(percent: number, min: number, max: number) {
  return (max - min) * percent + min;
}

function getDecimalPrecision(num: number): number {
  // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
  // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split("e-");
    const matissaDecimalPart = parts[0]!.split(".")[1];
    return (
      (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1]!, 10)
    );
  }

  const decimalPart = num.toString().split(".")[1];
  return decimalPart ? decimalPart.length : 0;
}

function roundValueToStep(value: number, step: number, min: number): number {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

function setValueIndex({
  values,
  source,
  newValue,
  index,
}: {
  values: number[];
  source: number[];
  newValue: number;
  index: number;
}): number[] {
  // Performance shortcut
  if (values[index] === newValue) {
    return source;
  }

  const output = values.slice();
  output[index] = newValue;
  return output;
}

function focusThumb({
  sliderRef,
  activeIndex,
  setActive,
}: {
  sliderRef: React.RefObject<HTMLElement>;
  activeIndex: number;
  setActive?: (index: number) => void;
}) {
  if (
    !sliderRef.current?.contains(document.activeElement) ||
    Number(document.activeElement?.getAttribute("data-index")) !== activeIndex
  ) {
    const elem = sliderRef.current?.querySelector(
      `[role="slider"][data-index="${activeIndex}"]`
    );
    getPropAndCastOr(elem, "focus", () => {})();
  }

  if (setActive) {
    setActive(activeIndex);
  }
}
