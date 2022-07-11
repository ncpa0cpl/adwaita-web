declare module "*.scss" {
  const styles: string;
  export default styles;
}

declare module "*.svg" {
  const SVG: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
