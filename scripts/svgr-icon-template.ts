import type { Template } from "esbuild-plugin-svgr/node_modules/@svgr/babel-plugin-transform-svg-component/dist/index";

export const svgReactTemplate: Template = (variables, { tpl }) => {
  return tpl`
  ${variables.imports};
  import cx from "clsx";

  ${variables.interfaces};

  const ${variables.componentName} = (passedProps, ...restArgs) => {
      const { colored, containerProps = {}, ...rest } = passedProps;

      if(colored && typeof colored === "string") {
        if(!containerProps.style) {
          containerProps.style = {};
        }
        Object.assign(containerProps.style, {
          "--custom-icon-color": colored,
        });
      }

      const render = (${variables.props}) => /* @__PURE__ */ React.createElement(
        "span",
        {
          ...containerProps,
          className: cx("Icon", containerProps.className, { colored }),
        },
        ${variables.jsx}
      );

      return render(rest, ...restArgs);
  };

  ${variables.exports};
  `;
};
