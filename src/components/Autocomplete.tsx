import cx from "clsx";
import React, { useRef, useState } from "react";

import useControlled from "../utils/useControlled";
import { Box } from "./Box";
import { Expander } from "./Expander";
import { Input } from "./Input";
import { Label } from "./Label";
import { List } from "./List";
import { Popover } from "./Popover";

export type AutocompleteOption = { value: string | number; label: React.ReactNode };

/** Props for the Autocomplete component. */
export type AutocompleteProps = {
  className?: string;
  value?: string | number;
  defaultValue?: string | number;
  /** The options shown in the list */
  options: Array<AutocompleteOption>;
  /**
   * Enables basic filtering of options. Set to `false` if you want to implement your
   * own filtering.
   */
  enableFilter?: boolean;
  /**
   * Called when the value changes (may prevent the value from updating, in
   * conjuction with `value`)
   */
  onChange?: (value: string | number) => void;
  /** Called when the value changes (passive) */
  onSearch?: (value: string) => void;
};

/**
 * An autocomplete input that allows the user to select from a list of options.
 *
 * @Group Components
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
            <List.Item
              key={o.value}
              activatable
              onClick={() => select(o)}
              data-value={o.value}
            >
              {o.label || o.value}
            </List.Item>
          ))}
          {filteredOptions.length === 0 && (
            <List.Item key="empty">
              <Box justify>
                <Label muted italic>
                  (No results found)
                </Label>
              </Box>
            </List.Item>
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
          value={value ? value.toString() : undefined}
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
