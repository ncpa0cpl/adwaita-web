import clsx from "clsx";
import React from "react";

export type InputGroupProps = React.PropsWithChildren<{
  className?: string;
}>;

/**
 * A container dedicated for input elements. Contained inputs will get joined
 * together to look like a single element.
 */
export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function Group({ children, className }: InputGroupProps, ref) {
    return (
      <div className={clsx("InputGroup linked", className)} ref={ref}>
        {children}
      </div>
    );
  }
);
