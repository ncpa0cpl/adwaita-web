import { hasKey } from "./hasKey";

type Widen<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

export const getPropAndCastOr = <T>(
  obj: any,
  prop: string,
  defaultValue: T
): Widen<T> => {
  if (hasKey(obj, prop)) {
    return obj[prop] as Widen<T>;
  }
  return defaultValue as Widen<T>;
};
