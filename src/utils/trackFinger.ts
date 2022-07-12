export function trackFinger(
  event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent,
  touchId: { current?: number }
) {
  if ("touches" in event) {
    if (touchId.current !== undefined && event.changedTouches) {
      for (const i in event.changedTouches) {
        const touch = event.changedTouches[i];
        if (touch?.identifier === touchId.current) {
          return {
            x: touch.clientX,
            y: touch.clientY,
          };
        }
      }

      return false;
    }

    return {
      x: event.touches[0]!.clientX,
      y: event.touches[0]!.clientY,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}
