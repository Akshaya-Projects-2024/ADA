import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Filter from "../../assets/svg/listFilter.svg";
import BlackCross from "../../assets/svg/cross.svg";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import FilterModal from "../../components/FilterModal";
import Modal from "react-native-modal";
import { moderateScale, ms } from "react-native-size-matters";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { showToast, validArray } from "../../utils/utils";
import {
  completeAppointment,
  confirmAppointment,
  getAllAppointment,
} from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { useIsFocused } from "@react-navigation/native";
import AppointmentCard from "../../components/AppointmentCard";
import moment from "moment";
import Dialog from "../../components/Dialog";
import { contextValue } from "../../components/Loader";
import EmptyView from "../../components/EmptyView";
import { SafeAreaView } from "react-native-safe-area-context";

const MyBookings = ({ navigation, route }) => {
  const routeFrom = route?.params?.route;
  const isToday = route?.params?.isToday;
  const focus = useIsFocused();
  const menuRef = useRef(null);
  const [data, setData] = useState([]);
  const [filetedData, setFiletedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isVisible, setVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState();
  const [attendedModal, setAttendedModal] = useState(false);
  const [appointmentConfirm, setAppointmentConfirm] = useState(false);
  const [otpInput, setOtpInput] = useState();

  const filterOptions = ["Daily", "Weekly", "Monthly", "Custom"];
  const dataFetched = useRef(false);
  useEffect(() => {
    if (!focus) {
      setVisible(false);
      setAttendedModal(false);
      setAppointmentConfirm(false);
      setOtpInput("");
      setSelectedItem();
    } else {
      initData();
    }
  }, [focus, initData]);

  useEffect(() => {
    if (selectedFilter === "Daily" || isToday) {
      const today = moment().format("YYYY-MM-DD");
      const output = data?.filter((it) => {
        return it?.appointment_date === today;
      });
      setFiletedData(output || []);
    } else {
      setFiletedData(data || []);
    }
    contextValue?.setLoader(false);
  }, [data, selectedFilter, isToday]);

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

  useEffect(() => {
    contextValue?.setLoader(true);
  },[])

  const initData = useCallback(async () => {
    try {
      const userId = await decryptService("userId");
      const params = {
        userid: userId,
        usertype:
          routeFrom && routeFrom === "parentAccount" ? "parent" : "provider", //parent
      };
      const res = await getAllAppointment(params);
      if (res?.status === 200) {
        dataFetched.current = true;
        const output = res?.data?.data;
        if (validArray(output)) {
          setData(output);
        } else {
          setData([]);
        }
      }
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  }, [routeFrom]);

  const handleAttended = async () => {
    try {
      contextValue?.setLoader(true);
      if (!selectedItem) {
        throw new Error("Please select the appointment!");
      } else if (!otpInput) {
        throw new Error("Please enter OTP first!");
      } else {
        const params = {
          appointment_id: selectedItem?.appointment_id,
          parent_id: selectedItem?.parentdetails?.userid,
          provider_id: selectedItem?.provider_id,
          otp: otpInput,
        };
        const res = await completeAppointment(params);
        if (res?.status === 200) {
          setVisible(false);
          setAttendedModal(false);
          setAppointmentConfirm(false);
          setOtpInput("");
          setSelectedItem();
          initData();
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const confirm = async () => {
    try {
      contextValue?.setLoader(true);
      if (!selectedItem) {
        throw new Error("Please select the appointment!");
      } else {
        const params = {
          appointment_id: selectedItem?.appointment_id,
          parent_id: selectedItem?.parentdetails?.userid,
          provider_id: selectedItem?.provider_id,
        };
        const res = await confirmAppointment(params);
        if (res?.status === 200) {
          setVisible(false);
          setAttendedModal(false);
          setAppointmentConfirm(false);
          setOtpInput("");
          setSelectedItem();
          initData();
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const onAppointmentClose = () => {
    setAppointmentConfirm(false);
    setSelectedItem();
  };

  const onCancel = () => {
    navigation.navigate("cancelAppointment", {
      selectedItem: selectedItem,
    });
  };

  const onReschedule = () => {
    navigation.navigate("rescheduleAppointment", {
      selectedItem: selectedItem,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <AppointmentCard
        item={item}
        routeFrom={routeFrom}
        setAttendedModal={setAttendedModal}
        setSelectedItem={setSelectedItem}
        setVisible={setVisible}
        setAppointmentConfirm={setAppointmentConfirm}
      />
    );
  };

  const EmptyContentView = () => {
    return (
      <View
        style={{ flex: 0.85, justifyContent: "center", alignItems: "center" }}
      >
        <Text
          style={{
            color: "#000",
            fontSize: moderateScale(16),
            fontWeight: 500,
          }}
        >
          No scheduled apointments.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={Strings.appointments}
          showBack
          bgColor="transparent"
          right={
            <View ref={menuRef} onLayout={handleModalLayout}>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Filter width={ms(24)} height={ms(24)}/>
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.mainView}>
          <FlatList
            data={validArray(filetedData) ? filetedData : data}
            showsVerticalScrollIndicator={false}
            bounces={false}
            renderItem={renderItem}
            keyExtractor={(item) => item?.appointment_id?.toString()}
            ListEmptyComponent={!dataFetched.current ? null :EmptyContentView}
            contentContainerStyle={{ flexGrow: 1 }}
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
            ListEmptyComponent={!dataFetched.current ? null :EmptyView}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </FilterModal>
        <Modal
          onBackdropPress={() => {
            setVisible(false);
            setSelectedItem();
          }}
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
                  width: "70%",
                  lineHeight: moderateScale(24),
                }}
              >
                Need to Change Your Plans?
              </Text>
              <TouchableOpacity
                hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                onPress={() => {
                  setVisible(false);
                  setSelectedItem();
                }}
              >
                <BlackCross />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.regular,
                fontSize: THEMES.fonts.font14,
                paddingTop: moderateScale(16),
                lineHeight: moderateScale(20),
              }}
            >
              Do you want to cancel the appointment, or would you like to
              reschedule it instead?
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
                <Button onlyBorder title="Cancel" onPress={() => onCancel()} />
              </View>
              <View style={{ width: "45%" }}>
                <Button title="Reschedule" onPress={() => onReschedule()} />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          onBackButtonPress={() => {
            setAttendedModal(false);
            setSelectedItem();
            setOtpInput("");
          }}
          onBackdropPress={() => {
            setAttendedModal(false);
            setSelectedItem();
            setOtpInput("");
          }}
          isVisible={attendedModal}
          backdropOpacity={0.5}
          style={{
            margin: 0,
            borderRadius: 16,
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              borderTopRightRadius: 49,
              paddingVertical: moderateScale(20),
              backgroundColor: THEMES.colors.white,
            }}
          >
            <Text
              style={{
                color: THEMES.colors.black,
                paddingHorizontal: moderateScale(31),
                fontFamily: THEMES.fontFamily.semiBold,
              }}
            >
              Enter OTP to confirm
            </Text>
            <View
              style={{
                paddingTop: moderateScale(36),
                marginHorizontal: moderateScale(24),
              }}
            >
              <InputField
                label={"Enter otp"}
                placeholderText={"Enter otp"}
                value={otpInput}
                onChange={setOtpInput}
              />

              <View style={{ paddingTop: moderateScale(20) }}>
                <Button onPress={handleAttended} title="Attended" />
              </View>
            </View>
          </View>
        </Modal>
        <Dialog
          flag={appointmentConfirm}
          description={Strings.confirmAppointmentMessage}
          leftButtonText="No"
          rightButtonText="Yes"
          leftButtonPressed={onAppointmentClose}
          rightButtonPressed={confirm}
          onClose={onAppointmentClose}
        />
      </View>
    </SafeAreaView>
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
    flex: 1,
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
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  otp: {
    fontSize: THEMES.fonts.font12,
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
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: THEMES.colors.cyan,
    borderWidth: 1,
  },
});

export default MyBookings;
