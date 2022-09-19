import cx from "clsx";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { trackFinger } from "../utils/trackFinger";

export const properties = {
  horizontal: {
    size: "width",
    position: "left",
    event: "x",
  } as const,
  vertical: {
    size: "height",
    position: "top",
    event: "y",
  } as const,
};

export type Orientation = keyof typeof properties;

export type PanedProps = React.PropsWithChildren<{
  className?: string;
  orientation?: Orientation;
  size?: number;
  defaultSize?: number;
  border?: boolean | "handle";
  fill?: boolean | "width" | "height";
  /**
   * Makes this component grow to fill the available space, requires the container to
   * be a flexbox to work.
   */
  grow?: boolean | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 999;
}>;

export class Paned extends React.Component<PanedProps> {
  static defaultProps = {
    orientation: "horizontal",
    border: true,
  };

  handle: React.MutableRefObject<HTMLDivElement | null>;
  touchId: number | undefined;

  override state: {
    size?: number;
    containerSize?: number;
  };

  constructor(props: PanedProps) {
    super(props);
    this.handle = React.createRef();
    this.touchId = undefined;
    this.state = {
      size: props.defaultSize,
      containerSize: undefined,
    };
  }

  removeEventListeners = () => {
    document.removeEventListener("mousemove", this.onTouchMove);
    document.removeEventListener("mouseup", this.onTouchEnd);
    document.removeEventListener("touchmove", this.onTouchMove);
    document.removeEventListener("touchend", this.onTouchEnd);
  };

  onTouchMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    const { orientation = "horizontal" } = this.props;

    const finger = trackFinger(event, { current: this.touchId });
    if (!finger) {
      this.removeEventListeners();
      return;
    }

    if (this.handle.current) {
      const handle = this.handle.current.getBoundingClientRect();
      const handlePosition = handle[properties[orientation].position];
      const mousePosition = finger[properties[orientation].event];

      const delta = mousePosition - handlePosition;

      this.setState({ size: (this.state.size ?? 0) + delta });
    }
  };

  onTouchEnd = () => {
    this.setState({ dragging: false });
    this.removeEventListeners();
  };

  onTouchStart = (event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.changedTouches[0];
    // A number that uniquely identifies the current finger in the touch session.
    this.touchId = touch?.identifier;
    this.setState({ dragging: true });
    document.addEventListener("touchmove", this.onTouchMove);
    document.addEventListener("touchend", this.onTouchEnd);
  };

  onMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    this.setState({ dragging: true });
    document.addEventListener("mousemove", this.onTouchMove);
    document.addEventListener("mouseup", this.onTouchEnd);
  };

  onKeyDown = (ev: React.KeyboardEvent) => {
    const { containerSize } = this.state;
    let size;
    switch (ev.key) {
      case "ArrowLeft":
      case "ArrowUp":
        size = (this.state.size ?? 0) - 4;
        break;
      case "ArrowRight":
      case "ArrowDown":
        size = (this.state.size ?? 0) + 4;
        break;
      default:
        return;
    }

    if (size < 0) size = 0;
    if (containerSize && size > containerSize) size = containerSize;
    this.setState({ size });

    ev.preventDefault();
  };

  updateContainerSize(dimensions: { width: number; height: number }) {
    const { orientation = "horizontal" } = this.props;

    const containerSize = dimensions[properties[orientation].size];
    if (this.state.size !== undefined && this.state.containerSize === containerSize)
      return;

    setTimeout(() => {
      this.setState({ containerSize });
      if (this.state.size === undefined) this.setState({ size: containerSize / 2 });
    }, 0);
  }

  override render() {
    const {
      children,
      className,
      orientation = "horizontal",
      border,
      fill,
      defaultSize,
      grow,
      ...rest
    } = this.props;
    const { size = 0 } = this.state;

    if (!Array.isArray(children) || children.length < 2)
      throw new Error("Paned: requires 2 children at least");

    return (
      <div
        className={cx(
          "Paned",
          className,
          orientation,
          typeof grow === "number" ? `grow-${grow}` : grow ? "grow" : undefined,
          {
            fill: fill === true,
            "fill-width": fill === "width",
            "fill-height": fill === "height",
            "border-none": border === false,
            "border-handle": border === "handle",
          }
        )}
        {...rest}
      >
        <AutoSizer>
          {(dimensions) => {
            this.updateContainerSize(dimensions);
            return (
              <div className={cx("Paned__wrapper", orientation)} style={dimensions}>
                <div className="Paned__pane" style={firstStyle(orientation, size)}>
                  {children[0]}
                </div>
                <div
                  className="Paned__handle"
                  role="separator"
                  aria-orientation={
                    orientation === "horizontal" ? "vertical" : "horizontal"
                  }
                  tabIndex={0}
                  onMouseDown={this.onMouseDown}
                  onTouchStart={this.onTouchStart}
                  onKeyDown={this.onKeyDown}
                  ref={this.handle}
                  style={handleStyle(orientation, size)}
                />
                <div
                  className="Paned__pane"
                  style={secondStyle(orientation, size, dimensions)}
                >
                  {children[1]}
                </div>
              </div>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}

function handleStyle(orientation: Orientation, size: number) {
  return {
    [properties[orientation].position]: size - 1,
  };
}

function firstStyle(orientation: Orientation, size: number) {
  return {
    [properties[orientation].size]: size,
  };
}

function secondStyle(
  orientation: Orientation,
  size: number,
  dimensions: {
    width: number;
    height: number;
  }
) {
  const totalSize = dimensions[properties[orientation].size];
  if (typeof totalSize !== "number" || typeof size !== "number") return undefined;
  const secondSize = totalSize - size;
  return {
    [properties[orientation].size]: secondSize,
  };
}
