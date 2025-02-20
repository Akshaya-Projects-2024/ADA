import React from "react";
import Svg, { G, Path } from "react-native-svg";
const ClockSvg = (props) => (
  <Svg
    width={props?.width || 24}
    height={props?.height || 24}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G
      stroke={props?.stroke || "#fff"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M15.166 7.999A6.67 6.67 0 0 1 8.5 14.665 6.67 6.67 0 0 1 1.833 8 6.67 6.67 0 0 1 8.5 1.332a6.67 6.67 0 0 1 6.666 6.667" />
      <Path d="M10.973 10.121 8.906 8.888c-.36-.214-.653-.727-.653-1.147V5.008" />
    </G>
  </Svg>
);
export default ClockSvg;
