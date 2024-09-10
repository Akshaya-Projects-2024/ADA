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
} from "react-native";
import Filter from "../../assets/svg/listFilter.svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";
import Header from "../../components/Header";
import FilterModal from "../../components/FilterModal";
import { moderateScale } from "react-native-size-matters";

const Data = [
  {
    id: 1,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
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

const Chat = () => {
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
  console.log(menuPosition, modalHeight, modalWidth);

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

  const renderItem = ({ item }) => {
    let itemBackgroundColor = THEMES.colors.white;

    if (item.isCanceled) {
      itemBackgroundColor = "#fde9e8";
    } else if (item.isConfirmed) {
      itemBackgroundColor = "#f1ffe6";
    } else if (item.isSeduled) {
      itemBackgroundColor = "#feeed4";
    }
    let itemtextColor = THEMES.colors.black;
    if (item.isCanceled) {
      itemtextColor = "#e99173";
    } else if (item.isConfirmed) {
      itemtextColor = "#90c077";
    } else if (item.isSeduled) {
      itemtextColor = "#edbb5a";
    }
    return (
      <Pressable
        onPress={() => setSelectedItemId(item.id)}
        style={[styles.flatlistView, { backgroundColor: itemBackgroundColor }]}
      >
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
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
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
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                  }}
                  source={require("../../assets/images/profileImg.png")}
                />
              </View>
            </View>

            <View style={{ marginHorizontal: moderateScale(8) }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.flatListNameRow}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.profileTypeText}>{item.category}</Text>
                  <Text style={styles.profileTypeText}>|</Text>
                  <Text style={styles.profileTypeText}>{item.visitType}</Text>
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
                  <View style={{ flexDirection: "row" }}>
                    <Pressable onPress={() => handleCancel(item.id)}>
                      <Icon
                        name={"close-circle-outline"}
                        size={20}
                        color={"#e7ab90"}
                      />
                    </Pressable>
                    <Pressable
                      style={{ marginLeft: 5 }}
                      onPress={() => handleConfirm(item.id)}
                    >
                      <Icon
                        name={"check-circle-outline"}
                        size={20}
                        color={"#56c3cc"}
                      />
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
                <Text style={styles.visitTypeText}>26th Jun @ 11:00 AM</Text>
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
    shadowColor: "#ddd",
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
    paddingHorizontal: moderateScale(10),
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
    lineHeight: 24,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font10,
    color: "#323232",
    fontFamily: THEMES.fontFamily.regular,
  },
  visitTypeText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
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
    backgroundColor: "#d3d3d3",
  },
  filterOptionText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontWeight: "bold",
  },
  selectedFilterText: {
    fontWeight: "bold",
  },
});

export default Chat;
