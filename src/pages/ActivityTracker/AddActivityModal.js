import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useCallback } from "react";
import InputField from "../../components/InputField";
import Modal from "react-native-modal";
import { THEMES } from "../../assets/theme/themes";
import Button from "../../components/Button";

const { fontFamily, fonts, colors } = THEMES;

const AddActivityModal = ({
  activityModalVisible,
  toggleactivityModal,
  handleActivitySubmit,
}) => {
  const [activityName, setActivityName] = useState("");

  return (
    <Modal
      isVisible={activityModalVisible}
      onBackdropPress={toggleactivityModal}
      onBackButtonPress={toggleactivityModal}
      swipeDirection="down"
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Activity Name</Text>
        <InputField
          placeholderText="Enter Activity Name"
          onChange={setActivityName}
          value={activityName}
        />
        <View style={{ marginBottom: 30 }} />
        <Button
          title="Save"
          disabled={!activityName}
          onPress={() => handleActivitySubmit(activityName)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddActivityModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: "transparent",
  },
  container: {
    flex: 0.3,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopRightRadius: 49,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fonts.font16,
    color: colors.black,
    marginBottom: 30,
  },
});
