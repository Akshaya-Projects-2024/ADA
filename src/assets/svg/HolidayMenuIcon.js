import React from "react";
import Svg, { Path } from "react-native-svg";
const HolidayMenuIcon = (props) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m10.78 5.22-9.447 9.447M10.78 5.22A1.886 1.886 0 1 0 8 2.68a1.885 1.885 0 1 0-2.78 2.54m5.56 0A1.886 1.886 0 1 1 13.32 8a1.885 1.885 0 1 1-2.54 2.78M2.68 8a1.885 1.885 0 1 1 2.54-2.78m0 0 5.56 5.56m0 0A1.885 1.885 0 1 1 8 13.32a1.885 1.885 0 1 1-2.78-2.54A1.887 1.887 0 1 1 2.667 8"
      stroke="#FD9F00"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default HolidayMenuIcon;
