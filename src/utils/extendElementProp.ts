export type Rewrap<T> = T extends Function
  ? T
  : T extends object
  ? T extends infer O
    ? {
        [K in keyof O as string extends K
          ? never
          : number extends K
          ? never
          : K]: O[K];
      }
    : never
  : T;

export type ExtendElementProps<
  E extends keyof JSX.IntrinsicElements,
  P extends object
> = P & Omit<JSX.IntrinsicElements[E], keyof P | "ref">;
