export default function setRef<T>(
  ref: ((v: T) => any) | { current: T } | null | undefined,
  value: T
) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
