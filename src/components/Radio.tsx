import cx from "clsx";
import React from "react";

const noop = () => {};

let nextId = 1;

export type RadioProps = {
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  size?: "mini" | "small" | "medium" | "large" | "huge" | "mega";
  showLabel?: boolean;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
};

export class Radio extends React.Component<RadioProps> {
  static defaultProps = {
    showLabel: true,
    size: "medium",
    onChange: noop,
  };

  id: string;

  constructor(props: RadioProps) {
    super(props);
    this.id = `radio_${nextId++}`;
  }

  onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) this.props.onChange(ev.target.checked, ev);
  };

  override render() {
    const {
      id,
      name,
      label,
      showLabel,
      className,
      size,
      value,
      checked,
      defaultChecked,
      disabled,
      onChange,
      ...rest
    } = this.props;

    return (
      <div className={cx("Radio", className, size, { disabled })}>
        <input
          type="radio"
          id={id || this.id}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
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
