import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

const FilterModal = (props) => {
  const { onPressClose, isModalVisible, top, right, children } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onPressClose}
      onBackButtonPress={onPressClose}
      onBackdropPress={onPressClose}
    >
      <TouchableOpacity
        style={styles.touchableModalContainer}
        onPress={onPressClose}
      >
        <View style={styles.modalView} top={top} right={right}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  touchableModalContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalView: {
    minWidth: 180,
    position: "absolute",
    top: (props) => (props.top ? props.top : 0),
    right: (props) => (props.right ? props.right : 0),

    backgroundColor: "#ffffff",

    paddingVertical: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#00000063",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default FilterModal;
