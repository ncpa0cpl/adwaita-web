import cx from "clsx";
import React, { useState } from "react";
import type { ExtendElementProps } from "../utils/extendElementProp";

import { Button } from "./Button";
import { Label } from "./Label";
import type { PageSwitcherProps } from "./PageSwitcher";
import { PageSwitcher } from "./PageSwitcher";

const noop = () => {};

export type NotebookProps = ExtendElementProps<
  "div",
  {
    position?: "top" | "bottom" | "left" | "right";
    transition?: PageSwitcherProps["transition"];
    arrows?: boolean;
    className?: string;
    value?: number;
    pages: PageSwitcherProps["pages"];
    action?: React.ReactNode;
    onChange: (value: number) => void;
    onClose: (pageIndex: number) => void;
  }
>;

export function Notebook({
  className,
  position,
  transition,
  value: activePageValue,
  arrows,
  pages,
  action,
  onChange,
  onClose,
  ...rest
}: NotebookProps) {
  const orientation =
    position === "top" || position === "bottom" ? "horizontal" : "vertical";
  const isHorizontal = orientation === "horizontal";

  const isControlled = activePageValue !== undefined;
  const [activePageState, setActivePage] = useState(0);
  const setPage = isControlled ? onChange : setActivePage;

  let activePage = isControlled ? activePageValue : activePageState;
  if (activePage >= pages.length) {
    activePage = pages.length - 1;
    setPage(activePage);
  }

  const previousPage = () => setPage(activePage - 1);
  const nextPage = () => setPage(activePage + 1);

  return (
    <div className={cx("Notebook", className, position)} {...rest}>
      <div className={cx("Notebook__header", position)}>
        <div className="Notebook__tabs">
          {arrows && (
            <Button
              className="Notebook__arrow"
              icon={isHorizontal ? "pan-start" : "pan-up"}
              disabled={activePage === 0}
              onClick={previousPage}
            />
          )}
          {pages.map((page, i) => (
            <div
              key={page.key}
              className={cx("Notebook__tab", {
                selected: i === activePage,
                reorderable: true,
              })}
              role="button"
              tabIndex={0}
              onClick={() => setPage(i)}
            >
              <Label>{page.label}</Label>
              {page.closable && (
                <Button
                  size="small"
                  icon="window-close"
                  tabIndex={-1}
                  onClick={(ev) => (ev.stopPropagation(), onClose(i))}
                />
              )}
            </div>
          ))}
          {arrows && (
            <Button
              className="Notebook__arrow"
              icon={isHorizontal ? "pan-end" : "pan-down"}
              disabled={activePage >= pages.length - 1}
              onClick={nextPage}
            />
          )}
        </div>
        {action && <div className="Notebook__action">{action}</div>}
      </div>
      <div className="Notebook__content">
        <PageSwitcher
          pages={pages}
          activePage={activePage}
          transition={
            transition ??
            (position === "top" || position === "bottom" ? "horizontal" : "vertical")
          }
        />
      </div>
    </div>
  );
}

Notebook.defaultProps = {
  position: "top",
  arrows: false,
  onChange: noop,
  onClose: noop,
};
