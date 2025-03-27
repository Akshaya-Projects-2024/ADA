import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import ArrowDown from "../../../assets/svg/arrowDown.svg";
import Cross from "../../../assets/svg/cross.svg";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../../../assets/theme/themes";
import Feather from "react-native-vector-icons/AntDesign";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import Contact from "../../../assets/svg/contact";

const ContactDropdown = (props) => {
  const {
    data,
    setSelectedValue,
    selectedValue,
    title,
    placeholderText,
    multiSelect = false,
    noPadding,
    showScroll = false,
    customContainerStyle = {},
    label,
    onDone,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState({});
  const [filterData, setFilterData] = useState(data);
  const [searchText, setSearchText] = useState("");

  const toggleRoleSelection = (item) => {
    const newSelectedValue = { ...selectedId };
    if (!selectedId[item.id]) {
      newSelectedValue[item.id] = item;
    } else {
      delete newSelectedValue[item.id];
    }
    setSelectedId(newSelectedValue);
  };

  useEffect(() => {
    setSelectedId({});
  }, [modalVisible]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        selectedId?.[item.id] ? styles.selectedOption : null,
      ]}
      onPress={() => {
        toggleRoleSelection(item);
      }}
    >
      <View style={{ flexDirection: "column" }}>
        <Text numberOfLines={1} style={styles.nameText}>
          {item.label}
        </Text>
        <Text numberOfLines={1} style={styles.optionText}>
          {item.id}
        </Text>
      </View>
      {selectedId?.[item.id] && (
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
        <Text
          style={{
            fontFamily: THEMES.fontFamily.medium,
            fontSize: THEMES.fonts.font14,
            color: THEMES.colors.black,
          }}
        >
          No Data Available
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      {/* Button to open modal */}
      <TouchableOpacity
        style={[customContainerStyle]}
        onPress={() => {
          setSearchText("");
          setFilterData(data);
          setModalVisible(true);
        }}
      >
        <InputField
          placeholderText={placeholderText}
          label={label}
          onChange={(text) => {}}
          value=""
          rightIcon={
            <View style={{ flexDirection: "row" }}>
              <Contact stroke="red" strokeWidth={1} />
            </View>
          }
          editable={false}
        />
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
        avoidKeyboard={true}
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

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#CFD3D4",
                borderRadius: 8,
                paddingHorizontal: 16,
                backgroundColor: "#fff",
                paddingVertical: 8,
                fontSize: 16,
                fontFamily: THEMES.fontFamily.regular,
                marginBottom: 10,
              }}
              placeholder="Search"
              onChangeText={(text) => {
                setSearchText(text);
                const filteredData = data.filter(
                  (item) =>
                    item.label.toLowerCase().includes(text.toLowerCase()) ||
                    item.id.toLowerCase().includes(text.toLowerCase())
                );
                setFilterData(filteredData);
              }}
              value={searchText}
            />

            <FlatList
              data={filterData}
              ListEmptyComponent={renderEmptyView}
              renderItem={renderItem}
              keyExtractor={(item) => item.id + item.label}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            />
            {multiSelect && (
              <View style={{ paddingTop: moderateScale(20) }}>
                <Button
                  disabled={!Object.keys(selectedId)?.length}
                  title="Done"
                  onPress={() => {
                    setModalVisible(false);
                    onDone(Object.values(selectedId));
                  }}
                />
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
    paddingTop: moderateScale(3),
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
    maxHeight: 500,
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
  nameText: {
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
});

export default ContactDropdown;
