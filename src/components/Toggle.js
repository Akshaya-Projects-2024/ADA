import React from "react";
import { Pressable } from "react-native";

import SwitchOnIcon from "../assets/svg/providerSwitch.svg";
import SwitchOffIcon from "../assets/svg/parentSwitch.svg";

const Toggle = ({ state = false, onPress, style = {} }) => {
  return (
    <Pressable style={style} onPress={onPress}>
      {state ? <SwitchOnIcon /> : <SwitchOffIcon />}
    </Pressable>
  );
};

export default Toggle;
