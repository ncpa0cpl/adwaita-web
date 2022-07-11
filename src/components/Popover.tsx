import type Popper from "@popperjs/core";
import { createPopper } from "@popperjs/core";
import cx from "clsx";
import React from "react";
import { createPortal, findDOMNode } from "react-dom";

const noop = () => {};

function getInversePlacement(
  p: Exclude<PopoverProps["placement"], undefined>
): "top" | "bottom" | "left" | "right" {
  if (p.startsWith("top")) return "bottom";
  if (p.startsWith("left")) return "right";
  if (p.startsWith("right")) return "left";
  return "top";
}

export type PopoverProps = {
  className?: string;
  open?: boolean;
  arrow?: boolean;
  content: React.ReactNode | (() => React.ReactNode);
  children: React.ReactNode;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "right"
    | "right-start"
    | "right-end"
    | "left"
    | "left-start"
    | "left-end";
  align?: "right" | "left";
  method?: "mouseover" | "click" | "click-controlled" | "none";
  width?: "trigger" | "trigger-min";
  delay?: number;
  shouldUpdatePlacement?: boolean;
  shouldAttachEarly?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onDidOpen?: () => void;
  onDidClose?: () => void;
};

type PopoverState = {
  open: boolean;
  closing: boolean;
  actualPlacement: PopoverProps["placement"];
  styles: React.CSSProperties;
};

export class Popover extends React.PureComponent<PopoverProps> {
  static defaultProps = {
    arrow: true,
    placement: "bottom",
    align: "right",
    method: "click",
    delay: 200,
    shouldUpdatePlacement: true,
    onOpen: noop,
    onClose: noop,
    onDidOpen: noop,
    onDidClose: noop,
  };

  domNode: HTMLElement;
  isDomNodeAttached: boolean;
  isEventListening: boolean;
  openTimeout: number | undefined;
  closeTimeout: number | undefined;

  triggerRef: React.MutableRefObject<Element | null>;
  popoverRef: React.MutableRefObject<HTMLElement | null>;
  arrowRef: React.MutableRefObject<HTMLDivElement | null>;

  observer: ResizeObserver;
  popper: Popper.Instance | undefined;

  override state: PopoverState;

  constructor(props: PopoverProps) {
    super(props);

    this.domNode = document.createElement("div");
    this.domNode.className = "Popover__domNode";

    this.isDomNodeAttached = false;
    this.isEventListening = false;

    this.openTimeout = undefined;
    this.closeTimeout = undefined;

    this.state = {
      open: false,
      closing: false,
      actualPlacement: props.placement,
      styles: {},
    };

    this.triggerRef = React.createRef();
    this.popoverRef = React.createRef();
    this.arrowRef = React.createRef();

    this.observer = new ResizeObserver(this.onContentResize);
  }

  override componentWillUnmount() {
    this.detachDomNode();
    this.detachPopper();
  }

  override componentDidMount() {
    this.attachPopper();
    if (this.props.shouldAttachEarly) this.attachDomNode();
  }

  override componentDidUpdate(prevProps: PopoverProps, prevState: PopoverState) {
    if (prevProps.open !== this.props.open || prevState.open !== this.state.open) {
      if (this.props.shouldUpdatePlacement && this.popper) this.popper.update();
    }
  }

  attachDomNode() {
    if (!this.isDomNodeAttached) {
      document.body.append(this.domNode);
      document.addEventListener("click", this.onDocumentClick);
      this.isDomNodeAttached = true;
      // We need the classes to be applied before to enable the fade-in transition
      this.forceUpdate();
    }
  }

  detachDomNode() {
    if (this.isDomNodeAttached) {
      document.body.removeChild(this.domNode);
      document.removeEventListener("click", this.onDocumentClick);
      this.isDomNodeAttached = false;
    }
  }

  attachPopper() {
    if (!this.popoverRef.current || !this.triggerRef.current) return;

    if (this.popper) return;

    this.popper = createPopper(
      this.triggerRef.current,
      this.popoverRef.current,
      this.getPopperOptions()
    );
  }

