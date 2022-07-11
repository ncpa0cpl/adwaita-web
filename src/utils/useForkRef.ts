/*
 * useForkRef.js
 * source: https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/utils/useForkRef.js
 */

import * as React from "react";
import setRef from "./setRef";

type Ref<T = undefined> = {
  current: T;
};

export default function useForkRef<T>(
  refA: undefined | null | ((r: T) => void) | Ref<T>,
  refB?: null | ((r: T) => void) | Ref<T>
) {
  /**
   * This will create a new function if the ref props change and are defined. This
   * means react will call the old forkRef with `null` and the new forkRef with the
   * ref. Cleanup naturally emerges from this behavior
   */
  return React.useMemo(() => {
    if (!refA && !refB) {
      return null;
    }
    return (refValue: T) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
