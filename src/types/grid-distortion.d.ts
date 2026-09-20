declare module "@/components/effects/GridDistortion" {
  import type { JSX } from "react";
  type GridDistortionProps = {
    grid?: number;
    mouse?: number;
    strength?: number;
    relaxation?: number;
    imageSrc?: string;
    className?: string;
  };
  const GridDistortion: (props: GridDistortionProps) => JSX.Element;
  export default GridDistortion;
}
