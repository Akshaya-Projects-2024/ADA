import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Filter from "../../assets/svg/funnel.svg";
import Search from "../../assets/svg/search.svg";
import Cross from "../../assets/svg/closeSquare.svg";
import Chat from "../../assets/svg/chat.svg";
import { moderateScale } from "react-native-size-matters";
import moment from "moment";
import Button from "../../components/Button";
import SwitchOn from "../../assets/svg/switchOn.svg";
import SwitchOff from "../../assets/svg/switchOff.svg";
import Modal from "react-native-modal";
import InputField from "../../components/InputField";

const { width } = Dimensions.get("window");

const afterTimeSlots = [
  { time: "09:00", disabled: false, enabled: true },
  { time: "09:30", disabled: true, enabled: false },
  { time: "10:00", disabled: false, enabled: true },
  { time: "10:30", disabled: true, enabled: false },
  { time: "11:00", disabled: false, enabled: true },
  { time: "12:00", disabled: false, enabled: true },
  { time: "01:30", disabled: true, enabled: false },
  { time: "02:00", disabled: false, enabled: true },
  { time: "03:30", disabled: true, enabled: false },
  { time: "04:00", disabled: false, enabled: true },
];

const categories = [
  "Trainer",
  "Pet Nutritionist",
  "Animal Therapist",
  "Pet Walker",
  "Animal Communicator",
  "Groomer",
];

const SelectAppointment = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [oneSession, setOneSession] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Get all dates for the current week (Monday to Sunday)
    const startOfWeek = moment().startOf("week"); // Adjust start of week if needed (default is Sunday)
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(moment(startOfWeek).add(i, "days"));
    }
    setWeekDates(dates);
  }, []);

  const selectTimeSlot = (time) => {
    if (!time.disabled) {
      setSelectedSlot(time.time);
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

  const handleDatePress = (date) => {
    // Set the selected date to the date that was pressed
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={"Select Appointment"}
        showBack
        fontColor="#EC559C"
        bgColor="transparent"
      />
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingTop: moderateScale(15),
            paddingHorizontal: moderateScale(16),
          }}
        >
          <Text
            style={{
              color: THEMES.colors.black,
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font14,
              paddingBottom: moderateScale(10),
            }}
          >
            Category
          </Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            horizontal={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        <View
          style={{
            marginHorizontal: moderateScale(14),
            paddingTop: moderateScale(20),
          }}
        >
          <Text style={styles.headerText}>Date</Text>
          <ScrollView
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {weekDates.map((date, index) => {
              const isToday = date.isSame(currentDate, "day");
              const isSelected = date.isSame(selectedDate, "day");
              return (
                <TouchableOpacity
                  onPress={() => handleDatePress(date)}
                  key={index}
                  style={[
                    styles.dateContainer,
                    isSelected ? styles.selectedDate : null, // Highlight selected date
                    isToday && !isSelected ? styles.activeDate : null, // Highlight current date if it's not selected
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected ? styles.selectedDayText : null, // Highlight selected day text
                      isToday && !isSelected ? styles.activeDayText : null, // Highlight today's text
                    ]}
                  >
                    {date.format("ddd")}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      isSelected ? styles.selectedDateText : null, // Highlight selected date text
                      isToday && !isSelected ? styles.activeDateText : null, // Highlight today's text
                    ]}
                  >
                    {date.format("D")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <>
          <View
            style={{
              paddingTop: moderateScale(20),
              paddingHorizontal: moderateScale(16),
            }}
          >
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
                paddingBottom: moderateScale(5),
                paddingHorizontal: moderateScale(5),
              }}
            >
              Morning
            </Text>

            <View style={styles.timeSlotRow}>
              {afterTimeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    slot.disabled && styles.disabledSlot,
                    selectedSlot === slot.time &&
                      !slot.disabled &&
                      styles.selectedSlotStyle,
                  ]}
                  onPress={() => selectTimeSlot(slot)}
                  disabled={slot.disabled} // Disable if the slot is marked as disabled
                >
                  <Text
                    style={[
                      slot.disabled && styles.disabledText,
                      {
                        color: slot.disabled
                          ? "#000"
                          : slot.enabled
                          ? "#000"
                          : "#fff",
                        fontSize: THEMES.fonts.font12,
                        fontFamily: THEMES.fontFamily.medium,
                      },
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={{
              paddingTop: moderateScale(15),
              paddingHorizontal: moderateScale(16),
            }}
          >
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
                paddingBottom: moderateScale(5),
                paddingHorizontal: moderateScale(5),
              }}
            >
              Afternoon
            </Text>

            <View style={styles.timeSlotRow}>
              {afterTimeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    slot.disabled && styles.disabledSlot,
                    selectedSlot === slot.time &&
                      !slot.disabled &&
                      styles.selectedSlotStyle,
                  ]}
                  onPress={() => selectTimeSlot(slot)}
                  disabled={slot.disabled} // Disable if the slot is marked as disabled
                >
                  <Text
                    style={[
                      slot.disabled && styles.disabledText,
                      {
                        color: slot.disabled
                          ? "#000"
                          : slot.enabled
                          ? "#000"
                          : "#fff",
                        fontSize: THEMES.fonts.font12,
                        fontFamily: THEMES.fontFamily.medium,
                      },
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
        <View
          style={{
            flexDirection: "row",
            marginTop: moderateScale(50),
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: moderateScale(20),
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: THEMES.colors.cyan,
              width: 50,
              height: 50,
              borderEndStartRadius: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chat />
          </TouchableOpacity>
          <View style={{ width: "80%" }}>
            <Button title="Confirm" />
          </View>
        </View>
      </ScrollView>

      <Modal
        isVisible={modalVisible}
        backdropOpacity={0.5}
        onBackdropPress={() => setModalVisible(false)}
        style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}
      >
        <View
          style={{
            elevation: 5,
            borderTopWidth: 1,
            borderTopColor: "transparent",
            width: "100%",
            margin: 0,
            borderTopRightRadius: 50,
            shadowColor: "#000",
            justifyContent: "flex-end",
            padding: moderateScale(20),
            backgroundColor: THEMES.colors.bgColor,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
              }}
            >
              Promo code
            </Text>
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.regular,
                fontSize: THEMES.fonts.font14,
              }}
            >
              ₹ 1000/Per session
            </Text>
          </View>
          <View style={{ paddingVertical: moderateScale(30) }}>
            <InputField
              label={"Promo code"}
              placeholderText={"Enter your code"}
            />
          </View>
          <Button title="Apply" onPress={() => setModalVisible(false)}></Button>
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
    backgroundColor: "#f0f0f0", // Gray background for disabled slots
    borderColor: "#d0d0d0",
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
});

export default SelectAppointment;
