import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import moment from "moment";
import { showToast } from "../../utils/utils";
import { createAppointment } from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { useSelector } from "react-redux";
import { contextValue } from "../../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import SessionsForAppointment from "../../components/SessionsForAppointment";
import Dialog from "../../components/Dialog";
import PetSelection from "../../components/PetSelection";
import { ScrollView } from "react-native-gesture-handler";
import useKeyboardVisibility from "../../hooks/useKeyboardVisibility";
import Button from "../../components/Button";

export const SESSION_TYPE = { oneTime: "one_time", recursive: "recursive" };

const SelectAppointment = ({ navigation, route }) => {
  const selectedProvider = route?.params?.selectedProvider;
  const selectedService = route?.params?.selectedService;
  const [appointmentConfirm, setAppointmentConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const profile = useSelector((state) => state?.commonReducer);
  const [openPetSelectionDIalog, setOpenPetSelectionDialog] = useState({
    flag: false,
    data: {},
  });
  const [selectedPet, setSelectedPet] = useState(
    profile?.parentProfie?.petDetails[0]?.id
  );
  const [isSubmitPress, setIsSubmitPress] = useState(0);
  const isKeyboardVisible = useKeyboardVisibility();

  const handleSubmit = async (
    selectedDate,
    startDate,
    endDate,
    selectedSlot,
    sessionSelection
  ) => {
    const userId = await decryptService("userId");
    try {
      if (!selectedProvider?.profile?.providerBusiness?.userid) {
        throw new Error("Invalid Provider! Please select valid provider");
      } else if (!selectedService?.code) {
        throw new Error("Invalid Service! Please select valid service");
      } else if (!selectedCategory?.length) {
        throw new Error("Please Select valid category");
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
      } else if (!profile?.parentProfie?.petDetails[0]?.id) {
        throw new Error("No pet found in your profile");
      } else if (
        selectedProvider?.profile?.providerBusiness?.userid?.toLowerCase() ==
        userId?.toLowerCase()
      ) {
        throw new Error("You can't book an appointment with yourself.");
      } else {
        const params = {
          parent_id: userId,
          provider_id: selectedProvider?.profile?.providerBusiness?.userid,
          service_code: Number(selectedService?.code),
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
          petid: selectedPet,
          requestedby: "parent", //HARDCODE
        };
        if (profile?.parentProfie?.petDetails.length > 1) {
          setOpenPetSelectionDialog({
            flag: true,
            data: params,
          });
        } else {
          contextValue?.setLoader(true);
          handlePetSelection("", params);
        }
      }
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const handlePetSelection = async (id, obj) => {
    let params = {};
    if (openPetSelectionDIalog?.flag && id) {
      params = {
        ...openPetSelectionDIalog?.data,
        petid: id,
      };
      setOpenPetSelectionDialog({
        flag: false,
        data: {},
      });
      contextValue?.setLoader(true);
    } else {
      params = {
        ...obj,
      };
    }
    try {
      const res = await createAppointment(params);
      contextValue?.setLoader(false);
      if (res?.status === 200) {
        setAppointmentConfirm(true);
      }
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory === item;
    return (
      <TouchableOpacity
        style={[styles.categoryButton, isSelected && styles.selectedButton]}
        onPress={() => setSelectedCategory(item)}
      >
        <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={"Select Appointment"}
          showBack
          fontColor="#EC559C"
          bgColor="transparent"
        />
        <ScrollView>
          <View
            style={{
              paddingTop: moderateScale(15),
              paddingHorizontal: moderateScale(16),
            }}
          >
            <Text style={styles.headerText}>Category</Text>
            <FlatList
              data={
                selectedProvider?.profile?.ProviderSession?.availableat ?? []
              }
              renderItem={renderCategory}
              keyExtractor={(item) => item}
              horizontal={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>
          <SessionsForAppointment
            selectedProviderId={
              selectedProvider?.profile?.providerBusiness?.userid
            }
            handleSubmit={handleSubmit}
            isSubmitPress={isSubmitPress}
          />
        </ScrollView>
        {!isKeyboardVisible && (
          <View style={[styles.button]}>
            <Button
              title={"Confirm"}
              onPress={() => setIsSubmitPress(isSubmitPress + 1)}
            />
          </View>
        )}

        <Dialog
          flag={Boolean(appointmentConfirm)}
          title={"Booking Confirmed !"}
          description={`Your appointment with ${selectedProvider?.profile?.providerBusiness?.name} is successfully scheduled.`}
          rightButtonText="Go to home"
          rightButtonPressed={() => {
            setAppointmentConfirm(false);
            navigation.reset({
              index: 0,
              routes: [{ name: "petParentAppStack" }],
            });
          }}
          onClose={() => {
            setAppointmentConfirm(false);
          }}
        />
        <PetSelection
          flag={Boolean(openPetSelectionDIalog?.flag)}
          onClose={() => {
            setOpenPetSelectionDialog({
              flag: false,
              data: {},
            });
          }}
          onPetSelect={handlePetSelection}
          title={"Select Your Pet for appointment"}
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
  flex: {
    flex: 1,
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
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#797979",
    borderEndStartRadius: 0,
    margin: 4,
  },
  selectedButton: {
    backgroundColor: THEMES.colors.cyan, // Change to the selected color
    borderColor: "transparent",
  },
  headerText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    marginBottom: 10,
    marginHorizontal: moderateScale(6),
    color: THEMES.colors.black,
  },
  headerTextV2: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    marginHorizontal: moderateScale(6),
    color: THEMES.colors.black,
  },
  scrollContainer: {
    flexDirection: "row",
  },
  dateContainer: {
    width: 53, // Adjust the width of each date container
    height: 53,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#CFD3D4",
    borderWidth: 1,
  },
  activeDate: {
    backgroundColor: THEMES.colors.orange, // Active background color for current day
  },
  dayText: {
    fontSize: THEMES.fonts.font12,
    color: "#000",
    fontFamily: THEMES.fontFamily.regular,
  },
  dateText: {
    fontSize: THEMES.fonts.font12,
    color: "#000",
    fontFamily: THEMES.fontFamily.medium,
  },
  activeDayText: {
    color: "#fff", // Active day text color
  },
  activeDateText: {
    color: "#fff", // Active date text color
  },
  timeSlotRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures time slots wrap to the next line
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: "#ffffff",
    borderColor: "#CFD3D4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    margin: 5,
  },
  selectedSlotStyle: {
    backgroundColor: THEMES.colors.cyan,
  },
  disabledSlot: {
    backgroundColor: "#AAAAAA", // Gray background for disabled slots
    borderColor: "#AAAAAA",
  },
  bookedSlot: {
    backgroundColor: THEMES.colors.bookedSlot,
    borderColor: THEMES.colors.outrageousOrange,
  },
  selectedDate: {
    backgroundColor: THEMES.colors.cyan, // Highlight for selected date
  },
  selectedDateText: {
    color: "#fff", // Selected date text color
  },
  selectedDayText: {
    color: "#fff", // Selected day text color
  },
  sessionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEMES.colors.bgColor,
    padding: 10,
    borderRadius: 20,
    paddingTop: moderateScale(15),
  },
  selectedRadioText: {
    color: "#000", // Darker color for selected text
    fontWeight: "bold",
  },
  pickerContainer: { flexDirection: "row", marginTop: moderateScale(16) },
  startDateInput: {
    flex: 1,
    marginStart: moderateScale(16),
    marginEnd: moderateScale(8),
  },
  endDateInput: {
    flex: 1,
    marginEnd: moderateScale(16),
    marginStart: moderateScale(8),
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
  button: {
    bottom: 0,
    paddingTop: moderateScale(30),
    paddingHorizontal: moderateScale(15),
    marginBottom: moderateScale(15),
    width: "100%",
  },
});

export default SelectAppointment;
