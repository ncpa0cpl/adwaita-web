import cx from "clsx";
import React, { useEffect, useMemo, useRef } from "react";
import type { Column } from "react-table";
import {
  useFilters,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import getScrollbarWidth from "scrollbar-size";
import { getPropAndCastOr } from "../utils/getPropAndCastOr";
import { hasKey } from "../utils/hasKey";

import { Box } from "./Box";
import { Button } from "./Button";
import type { DropdownOption } from "./Dropdown";
import { Dropdown } from "./Dropdown";
import { Icon } from "./Icon";
import { Input } from "./Input";

export type TableProps = {
  className?: string;
  columns: Array<Column<Record<string, string>>>;
  data: Array<Record<string, string>>;
  sortable?: boolean;
  filterable?: boolean;
};

export function Table({
  className,
  columns: columnsValue,
  data,
  sortable,
  filterable,
  ...rest
}: TableProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const defaultColumn = useMemo(() => ({ width: 150 }), []);
  const columns: ReadonlyArray<Column<Record<string, string>>> = useMemo(
    () => transformColumns(columnsValue),
    [columnsValue]
  );
  const scrollbarWidth = getScrollbarWidth();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      ...[
        filterable ? useFilters : undefined,
        sortable ? useSortBy : undefined,
        useResizeColumns,
        useFlexLayout,
      ].filter((v): v is any => Boolean(v))
    );

  const RenderRow = React.useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const row = rows[index];
      if (!row) {
        throw new Error("Row not found");
      }
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  const onScrollBody = (event: Event) => {
    const headers = document.getElementsByClassName("table__header");
    for (const index in headers) {
      const header = headers[index];
      if (header && event.target && hasKey(event.target, "scrollLeft"))
        header.scrollLeft = event.target.scrollLeft as number;
    }
  };

  useEffect(() => {
    const scrollContainer = bodyRef.current?.firstElementChild?.firstElementChild;
    if (!scrollContainer) return;
    scrollContainer.addEventListener("scroll", onScrollBody, { capture: true });
    return () => {
      scrollContainer.removeEventListener("scroll", onScrollBody);
    };
  }, [bodyRef.current]);

  return (
    <div {...getTableProps()} className={cx("table", className)} {...rest}>
      <div className="table__header">
        <div
          className="table__header__content"
          style={{
            paddingRight: scrollbarWidth,
            marginBottom: -scrollbarWidth,
          }}
        >
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                // @ts-ignore
                <div
                  className={cx("th", {
                    activatable: hasKey(column, "canSort") && column.canSort,
                  })}
                  {...column.getHeaderProps()}
                >
                  <Box
                    horizontal
                    compact
                    align
                    {...(sortable
                      ? hasKey(column, "getSortByToggleProps") &&
                        (column.getSortByToggleProps as any)()
                      : undefined)}
                  >
                    <Box.Fill>{column.render("Header")}</Box.Fill>
                    {hasKey(column, "canSort") && column.canSort && (
                      <Icon
                        type={Icon.Type.panDown}
                        className={cx("table__sortIcon", {
                          hidden: !hasKey(column, "isSorted") || !column.isSorted,
                          descending:
                            hasKey(column, "isSortedDesc") && column.isSortedDesc,
                        })}
                      />
                    )}
                  </Box>
                  {hasKey(column, "canResize") && column.canResize && (
                    <div
                      {...getPropAndCastOr(columns, "getResizerProps", () => ({}))()}
                      className={cx("table__resizer", {
                        isResizing: getPropAndCastOr(column, "isResizing", false),
                      })}
                    />
                  )}
                  {filterable && getPropAndCastOr(column, "canFilter", false) && (
                    <div className="table__filter">{column.render("Filter")}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div {...getTableBodyProps()} className="table__body" ref={bodyRef}>
        <AutoSizer>
          {({ width, height }) => (
            <FixedSizeList
              height={height}
              itemCount={rows.length}
              itemSize={28}
              width={width}
            >
              {RenderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

export type InputFilterProps = {
  column: {
    id?: string;
    filterValue?: string;
    setFilter?: (filterValue: string) => void;
  };
};

function InputFilter({ column: { filterValue, setFilter, id } }: InputFilterProps) {
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

export type DropdownFilterProps<T> = {
  column: {
    id?: string;
    filterValue?: T;
    setFilter?: (filterValue?: T) => void;
    options?: Array<DropdownOption<T>>;
  };
};

function DropdownFilter<T extends string | number | boolean>({
  column: { filterValue, setFilter, id, options },
}: DropdownFilterProps<T>) {
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
        icon={Icon.Type.windowClose}
        onClick={() => setFilter && setFilter(undefined)}
      />
    </Box>
  );
}

Table.InputFilter = InputFilter;
Table.DropdownFilter = DropdownFilter;

function transformColumns<T extends Record<string, any>>(cs: Array<T>): Array<T> {
  return cs.map((c) => {
    const nc = { ...c };

    if (hasKey(nc, "columns") && Array.isArray(nc.columns)) {
      nc.columns = transformColumns(nc.columns);
    } else {
      if (hasKey(nc, "filter") || hasKey(nc, "Filter"))
        Object.assign(nc, { disableFilters: false });

      if (nc.disableFilters !== false) Object.assign(nc, { disableFilters: true });
    }

    return nc;
  });
}