import { useReducer } from "react";

export function useForceUpdate() {
  return useReducer((i) => ++i % 10000, 0)[1];
}
