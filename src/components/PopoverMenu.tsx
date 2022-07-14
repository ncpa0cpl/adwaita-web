import React, { useState } from "react";
import { hasKey } from "../utils/hasKey";

import useControlled from "../utils/useControlled";
import { PageSwitcher } from "./PageSwitcher";
import { Popover } from "./Popover";

export type PageSwitcherPage = {
  key: string | number;
  label?: React.ReactNode;
  content: React.ReactNode;
  closable?: boolean;
};

export type PopoverMenuProps = {
  pages: (params: {
    close(): void;
    back(): void;
    change(key: string): void;
  }) => PageSwitcherPage[];
  open?: boolean;
  onChangeOpen?: (open: boolean) => void;
  className?: string;
  arrow?: boolean;
  children: React.ReactNode;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "right"
    | "right-start"
    | "right-end"
    | "left"
    | "left-start"
    | "left-end";
  align?: "right" | "left";
  method?: "mouseover" | "click" | "click-controlled" | "none";
  width?: "trigger" | "trigger-min";
  delay?: number;
  shouldUpdatePlacement?: boolean;
  shouldAttachEarly?: boolean;
};

export function PopoverMenuImpl({
  children,
  pages: getPages,
  open: openProp,
  onChangeOpen,
  ...rest
}: PopoverMenuProps) {
  const [page, setPage] = useState(0);
  const [isOpen, setOpen] = useControlled(openProp, false, onChangeOpen);

  const controls = {
    close: () => setOpen(false),
    back: () => setPage(0),
    open: () => setOpen(true),
    change: (key: string) =>
      setPage(
        pages.findIndex(
          (p) =>
            typeof p === "object" && p !== null && hasKey(p, "key") && p.key === key
        )
      ),
  };

  const pages = getPages(controls);

  const content: React.ReactElement = (
    <PageSwitcher
      expand
      transition="horizontal"
      pages={pages}
      activePage={page}
      mainPage={0}
      useMainPageDimensions="width"
    />
  );

  return (
    <Popover
      placement="bottom"
      {...rest}
      open={isOpen}
      content={content}
      onOpen={controls.open}
      onClose={controls.close}
      onDidClose={controls.back}
    >
      {children}
    </Popover>
  );
}

export const PopoverMenu = PopoverMenuImpl;
