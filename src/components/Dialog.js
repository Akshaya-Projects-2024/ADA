import React from "react";
import Modal from "react-native-modal";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ms } from "react-native-size-matters";

import Cross from "../assets/svg/cross.svg";
import { THEMES } from "../assets/theme/themes";
import Button from "./Button";

const Dialog = ({
  flag,
  onClose,
  title = "",
  description = "",
  leftButtonText = "",
  rightButtonText = "",
  leftButtonPressed,
  rightButtonPressed,
}) => {
  const { width, height } = useWindowDimensions();
  const styles = StyleSheet.create({
    modalContainer: {
      margin: 0,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: THEMES.colors.backdropColor,
    },
    root: {
      width: width * 0.75,
      minHeight: height * 0.1,
      backgroundColor: THEMES.colors.white,
      borderRadius: ms(16),
      padding: ms(12),
      elevation: 5,
      zIndex: 5,
      justifyContent: "space-between",
    },
    crossIcon: {
      paddingHorizontal: ms(12),
      paddingTop: ms(12),
      justifyContent: "space-between",
      flexDirection: "row",
      width: "100%",
    },
    titleText: {
      fontSize: THEMES.fonts.font20,
      color: THEMES.colors.black,
      fontFamily: THEMES.fontFamily.bold,
    },
    descriptionText: {
      fontSize: THEMES.fonts.font16,
      color: THEMES.colors.black,
      fontFamily: THEMES.fontFamily.regular,
    },
    container: {
      paddingTop: ms(7.5),
      paddingHorizontal: ms(12),
      paddingBottom: ms(12),
    },
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
      padding: ms(6),
      gap: ms(12),
    },
  });
  return (
    <Modal
      onBackdropPress={onClose}
      transparent={true}
      animationType="none"
      style={styles.modalContainer}
      visible={flag}
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable onPress={onClose} style={styles.crossIcon}>
          <Text style={styles.titleText}>{title}</Text>
          <Cross />
        </Pressable>
        <View style={styles.container}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        {(leftButtonText && typeof leftButtonPressed === "function") ||
        (rightButtonText && typeof rightButtonPressed === "function") ? (
          <View style={styles.buttonContainer}>
            {leftButtonText && typeof leftButtonPressed === "function" ? (
              <Button
                title={leftButtonText}
                onPress={leftButtonPressed}
                isFlex
                onlyBorder
              />
            ) : null}
            {rightButtonText && typeof rightButtonPressed === "function" ? (
              <Button
                title={rightButtonText}
                onPress={rightButtonPressed}
                isFlex
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

export default Dialog;
