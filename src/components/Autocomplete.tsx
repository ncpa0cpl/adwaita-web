import cx from "clsx";
import React, { useRef, useState } from "react";

import useControlled from "../utils/useControlled";
import { Box } from "./Box";
import { Expander } from "./Expander";
import { Input } from "./Input";
import { Label } from "./Label";
import { List } from "./List";
import { ListItem } from "./ListItem";
import { Popover } from "./Popover";

export type AutocompleteOption = {
  /**
   * The value associated with this option that will be given to the `onChange` and
   * `onSearch` callback's.
   */
  value: string | number;
  /** Label of this option as will be show in the autocomplete's list of all options. */
  label: React.ReactNode;
};

/** Props for the Autocomplete component. */
export type AutocompleteProps = {
  /** Class names that will be added to the input element. */
  className?: string;
  /** Current value shown in the Autocomplete Input. */
  value?: string | number;
  /** The default value that the input will be set to upon mount. */
  defaultValue?: string | number;
  /** A list of options shown to the user. */
  options: Array<AutocompleteOption>;
  /**
   * Enables basic filtering of options. Set to `false` if you want to implement your
   * own filtering.
   */
  enableFilter?: boolean;
  /**
   * Called when the value changes, event if the change was not directly triggered by
   * the user interaction with the input.
   */
  onChange?: (value: string | number) => void;
  /** Called when the value changes due to the user input. */
  onSearch?: (value: string) => void;
};

/**
 * Autocomplete is a normal input element enhanced with a list of options that are
 * shown when the user starts typing.
 */
export const Autocomplete = React.forwardRef(
  (
    {
      className,
      options = [],
      value: valueProp,
      defaultValue = "",
      enableFilter = true,
      onSearch,
      onChange: onChangeProp,
      ...rest
    }: AutocompleteProps,
    refProp: React.ForwardedRef<HTMLDivElement>
  ) => {
    const input = useRef<null | HTMLDivElement>(null);
    const [value, setValue] = useControlled(valueProp, defaultValue, onChangeProp);
    const [isFocused, setIsFocused] = useState(false);

    const open = isFocused && options.length > 0;
    const lowerCaseValue = value?.toString().toLowerCase();
    const filteredOptions =
      enableFilter === false
        ? options
        : options.filter(
            (o) =>
              lowerCaseValue &&
              o.value.toString().toLowerCase().includes(lowerCaseValue)
          );

    const onFocus = () => setIsFocused(true);
    const onBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
      const newValue = ev?.relatedTarget?.getAttribute("data-value");
      if (newValue) {
        setValue(newValue);
      }
      setIsFocused(false);
    };

    const elementClassName = cx("Autocomplete", className);

    const select = (option: AutocompleteOption) => {
      setValue(option.value);
      if (input.current) input.current.querySelector("input")?.blur();
    };

    const onChange = (newValue: string) => {
      setValue(newValue);
      if (onSearch) onSearch(newValue);
    };

    const onAccept = () => {
      if (filteredOptions.length > 0) {
        const opt = filteredOptions[0];
        if (opt) select(opt);
      }
    };

    const content = (
      <Expander open={open} fitContent>
        <List border={false} separators={false}>
          {filteredOptions.map((o) => (
            <ListItem
              key={o.value}
              activatable
              onClick={() => select(o)}
              data-value={o.value}
            >
              {o.label || o.value}
            </ListItem>
          ))}
          {filteredOptions.length === 0 && (
            <ListItem key="empty">
              <Box justify="center">
                <Label muted italic>
                  (No results found)
                </Label>
              </Box>
            </ListItem>
          )}
        </List>
      </Expander>
    );

    return (
      <Popover
        className="Autocomplete__popover"
        open={open}
        content={content}
        arrow={false}
        placement="bottom-start"
        width="trigger-min"
        shouldAttachEarly={true}
      >
        <Input
          className={elementClassName}
          value={value ? value.toString() : ""}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={onChange}
          onAccept={onAccept}
          {...rest}
          ref={(ref) => {
            input.current = ref;
            if (refProp) {
              if (typeof refProp === "function") refProp(ref);
              else refProp.current = ref;
            }
          }}
        />
      </Popover>
    );
  }
);
