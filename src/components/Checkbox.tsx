import cx from "clsx";
import React from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

const noop = () => {};

let nextId = 1;

export type CheckboxProps = ExtendElementProps<
  "label",
  {
    /** The checkbox label */
    label?: string;
    /** Size of the checkbox. */
    size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
    /** Whether to show the checkbox label. */
    showLabel?: boolean;
    /** The current value of the checkbox. */
    value?: boolean;
    /** Default value of the checkbox. */
    defaultValue?: boolean;
    /** Whether the checkbox is disabled. */
    disabled?: boolean;
    /** A callback function that is called when the checkbox is changed. */
    onChange?: (value: boolean, ev: React.ChangeEvent<HTMLInputElement>) => void;
  }
>;

export class Checkbox extends React.Component<CheckboxProps> {
  static defaultProps = {
    showLabel: true,
    size: "medium",
    onChange: noop,
  };

  id: string;

  constructor(props: CheckboxProps) {
    super(props);
    this.id = `checkbox_${nextId++}`;
  }

  onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(ev.target.checked, ev);
    }
  };

  override render() {
    const {
      id,
      label,
      showLabel,
      children,
      className,
      size,
      value,
      defaultValue,
      disabled,
      onChange,
      ...rest
    } = this.props;

    return (
      <div className={cx("Checkbox", className, size, { disabled })}>
        <input
          type="checkbox"
          id={id || this.id}
          checked={value}
          defaultChecked={defaultValue}
          disabled={disabled}
          onChange={this.onChange}
        />
        <label htmlFor={id || this.id} {...rest}>
          <span className="element" />
          <span className={cx("label__text", { "sr-only": !showLabel })}>
            {label}
          </span>
        </label>
      </div>
    );
  }
}
