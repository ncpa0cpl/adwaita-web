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
  let widened = defaultValue as Widen<T>;

  if (hasKey(obj, prop)) {
    widened = obj[prop] as Widen<T>;
    if (typeof widened === "function") {
      widened = widened.bind(obj);
    }
  }

  return widened;
};
