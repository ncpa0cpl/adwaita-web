import React from "react";

export type SeparatorProps = React.PropsWithChildren<JSX.IntrinsicElements["div"]>;

export function Separator(props?: SeparatorProps) {
  return <div {...props} className="separator" role="separator" />;
}
