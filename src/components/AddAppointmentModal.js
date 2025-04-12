import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";
import InputField from "./InputField";
import SessionsForAppointment from "./SessionsForAppointment";
import { showToast } from "../utils/utils";
import { createAppointment } from "../redux-store/actions/auth";
import { contextValue } from "./Loader";
import { useUser } from "../api/UserContext";
import Toast from "react-native-toast-message";
import moment from "moment";
import { SESSION_TYPE } from "../pages/Services/selectAppointment";
import { decryptService } from "../utils/storageFunc";
import Button from "./Button";
import useKeyboardVisibility from "../hooks/useKeyboardVisibility";

const AppointmentModal = React.memo(({ isVisible, onClose, onSuccess }) => {
  const [clientName, setClientName] = useState("");
  const [petName, setPetName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { userData } = useUser();
  const [isSubmitPress, setIsSubmitPress] = useState(0);
  const isKeyboardVisible = useKeyboardVisibility();

  const handleSubmit = async (
    selectedDate,
    startDate,
    endDate,
    selectedSlot,
    sessionSelection
  ) => {
    try {
      contextValue?.setLoader(true);
      if (!clientName) {
        throw new Error("Please provide client name");
      } else if (!petName) {
        throw new Error("Please provide pet name");
      } else if (!mobileNumber) {
        throw new Error("Please provide client mobile number");
      } else if (!selectedCategory?.code) {
        throw new Error("Invalid Service! Please select valid service");
      } else if (sessionSelection === SESSION_TYPE.oneTime && !selectedDate) {
        throw new Error("Please Select valid date");
      } else if (sessionSelection === SESSION_TYPE.recursive && !startDate) {
        throw new Error("Please Select valid start date");
      } else if (sessionSelection === SESSION_TYPE.recursive && !endDate) {
        throw new Error("Please Select valid end date");
      } else if (!selectedSlot?.start_time) {
        throw new Error("Please Select valid time slot");
      } else if (!selectedSlot?.end_time) {
        throw new Error("Please Select valid time slot");
      } else {
        const userId = await decryptService("userId");
        const params = {
          parent_id: "",
          provider_id: userId,
          service_code: Number(selectedCategory?.code),
          start_date:
            sessionSelection === SESSION_TYPE.oneTime
              ? moment(selectedDate).format("YYYY-MM-DD")
              : moment(startDate).format("YYYY-MM-DD"),
          end_date:
            sessionSelection === SESSION_TYPE.oneTime
              ? moment(selectedDate).format("YYYY-MM-DD")
              : moment(endDate).format("YYYY-MM-DD"),
          start_time: selectedSlot?.start_time,
          end_time: selectedSlot?.end_time,
          status: "scheduled", //HARDCODE
          notes: "First appointment of the day", //HARDCODE
          petid: 0,
          requestedby: "provider", //HARDCODE
          clientname: clientName,
          contactnum: mobileNumber,
          petname: petName,
        };
        const res = await createAppointment(params);
        if (res?.status === 200) {
          showToast("success", res?.data?.data);
          onSuccess(); //TODO
          contextValue?.setLoader(false);
          onClose(false);
        }
      }
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const renderCategory = useCallback(
    ({ item }) => {
      const isSelected = selectedCategory === item;
      return (
        <TouchableOpacity
          style={[
            styles.categoryButton,
            isSelected && styles.selectedButton,
            {
              marginLeft: 0,
            },
          ]}
          onPress={() => setSelectedCategory(item)}
        >
          <Text
            style={[styles.categoryText, isSelected && styles.selectedText]}
          >
            {item?.service}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedCategory]
  );

  const modalStyle = useMemo(
    () => ({
      margin: 0,
      marginTop: moderateScale(50),
      borderTopRightRadius: 49,
      flex: 1,
      backgroundColor: THEMES.colors.bgColor,
      alignItems: "flex-start",
      paddingHorizontal: moderateScale(16),
      paddingTop: moderateScale(10),
    }),
    []
  );

  const containerStyle = useMemo(
    () => ({
      paddingTop: moderateScale(20),
      flex: 1,
    }),
    []
  );

  const titleStyle = useMemo(
    () => ({
      color: THEMES.colors.black,
      fontFamily: THEMES.fontFamily.semiBold,
      fontSize: THEMES.fonts.font14,
    }),
    []
  );

  const categoryContainerStyle = useMemo(
    () => ({
      paddingTop: moderateScale(15),
      width: "90%",
    }),
    []
  );

  const services = useMemo(
    () => userData?.providerProfile?.providerBusiness?.services,
    [userData?.providerProfile?.providerBusiness?.services]
  );

  const userId = useMemo(
    () => userData?.logindetails?.userid,
    [userData?.logindetails?.userid]
  );

  return (
    <Modal
      onBackButtonPress={() => onClose(false)}
      onBackdropPress={() => onClose(false)}
      isVisible={isVisible}
      backdropOpacity={0.5}
      style={modalStyle}
    >
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={containerStyle}>
          <Text style={titleStyle}>Add Appointment</Text>
          <View style={{ paddingTop: moderateScale(15) }}>
            <InputField
              label={"Client name *"}
              placeholderText={"Enter client name"}
              value={clientName}
              onChange={setClientName}
            />
          </View>
          <View style={{ paddingTop: moderateScale(15) }}>
            <InputField
              label={"Pet name *"}
              placeholderText={"Enter pet name"}
              value={petName}
              onChange={setPetName}
            />
          </View>
          <View style={{ paddingTop: moderateScale(15) }}>
            <InputField
              maxLength={10}
              keyboardType="phone-pad"
              label={"Mobile number *"}
              placeholderText={"Enter mobile number"}
              value={mobileNumber}
              onChange={setMobileNumber}
            />
          </View>
          <View style={categoryContainerStyle}>
            <Text style={titleStyle}>Category</Text>
            <FlatList
              data={services}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategory}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <SessionsForAppointment
            selectedProviderId={userId}
            handleSubmit={handleSubmit}
            buttonTitle="Add"
            isrequestedbyProvider={true}
            isSubmitPress={isSubmitPress}
          />
        </View>
      </ScrollView>
      {!isKeyboardVisible && (
        <View style={[styles.button]}>
          <Button
            title={"Add"}
            onPress={() => setIsSubmitPress(isSubmitPress + 1)}
          />
        </View>
      )}

      <Toast />
    </Modal>
  );
});

const styles = StyleSheet.create({
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#797979",
    borderEndStartRadius: 0,
    margin: 6,
  },
  selectedButton: {
    backgroundColor: THEMES.colors.cyan,
    borderColor: "transparent",
  },
  categoryText: {
    color: "#707070",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font13,
  },
  selectedText: {
    color: "#fff",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font13,
  },
  button: {
    bottom: 0,
    paddingTop: moderateScale(30),
    marginBottom: moderateScale(20),
    width: "100%",
  },
});

// Remove this line since we're using memo directly in the component definition
// const AddAppointmentModal = React.memo(AppointmentModal);

export default AppointmentModal;
