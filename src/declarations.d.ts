declare module "*.scss" {
  const styles: string;
  export default styles;
}

declare module "*.svg" {
  const SVG: React.ComponentType<
    React.SVGProps<SVGSVGElement> & {
      colored?: boolean;
      containerProps?: JSX.IntrinsicElements["span"];
    }
  >;
  export default SVG;
}
