import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import ArrowDown from "../assets/svg/arrowDown.svg";
import Cross from "../assets/svg/cross.svg";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";
import Feather from "react-native-vector-icons/AntDesign";
import Button from "./Button";

const ModalDropdown = (props) => {
  const {
    data,
    setSelectedValue,
    selectedValue,
    title,
    placeholder,
    multiSelect = false,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const toggleRoleSelection = (role) => {
    if (multiSelect) {
      if (selectedValue?.includes(role)) {
        setSelectedValue(selectedValue?.filter((item) => item !== role)); // Remove if already selected
      } else {
        if (selectedValue) {
          setSelectedValue([...selectedValue, role]); // Add if not selected
        } else {
          setSelectedValue([role]); // Add if not selected
        }
      }
    } else {
      setSelectedValue([role]);
      setModalVisible(false);
    }

    // setSelectedValue(role);
    // setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        selectedValue?.includes(item.label) ? styles.selectedOption : null,
      ]}
      onPress={() => toggleRoleSelection(item.label)}
    >
      <Text numberOfLines={1} style={styles.optionText}>
        {item.label}
      </Text>
      {selectedValue?.includes(item.label) && (
        <Feather size={20} name="checkcircle" color={THEMES.colors.green} />
      )}
    </TouchableOpacity>
  );

  const renderEmptyView = () => {
    return (
      <View
        style={{
          alignItems: "center",
          paddingVertical: moderateScale(20),
          justifyContent: "center",
        }}
      >
        <Text>No Data Available</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Button to open modal */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={{ width: "90%" }}>
          <Text
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font10,
              color: THEMES.colors.darkGrey,
            }}
          >
            {placeholder}
          </Text>
          <Text numberOfLines={1} style={styles.dropdownButtonText}>
            {selectedValue?.length > 0 ? selectedValue?.join(", ") : title}
          </Text>
        </View>
        <ArrowDown width={25} height={25} />
      </TouchableOpacity>

      {/* Modal for dropdown */}
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        transparent={true}
        animationType="none"
        style={{
          margin: 0,
        }}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                onPress={() => setModalVisible(false)}
              >
                <Cross />
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              ListEmptyComponent={renderEmptyView}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
            {multiSelect && (
              <View style={{ paddingTop: moderateScale(20) }}>
                <Button title="Done" onPress={() => setModalVisible(false)} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dropdownButton: {
    height: 56,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,

  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: moderateScale(20),
  },
  modalContent: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 450,
  },
  modalTitle: {
    fontSize: THEMES.fonts.font16,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
  },
  selectedOption: {
    backgroundColor: "#e0f7fa",
  },
  checkMark: {
    fontSize: 16,
    color: "green",
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalDropdown;
