import { format, isEqual, parse } from "date-fns";
import React, { useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import { XOfficeCalendar } from "../icons";

import useControlled from "../utils/useControlled";
import { Calendar } from "./Calendar";
import type { InputProps } from "./Input";
import { Input } from "./Input";
import { Popover } from "./Popover";

export type { InputProps };

export type DatePickerProps = {
  /** A date object */
  value?: Date;
  /** A date object */
  defaultValue?: Date;
  /** A function that receives a date object */
  onChange?: (value: Date | null) => void;
  /** A string that represents the date format */
  format?: string;
} & Omit<
  InputProps,
  "onChange" | "iconAfter" | "value" | "onFocus" | "onBlur" | "defaultValue"
>;

export function DatePicker({
  format: formatString = "d MMM yyyy",
  value: valueProp,
  defaultValue,
  onChange,
  ...rest
}: DatePickerProps) {
  const calendarRef = useRef<React.ReactInstance | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useControlled<Date | null>(
    valueProp,
    defaultValue,
    onChange
  );
  const [inputValue, setInputValue] = useState(
    value ? format(value, formatString) : ""
  );

  const onInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const onCalendarChange = (date: Date) => {
    setValue(date);
    setInputValue(format(date, formatString));
    setOpen(false);
  };

  const onBlur = (ev: React.FocusEvent) => {
    // Skip click inside calendar
    const calendar = findDOMNode(calendarRef.current);
    if (calendar && calendar.contains(ev.relatedTarget)) return;

    const newValue =
      inputValue === "" ? null : parse(inputValue, formatString, new Date());
    const isNewValue =
      (newValue === null || !Number.isNaN(+newValue)) &&
      (!value || !newValue || !isEqual(value, newValue));
    if (isNewValue) {
      setValue(newValue);
      setInputValue(newValue ? format(newValue, formatString) : "");
    } else if (value) {
      setInputValue(format(value, formatString));
    }

    setOpen(false);
  };

  // @ts-ignore
  const popover = <Calendar onChange={onCalendarChange} ref={calendarRef} />;

  return (
    <Popover open={open} content={popover} className="DatePicker__popover">
      <Input
        className="DatePicker__input"
        iconAfter={XOfficeCalendar}
        placeholder="Pick a date"
        value={inputValue}
        onChange={onInputChange}
        onFocus={() => setOpen(true)}
        onBlur={onBlur}
        {...rest}
      />
    </Popover>
  );
}
