import React from "react";
import { WindowClose } from "../icons";
import { Box } from "./Box";
import { Button } from "./Button";
import type { DropdownOption } from "./Dropdown";
import { Dropdown } from "./Dropdown";

export type TableDropdownFilterProps<T> = {
  column: {
    id?: string;
    filterValue?: T;
    setFilter?: (filterValue?: T) => void;
    options?: Array<DropdownOption<T>>;
  };
};

export function TableDropdownFilter<T extends string | number | boolean>({
  column: { filterValue, setFilter, id, options },
}: TableDropdownFilterProps<T>) {
  return (
    <Box horizontal compact className="DropdownFilter">
      <Dropdown<T>
        allowClear
        className="Box__fill"
        size="small"
        id={id}
        value={filterValue}
        onChange={setFilter}
        options={options}
      />
      <Button
        flat
        size="small"
        icon={WindowClose}
        onClick={() => setFilter && setFilter(undefined)}
      />
    </Box>
  );
}
