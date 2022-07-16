/*
 * Dropdown.js
 */

import cx from "clsx";
import React from "react";
import { PanDown } from "../icons";

import { Button } from "./Button";
import { Input } from "./Input";
import { Label } from "./Label";
import { Menu } from "./Menu";
import { Popover } from "./Popover";
import { Separator } from "./Separator";

export type DropdownOption<T> = {
  value: T;
  label: React.ReactNode;
  data?: any;
};

export type DropdownProps<T> = {
  id?: string;
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  size?: "mini" | "small" | "medium" | "large" | "huge" | "mega" | "mega";
  align?: "left" | "right";
  label?: React.ReactNode;
  value?: T;
  options?: Array<DropdownOption<T>>;
  disabled?: boolean;
  loading?: boolean;
  open?: boolean;
  allowClear?: boolean;
  input?: boolean;
  filterKey?: string;
  filter?: (option: any, filter?: string) => boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onChange?: (value: T | undefined) => void;
};

export class Dropdown<T extends string | number | boolean> extends React.Component<
  DropdownProps<T>
> {
  static Item = Menu.Item;
  static Button = Menu.Button;
  static Separator = Separator;

  static defaultProps = {
    size: "medium",
    align: "right",
    disabled: false,
    options: [],
  };

  static getDerivedStateFromProps(props: DropdownProps<any>) {
    if ("open" in props) return { open: props.open };
    return null;
  }

  domNode: HTMLDivElement;
  trigger?: HTMLButtonElement | HTMLDivElement;

  lastValue: T | undefined;
  lastOption: DropdownOption<T> | undefined;
  lastOptions: Array<DropdownOption<T>> | undefined;
  lastRenderedOptions: Array<DropdownOption<T>> | undefined;
  lastRenderedOptionsArgs: Array<
    | string
    | ((option: any, filter?: string | undefined) => boolean)
    | DropdownOption<T>[]
    | undefined
  >;

  override state: {
    value: T | undefined;
    selectedOption: DropdownOption<T> | undefined;
    open: boolean;
    position: {
      top: number;
      left: number;
    };
    inputValue: string;
    previousInputValue: string;
  };

  constructor(props: DropdownProps<T>) {
    super(props);

    this.domNode = document.createElement("div");
    document.body.append(this.domNode);

    this.lastRenderedOptions = [];
    this.lastRenderedOptionsArgs = [];

    this.state = {
      value: undefined,
      selectedOption: undefined,
      open: false,
      position: { top: 0, left: 0 },
      inputValue: "",
      previousInputValue: "",
    };
  }

  override componentWillUnmount() {
    document.body.removeChild(this.domNode);
  }

  onInputBlur = () => {
    setTimeout(this.close, 200);
  };

  onInputChange = (inputValue: string) => {
    this.setState({ inputValue });
  };

  onInputAccept = () => {
    const options = this.getRenderedOptions();
    if (options.length === 0) return;
    const option = options[0];
    this.select(option!);
    if (this.trigger) {
      this.trigger.querySelector("input")?.blur();
    }
  };

  onToggle = () => {
    if (this.state.open) this.close();
    else this.open();
  };

  open = () => {
    if (this.props.onOpen) this.props.onOpen();
    else this.setState({ open: true });
  };

  close = () => {
    if (this.props.onClose) this.props.onClose();
    else this.setState({ open: false });

    if (this.props.input && this.state.inputValue) {
      this.setState({ inputValue: "", previousInputValue: this.state.inputValue });
    }
  };

  isOpen = () => {
    return "open" in this.props ? this.props.open : this.state.open;
  };

  isControlled = () => {
    return "value" in this.props;
  };

  select = (option: DropdownOption<T> | null) => {
    if (this.isControlled()) {
      if (this.props.onChange)
        this.props.onChange(option ? option.value : undefined);
    } else {
      this.setState({ value: option?.value, selectedOption: option });
    }
    this.close();
  };

  getValue() {
    if (this.isControlled()) return this.props.value;
    return this.state.value;
  }

  getRenderedOptions(): DropdownOption<T>[] {
    const { options: optionsProp, filterKey, filter } = this.props;
    const open = this.isOpen();
    const { inputValue, previousInputValue } = this.state;
    const value = open ? inputValue : previousInputValue;

    // Memoization
    // IMPORTANT: variables used below must be include in `args`
    const args = [optionsProp, value, filterKey, filter];
    if (args.every((a, i) => this.lastRenderedOptionsArgs[i] === a)) {
      return this.lastRenderedOptions ?? [];
    }

    let options;
    if (!value) {
      options = optionsProp;
    } else {
      const needle = value.toLowerCase();
      options =
        optionsProp?.filter((o) => {
          const optionValue = filterKey
            ? o.data[filterKey]
            : filter
            ? filter(o)
            : typeof o.label === "string"
            ? o.label
            : o.value;
          return String(optionValue).toLowerCase().includes(needle);
        }) ?? [];
    }

    this.lastRenderedOptionsArgs = args;
    this.lastRenderedOptions = options;
    return options ?? [];
  }

  getSelectedOption() {
    const value = this.getValue();
    if (value === this.lastValue && this.props.options === this.lastOptions)
      return this.lastOption;
    const option = this.props.options!.find((o) => o.value === value);
    if (option) {
      this.lastValue = value;
      this.lastOption = option;
      this.lastOptions = this.props.options;
      return option;
    }
    return undefined;
  }

  override render() {
    const {
      className,
      triggerClassName,
      size,
      align,
      placeholder,
      label: labelValue,
      value: _value,
      options: _options,
      disabled,
      loading,
      open: _open,
      allowClear,
      input,
      filterKey,
      filter,
      onClose,
      onOpen,
      onChange: _onChange,
      ...rest
    } = this.props;
    const open = this.isOpen();
    const value = this.getValue();
    const label =
      labelValue || this.getSelectedOption()?.label || placeholder || value;

    let trigger;

    if (!input) {
      const buttonClassName = cx("Dropdown Box horizontal", className, size, {
        open,
        hover: open,
      });
      trigger = (
        <Button
          size={size}
          className={buttonClassName}
          loading={loading}
          disabled={disabled}
          onClick={this.onToggle}
          ref={(ref) => ref && (this.trigger = ref)}
          {...rest}
        >
          <Label align="left" className="Box__fill">
            {label}
          </Label>
          <PanDown containerProps={{ className: "Dropdown__arrow" }} />
        </Button>
      );
    } else {
      const { inputValue } = this.state;
      const inputClassName = cx("Dropdown", className, size, {
        open,
        hover: open,
      });
      trigger = (
        <Input
          className={inputClassName}
          loading={loading}
          disabled={disabled}
          value={inputValue}
          onFocus={this.open}
          onBlur={this.onInputBlur}
          onChange={this.onInputChange}
          onAccept={this.onInputAccept}
          iconAfter={PanDown}
          ref={(ref) => ref && (this.trigger = ref)}
          {...rest}
        >
          {wrapLabel(label)}
        </Input>
      );
    }

    const options = this.getRenderedOptions();
    const actualChildren = options.map((o) => (
      <Menu.Button
        key={o.value.toString()}
        selected={String(o.value) === String(value)}
        onClick={() => this.select(o)}
      >
        {o.label}
      </Menu.Button>
    ));

    if (actualChildren.length === 0)
      actualChildren.push(
        <Menu.Item key="empty_item">
          <Label muted italic>
            No option found
          </Label>
        </Menu.Item>
      );

    if (allowClear) {
      actualChildren.unshift(
        <Menu.Button key="null_item" onClick={() => this.select(null)}>
          <Label muted italic>
            None
          </Label>
        </Menu.Button>
      );
    }

    const popoverClassName = cx("Dropdown__menu", size);
    const menu = <Menu className={popoverClassName}>{actualChildren}</Menu>;

    return (
      <Popover
        className="Dropdown__menu"
        method="click-controlled"
        width="trigger"
        arrow={false}
        open={open}
        content={menu}
        onClose={this.close}
        shouldUpdatePlacement={open}
      >
        {trigger}
      </Popover>
    );
  }
}

// Helpers

function wrapLabel(label: React.ReactNode) {
  if (typeof label !== "string") return label;
  return (
    <Label align="left" fill="width" ellipsis>
      {label}
    </Label>
  );
}
