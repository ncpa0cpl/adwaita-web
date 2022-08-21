import cx from "clsx";
import React from "react";
import type { PageSwitcherPage } from "../../dist";

export type { PageSwitcherPage };

export type PageSwitcherProps = {
  className?: string;
  pages: Array<PageSwitcherPage>;
  mainPage?: number;
  activePage?: number;
  transition?: "horizontal" | "vertical" | "opacity" | false;
  expand?: boolean;
  padded?: boolean;
  useMainPageDimensions?: boolean | "width" | "height";
  style?: React.CSSProperties;
};

export class PageSwitcher extends React.Component<PageSwitcherProps> {
  static defaultProps = {
    transition: "horizontal",
    expand: false,
    useMainPageDimensions: false,
  };

  activePage: React.MutableRefObject<HTMLDivElement | null>;
  mustSetIsSwitching?: boolean;

  override state: {
    activePage?: number;
    isSwitching: boolean;
    width?: number;
    height?: number;
  };

  constructor(props: PageSwitcherProps) {
    super(props);
    this.activePage = React.createRef();
    this.state = {
      activePage: props.activePage,
      isSwitching: false,
      width: undefined,
      height: undefined,
    };
  }

  getPagesToRender(): number[] {
    const { activePage: activePageProp, transition } = this.props;
    const { activePage } = this.state;

    if (transition === false)
      return activePageProp !== undefined ? [activePageProp] : [];

    const pages = Array.from(
      new Set(
        [activePage, activePageProp].filter((n): n is number => n !== undefined)
      )
    );
    pages.sort(compare);

    return pages;
  }

  override componentDidUpdate() {
    if (this.mustSetIsSwitching) {
      this.mustSetIsSwitching = false;
      requestAnimationFrame(() => {
        this.setState({ isSwitching: true });
      });
    }
  }

  onTransitionEnd = () => {
    this.setState({
      isSwitching: false,
      activePage: this.props.activePage,
    });
  };

  onRef = (ref: HTMLDivElement) => {
    this.activePage.current = ref;
    if (!ref) return;
    const { activePage, useMainPageDimensions, mainPage } = this.props;
    const isMainPage = activePage === mainPage;

    if (useMainPageDimensions === false && !isMainPage) return;

    const { width, height } = this.activePage.current.getBoundingClientRect();
    const state: Partial<typeof this.state> = {};
    if (
      isMainPage ||
      useMainPageDimensions === true ||
      useMainPageDimensions !== "width"
    )
      state.width = width;
    if (
      isMainPage ||
      useMainPageDimensions === true ||
      useMainPageDimensions !== "height"
    )
      state.height = height;
    this.setState(state);
  };

  override render() {
    const {
      className,
      pages,
      activePage: activePageProp,
      mainPage,
      transition,
      expand,
      padded,
      style,
      useMainPageDimensions,
      ...rest
    } = this.props;
    const { activePage, isSwitching, width, height } = this.state;

    const renderedPages = this.getPagesToRender();

    const activePageValue = isSwitching ? activePageProp : activePage;

    if (activePage !== activePageProp && !isSwitching) {
      this.mustSetIsSwitching = true;
    }

    const containerStyle = !expand ? style : { width, height, ...style };

    return (
      <div
        className={cx(
          "PageSwitcher",
          className,
          transition,
          !useMainPageDimensions
            ? undefined
            : useMainPageDimensions === true
            ? "use-both"
            : `use-${useMainPageDimensions}`,
          { expand }
        )}
        style={containerStyle}
        {...rest}
      >
        {renderedPages.map((n) => (
          <div
            key={pages[n]?.key || n}
            className={cx("PageSwitcher__page", {
              active: n === activePageValue,
              main: n === mainPage,
              padded,
            })}
            onTransitionEnd={this.onTransitionEnd}
            ref={expand && n === activePageValue ? this.onRef : undefined}
          >
            {pages[n]?.content}
          </div>
        ))}
      </div>
    );
  }
}

// Helpers

function compare(a: number, b: number) {
  return a - b;
}
