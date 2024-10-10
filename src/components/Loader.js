import React from "react";

import ModalView from "react-native-modal";

import LoaderGif from "../assets/images/loading.gif";

import { LoadingImage, LoadingView } from "./styles";
import { ActivityIndicator,Text, Image, View } from "react-native";
import { THEMES } from "../assets/theme/themes";

const modalStyle = {
  justifyContent: "center",
  alignItems: "center",
};

const Loader = (props) => {
  const { isVisible } = props;

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        alignItems:'center',
        justifyContent:'center',

      }}
    >
      <ActivityIndicator color={THEMES.colors.cyan}/>
    </View>
    // <ModalView
    //   animationIn="zoomIn"
    //   style={modalStyle}
    //   backdropOpacity={0.3}
    //   isVisible={isVisible}
    // >
    //   <View
    //     style={{
    //       width: 80,
    //       height: 80,
    //       alignItems: "center",
    //       justifyContent: "center",
    //       borderColor: "transparent",
    //       borderRadius: 20,
    //       backgroundColor: THEMES.colors.white,
    //       borderWidth: 1,
    //     }}
    //   >
    //     {isVisible &&   <ActivityIndicator color={THEMES.colors.cyan}/>}

    //   </View>
    // </ModalView>
  );
};

export default Loader;
