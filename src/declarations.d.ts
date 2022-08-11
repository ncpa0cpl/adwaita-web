declare module "*.scss" {
  const styles: string;
  export default styles;
}

declare module "*.svg" {
  import type { ColorDefinition } from "./icons";
  const SVG: React.ComponentType<
    React.SVGProps<SVGSVGElement> & {
      colored?: boolean | ColorDefinition;
      containerProps?: JSX.IntrinsicElements["span"];
    }
  >;
  export default SVG;
}
