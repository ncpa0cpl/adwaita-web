import React from "react";

export type SeparatorProps = {};

export function SeparatorImpl(
  props?: SeparatorProps & JSX.IntrinsicElements["div"]
) {
  return <div {...props} className="separator" role="separator" />;
}

export const Separator = SeparatorImpl;
