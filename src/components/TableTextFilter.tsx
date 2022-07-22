import React from "react";
import { Input } from "./Input";

export type TableTextFilterProps = {
  column: {
    id?: string;
    filterValue?: string;
    setFilter?: (filterValue: string) => void;
  };
};

export function TableTextFilter({
  column: { filterValue, setFilter, id },
}: TableTextFilterProps) {
  return (
    <Input
      allowClear
      size="small"
      id={id}
      value={filterValue || ""}
      onChange={setFilter}
    />
  );
}
