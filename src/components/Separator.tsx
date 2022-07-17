import React from "react";

export type SeparatorProps = {};

export function Separator(props?: SeparatorProps & JSX.IntrinsicElements["div"]) {
  return <div {...props} className="separator" role="separator" />;
}
