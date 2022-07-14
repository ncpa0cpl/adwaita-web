import cx from "clsx";
import React from "react";
import { onlyText } from "react-children-utilities";
import type { ExtendElementProps } from "../utils/extendElementProp";

export type HeadingProps<A extends keyof JSX.IntrinsicElements> = ExtendElementProps<
  A,
  {
    as?: A;
    className?: string;
    weight?: 100 | 300 | 400 | 700 | 900;
    anchor?: boolean;
  }
>;

const defaultProps = {
  as: "h1",
  anchor: true,
};

export function HeadingImpl<A extends keyof JSX.IntrinsicElements>({
  as,
  children,
  className,
  weight,
  anchor,
  ...rest
}: HeadingProps<A>) {
  const Component = as as string;
  const id = anchor ? toID(onlyText(children)) : undefined;
  return (
    <Component
      id={id}
      className={cx("Heading", className, weight ? `weight-${weight}` : undefined)}
      {...rest}
    >
      {anchor && (
        <a className="Heading__anchor link" href={`#${id}`}>
          #
        </a>
      )}
      {children}
    </Component>
  );
}

export const Heading = HeadingImpl;

HeadingImpl.defaultProps = defaultProps;

function toID(string: string) {
  return string.toLowerCase().replace(/\W+/g, "-");
}