  detachPopper() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = undefined;
    }
  }

  updatePopperOptions() {
    if (!this.popper) return;
    this.popper.setOptions(this.getPopperOptions());
  }

  getPopperOptions(): Partial<
    Popper.OptionsGeneric<Partial<Popper.Modifier<any, any>>>
  > {
    const hasArrow = this.props.arrow;
    const isOpen = this.isOpen();
    this.isEventListening = isOpen;
    return {
      placement: this.props.placement,
      modifiers: [
        {
          name: "arrow",
          enabled: hasArrow,
          options: {
            element: this.arrowRef.current,
            padding: 15,
          },
        },
        {
          /* Offset from the trigger */
          name: "offset",
          options: {
            offset: [0, hasArrow ? 10 : 0],
          },
        },
        {
          /* Avoids touching the edge of the window */
          name: "preventOverflow",
          options: {
            altAxis: true,
            padding: 10,
          },
        },
        {
          /* Custom modifier */
          name: "eventListeners",
          enabled: isOpen,
        },
        {
          /* Custom modifier */
          name: "updateComponentState",
          enabled: true,
          phase: "write",
          fn: this.onUpdatePopper,
        },
      ],
    };
  }

  onContentResize = () => {
    if (this.popper) this.popper.update();
  };

  onRefPopover = (ref: HTMLDivElement) => {
    if (!ref) {
      if (this.popoverRef.current) {
        this.observer.unobserve(this.popoverRef.current);
        this.popoverRef.current = null;
      }
      return;
    }
    this.popoverRef.current = ref;
    this.observer.observe(this.popoverRef.current);
  };

  onDocumentClick = (ev: MouseEvent) => {
    if (this.props.method !== "click" && this.props.method !== "click-controlled")
      return;

    if (!this.isOpen()) return;

    if (
      !(
        (ev.target && this.triggerRef.current?.contains(ev.target as Node)) ||
        (ev.target && this.popoverRef.current?.contains(ev.target as Node))
      )
    )
      this.close();
  };

  onTransitionEnd = () => {
    this.setState({ closing: false });
    if (this.state.open && this.props.onDidOpen) this.props.onDidOpen();
    else if (this.props.onDidClose) this.props.onDidClose();
  };

  onUpdatePopper = ({ state }: Popper.ModifierArguments<any>) => {
    if (this.state.actualPlacement !== state.placement) {
      this.setState({ actualPlacement: state.placement });
    }

    if (this.props.width) {
      const trigger = state.elements.reference;
      const rect = trigger.getBoundingClientRect();

      if (this.props.width === "trigger") {
        const currentWidth = this.state.styles.width;
        const newWidth = rect.width - 1;

        if (currentWidth !== newWidth)
          this.setState({ styles: { width: newWidth } });
      } else if (this.props.width === "trigger-min") {
        const currentWidth = this.state.styles.minWidth;
        const newWidth = rect.width - 1;

        if (currentWidth !== newWidth)
          this.setState({ styles: { minWidth: newWidth } });
      }
    }
  };

  onClick = (ev: React.MouseEvent<HTMLElement>) => {
    /* React bubbles event in portals up to the containing element */
    if (!this.triggerRef.current?.contains(ev.target as Node)) return;

    if (this.isOpen()) this.close();
    else this.open();
  };

  onMouseOver = () => {
    if (this.closeTimeout) {
      window.clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }

    if (this.state.open === false) {
      // is closed
      if (!this.props.delay) {
        this.open();
      } else {
        this.openTimeout = window.setTimeout(() => {
          this.open();
        }, this.props.delay);
      }
    }
  };

  onMouseOut = () => {
    if (this.openTimeout) {
      window.clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }

    if (this.state.open) {
      if (!this.props.delay) {
        this.close();
      } else {
        this.closeTimeout = window.setTimeout(() => {
          this.close();
        }, this.props.delay);
      }
    }
  };

  isControlled = () => {
    return "open" in this.props;
  };

  open = () => {
    if (this.props.open && this.state.open) return;

    // This allows for call this.open() when props.open is true
    if (this.isControlled()) {
      if (this.props.open === false) {
        if (this.props.onOpen) return this.props.onOpen();
        return;
      }
    }

    this.attachDomNode();
    this.updatePopperOptions();
    this.openTimeout = undefined;
    this.setState({ open: true });

    if (!this.isControlled()) {
      if (this.props.onOpen) return this.props.onOpen();
    }
  };

  close = () => {
    if (this.isControlled()) {
      if (this.props.open === true) {
        if (this.props.onOpen) return this.props.onOpen();
        return;
      }
    }
    this.updatePopperOptions();
    this.setState({ open: false, closing: true });
    if (!this.isControlled()) {
      if (this.props.onClose) this.props.onClose();
    }
  };

  isOpen() {
    return this.props.open ?? this.state.open;
  }

  getContent() {
    return !this.isDomNodeAttached
      ? null
      : typeof this.props.content === "function"
      ? this.props.content()
      : this.props.content;
  }

  getEventListeners() {
    const { method } = this.props;
    return method === "mouseover"
      ? { onMouseOver: this.onMouseOver, onMouseOut: this.onMouseOut }
      : method === "click"
      ? { onClick: this.onClick }
      : {};
  }

  override render() {
    const { method, arrow, children, className } = this.props;
    const { actualPlacement, styles, closing } = this.state;
    const open = this.isOpen();
    const trigger = children;

    if (this.props.open && !this.state.open) setTimeout(this.open, 0);

    if (open !== this.isEventListening) this.updatePopperOptions();

    const triggerProps = trigger
      ? typeof trigger === "object" && trigger !== null
        ? "props" in trigger
          ? trigger.props
          : {}
        : {}
      : {};

    const eventListeners = this.getEventListeners();
    const props = {
      ...triggerProps,
      ...eventListeners,
      className: cx(
        triggerProps.className,
        open ? "with-popover" : undefined,
        open ? `popover-${actualPlacement}` : undefined
      ),
      ref: (node: HTMLElement) => {
        if (node) this.triggerRef.current = findDOMNode(node) as Element;
        if (
          typeof trigger === "object" &&
          trigger &&
          "ref" in trigger &&
          typeof trigger["ref"] === "function"
        )
          (trigger as { ref: Function }).ref(node);
      },
    };

    const arrowPlacement = getInversePlacement(actualPlacement ?? "top");
    const popoverEventListeners =
      method === "mouseover" ? eventListeners : undefined;
    const popoverClassName = cx(
      "Popover popover",
      className,
      actualPlacement,
      arrow ? `arrow-${arrowPlacement}` : undefined,
      { open, arrow, closing }
    );

    return (
      <>
        {typeof trigger === "object" &&
          trigger !== null &&
          !Array.isArray(trigger) &&
          React.cloneElement(trigger as React.ReactElement, props)}
        {createPortal(
          <div
            ref={this.onRefPopover}
            className={popoverClassName}
            onTransitionEnd={this.onTransitionEnd}
            {...popoverEventListeners}
          >
            <div className="Popover__wrapper">
              {arrow && (
                <div
                  className={cx("Popover__arrow", arrowPlacement)}
                  ref={this.arrowRef}
                />
              )}
              <div className="Popover__container" style={styles}>
                <div className="Popover__content">{this.getContent()}</div>
              </div>
            </div>
          </div>,
          this.domNode
        )}
      </>
    );
  }
}
