export const hasKey = <O extends object, K extends string | number | symbol>(
  obj: O,
  key: K
): obj is O & Record<K, unknown> => {
  return obj && key in obj;
};
