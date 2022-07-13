import cx from "clsx";
import React from "react";

const noop = () => {};

const DEFAULT_LABELS = ["On", "Off"];

let nextId = 1;

export type SwitchProps = {
  id?: string;
  value?: boolean;
  className?: string;
  defaultValue?: boolean;
  disabled?: boolean;
  /** Not shown. For screen-readers only */
  label?: string;
  /** On/Off if `true`, or provide your own 2 labels */
  labels?: boolean | [string, string];
  size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
  onChange?: (value: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
};

export class Switch extends React.Component<SwitchProps> {
  static defaultProps = {
    size: "medium",
    labels: false,
    onChange: noop,
  } as const;

  id: string;

  constructor(props: SwitchProps) {
    super(props);
    this.id = `switch_${nextId++}`;
  }

  onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) this.props.onChange(ev.target.checked, ev);
  };

  override render() {
    const {
      id,
      label,
      labels: labelsValue,
      className,
      size,
      value,
      defaultValue,
      disabled,
      onChange,
      ...rest
    } = this.props;
    const labels = Array.isArray(labelsValue) ? labelsValue : DEFAULT_LABELS;

    return (
      <div className={cx("Switch", className, size, { disabled })}>
        <input
          type="checkbox"
          id={id || this.id}
          checked={value}
          defaultChecked={defaultValue}
          disabled={disabled}
          onChange={this.onChange}
          {...rest}
        />
        <label htmlFor={id || this.id}>
          {labelsValue && (
            <>
              <span>{labels[0]}</span>
              <em className="sr-only">{label}</em>
              <span>{labels[1]}</span>
            </>
          )}
        </label>
      </div>
    );
  }
}
