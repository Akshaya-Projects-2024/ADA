import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import Filter from "../../assets/svg/listFilter.svg";
import Check from "../../assets/svg/check.svg";
import Cross from "../../assets/svg/redCross.svg";
import BlackCross from "../../assets/svg/cross.svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";
import Header from "../../components/Header";
import FilterModal from "../../components/FilterModal";
import Modal from "react-native-modal";
import { moderateScale } from "react-native-size-matters";
import CancelAppointment from "../Appointment/cancelAppointment";
import RescheduleAppointment from "../Appointment/rescheduleAppointment";
import Button from "../../components/Button";

const Data = [
  {
    id: 1,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh1",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 2,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 3,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: true,
  },
  {
    id: 4,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 5,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 6,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: true,
  },
  {
    id: 7,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 8,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 9,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: true,
  },
];

const MyBookings = (props) => {
  const menuRef = useRef(null);
  const [data, setData] = useState(Data);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isVisible, setVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Daily");

  const filterOptions = ["Daily", "Weekly", "Monthly", "Custom"];

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setModalVisible(false);
  };
  const modalHeight = useMemo(
    () => menuPosition?.x + menuPosition?.height + menuPosition?.height / 2,
    [menuPosition?.height, menuPosition?.x]
  );
  const modalWidth = useMemo(
    () => menuPosition?.y + menuPosition?.width - menuPosition?.width / 2,
    [menuPosition?.width, menuPosition?.y]
  );

  const handleModalLayout = () => {
    menuRef?.current.measure((x, y, widthX, heightY) => {
      setMenuPosition({ x: x, y: y, width: widthX, height: heightY });
    });
  };
  const handleCancel = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, isCanceled: true, isConfirmed: false }
          : item
      )
    );
    setSelectedItemId(id);
  };

  const handleConfirm = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, isConfirmed: true, isCanceled: false }
          : item
      )
    );
    setSelectedItemId(id);
  };

  const confirmAppointment = (id) => {
    handleConfirm(id);
  };

  const handleOnConfirm = (id) => {
    Alert.alert(
      "",
      "Are you sure you want to confirm this appointment?",
      [
        {
          text: "No",
          style: "cancel",
        },
        { text: "Yes", onPress: () => confirmAppointment(id) },
      ],
      { cancelable: false }
    );
  };

  const onCancel = () => {
    setVisible(false);
    setTimeout(() => {
      props.navigation.navigate("cancelAppointment");
    }, 500);
  };

  const onReschedule = () => {
    setVisible(false);
    setTimeout(() => {
      props.navigation.navigate("rescheduleAppointment");
    }, 500);
  };

  const renderItem = ({ item }) => {
    let itemBackgroundColor = THEMES.colors.white;
    if (item.isCanceled) {
      itemBackgroundColor = "#fee9e9";
    } else if (item.isConfirmed) {
      itemBackgroundColor = "#f0ffe6";
    } else if (item.isSeduled) {
      itemBackgroundColor = "#feefd4";
    }
    let itemtextColor = THEMES.colors.black;
    if (item.isCanceled) {
      itemtextColor = "#F4511E";
    } else if (item.isConfirmed) {
      itemtextColor = "#6DAE43";
    } else if (item.isSeduled) {
      itemtextColor = "#FD9F00";
    }
    return (
      <Pressable
        onPress={() => {
          setSelectedItemId(item.id);
          props.navigation.navigate("appointmentDetail");
        }}
        style={[styles.flatlistView, { backgroundColor: itemBackgroundColor }]}
      >
        {!item.isSeduled && !item.isCanceled && !item.isConfirmed ? (
          <View style={styles.tagView}>
            <Text style={styles.tagText}>New</Text>
          </View>
        ) : null}

        <View style={styles.flatlistContent}>
          <View style={styles.flatListRow}>
            <View style={styles.flatListImgView}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fffff",
                }}
              >
                <Image
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 32 / 2,
                  }}
                  source={require("../../assets/images/profileImg.png")}
                />
              </View>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <Image
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 32 / 2,
                  }}
                  source={require("../../assets/images/profileImg.png")}
                />
              </View>
            </View>

            <View
              style={{
                marginHorizontal: moderateScale(8),
                paddingVertical: moderateScale(5),
              }}
            >
              <Text style={[styles.name]}>{item.name}</Text>
              <View style={styles.flatListNameRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={[
                      styles.profileTypeText,
                      { paddingRight: moderateScale(3) },
                    ]}
                  >
                    {item.category}
                  </Text>
                  <Text style={styles.profileTypeText}>|</Text>
                  <Text
                    style={[
                      styles.profileTypeText,
                      ,
                      { paddingLeft: moderateScale(3) },
                    ]}
                  >
                    {item.visitType}
                  </Text>
                </View>

                {item.isCanceled ? (
                  <Text style={[(styles.statusText, { color: itemtextColor })]}>
                    Canceled
                  </Text>
                ) : item.isConfirmed ? (
                  <Text style={(styles.statusText, { color: itemtextColor })}>
                    Confirmed
                  </Text>
                ) : item.isSeduled ? (
                  <Text
                    style={
                      (styles.statusText,
                      {
                        color: itemtextColor,
                      })
                    }
                  >
                    Rescheduled
                  </Text>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => setVisible(true)}>
                      <Cross width={24} height={24} />
                    </Pressable>
                    <Pressable
                      style={{ marginLeft: moderateScale(12) }}
                      onPress={() => handleOnConfirm(item.id)}
                    >
                      <Check width={24} height={24} />
                    </Pressable>
                  </View>
                )}
              </View>
              <View style={styles.flatListNameRow}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.visitTypeText,
                      {
                        marginRight: moderateScale(5),
                        textDecorationLine: item.isSeduled
                          ? "line-through"
                          : "none",
                      },
                    ]}
                  >
                    {item.visitDay}
                  </Text>
                  <Text
                    style={[
                      styles.visitTypeText,
                      {
                        marginRight: moderateScale(5),
                        textDecorationLine: item.isSeduled
                          ? "line-through"
                          : "none",
                      },
                    ]}
                  >
                    |
                  </Text>
                  <Text
                    style={[
                      styles.visitTypeText,
                      {
                        textDecorationLine: item.isSeduled
                          ? "line-through"
                          : "none",
                      },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
                {item.isSeduled && (
                  <Text style={styles.visitTypeText}>26th JUN @ 11:00 AM</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />

      <Header
        title={Strings.appointments}
        showBack
        bgColor="transparent"
        right={
          <View ref={menuRef} onLayout={handleModalLayout}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Filter />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.mainView}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          bounces={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <FilterModal
        isModalVisible={modalVisible}
        top={modalHeight}
        right={modalWidth}
        onPressClose={() => setModalVisible(false)}
      >
        <FlatList
          data={filterOptions}
          showsVerticalScrollIndicator={false}
          bounces={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleFilterSelect(item)}
              style={[
                styles.filterOption,
                item === selectedFilter && styles.selectedFilterOption,
              ]}
            >
              <Text style={styles.filterOptionText}>{item}</Text>
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </FilterModal>
      <Modal
        onBackdropPress={() => setVisible(false)}
        isVisible={isVisible}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          borderRadius: 16,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: THEMES.colors.bgColor,
            paddingVertical: moderateScale(24),
            paddingHorizontal: moderateScale(24),
            borderRadius: 16,
            marginHorizontal: moderateScale(30),
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.bold,
                fontSize: THEMES.fonts.font16,
                width:'70%',
                lineHeight: moderateScale(24)
              }}
            >
              Need to Change Your Plans?
            </Text>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              onPress={() => setVisible(false)}
            >
              <BlackCross />
            </TouchableOpacity>
          </View>
          <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.regular,
                fontSize: THEMES.fonts.font14,
                paddingTop:moderateScale(16),
                lineHeight: moderateScale(20)
              }}
            >
             Do you want to cancel the appointment, or would you like to reschedule it instead?
            </Text>
            <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: moderateScale(31),
            }}
          >
            <View style={{ width: "45%" }}>
              <Button
                onlyBorder
                title="Cancel"
                onPress={() => onCancel()}
              />
            </View>
            <View style={{ width: "45%" }}>
              <Button
                title="Reschedule"
                
                onPress={() => onReschedule()}
              />
            </View>
            </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  mainView: {
    flex: 1,
    paddingTop: moderateScale(30),
    paddingHorizontal: moderateScale(20),
  },
  flatlistView: {
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: THEMES.colors.lightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: moderateScale(10),
    paddingVertical: moderateScale(2),
  },
  flatlistContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
  },
  flatListRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatListImgView: {
    width: 55,
    height: 55,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  filterModalItem: { color: "black" },
  flatListNameRow: {
    flexDirection: "row",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  visitTypeText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  statusConfmText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  statusCancleText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  statusText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.bold,
  },
  filterOption: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    backgroundColor: THEMES.colors.white,
  },
  selectedFilterOption: {
    backgroundColor: "#ebebeb",
  },
  filterOptionText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
  },
  selectedFilterText: {
    fontFamily: THEMES.fontFamily.regular,
  },
  tagView: {
    backgroundColor: "#f2e2f4",
    position: "absolute",
    paddingVertical: moderateScale(3),
    paddingHorizontal: moderateScale(8),
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: moderateScale(1),
  },
  tagText: {
    color: "#AB47BC",
    fontSize: THEMES.fonts.font9,
    fontWeight: "bold",
  },
  content: {
    padding: moderateScale(24),
    backgroundColor: THEMES.colors.white,
    borderTopStartRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default MyBookings;
