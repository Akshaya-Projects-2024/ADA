import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Calendar from "../../assets/svg/calendar_event.svg";
import Time from "../../assets/svg/circle_event.svg";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import FilterModal from "../../components/FilterModal";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import ClipboardPaste from "../../assets/svg/clipboardPaste.svg";
import ArrowDown from "../../assets/svg/arrowDown.svg";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import CalendarScreen from "./calendarScreen";
import Button from "../../components/Button";
import BlackCross from "../../assets/svg/cross.svg";
import Modal from "react-native-modal";
import UploadImageModal from "../../components/UploadImageModal";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import { decryptService } from "../../utils/storageFunc";
import { createEvent } from "../../redux-store/actions/events";
import { showToast } from "../../utils/utils";
import { goBack } from "../../navigations/rootNavigationRef";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteDocument, uploadDocument } from "../../redux-store/actions/auth";
import { contextValue } from "../../components/Loader";
import Dialog from "../../components/Dialog";
import { validateInput } from "../../utils/validation";
import { getCurrentLocation } from "../../utils/geolocationUtils";

const CreateEvent = () => {
  const [isStartTimeModalVisible, setStartTimeModalVisible] = useState(false);
  const [isEndTimeModalVisible, setEndTimeModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [sDate, setSDate] = useState();
  const [eDate, setEDate] = useState();
  const [posterVisible, setPosterVisible] = useState(false);
  const [posterImg, setPosterImg] = useState([]);
  const [eventName, setEventName] = useState();
  const [description, setDescription] = useState();
  const [contactNo, setContactNo] = useState();
  const [registrationlink, setRegistrationlink] = useState("");
  const [audience, setAudience] = useState("Public");
  const [location, setLocation] = useState("");
  const [modal, setModal] = useState(false);

  const hideStartDatePicker = () => {
    setStartTimeModalVisible(false);
  };

  const hideEndDatePicker = () => {
    setEndTimeModalVisible(false);
  };

  const handleStartConfirm = (date) => {
    const now = moment();
    const selectedDate = moment(sDate, "DD/MM/YYYY");
    const formattedTime = moment(date).format("HH:mm:ss");
    const formattedDateTime = moment(`${selectedDate.format("DD/MM/YYYY")} ${formattedTime}`, "DD/MM/YYYY HH:mm:ss");

    if (!sDate) {
      Alert.alert("", "Please Select Start Date First");
      hideStartDatePicker();
      return;
    }

    if (formattedDateTime?.isBefore(now, "minute")) {
      Alert.alert("Invalid Time", "You cannot select a past time.");
      hideStartDatePicker();
      return;
    }

    setStartTime(formattedTime);
    setEndTime("")
    hideStartDatePicker();
  };

  const handleEndConfirm = (date) => {
    if (!sDate) {
      Alert.alert("Select Start Date First", "Please select a start date before selecting an end time.");
      hideEndDatePicker();
      return;
    }

    if (!startTime) {
      Alert.alert("Select Start Time First", "Please select a start time before selecting an end time.");
      hideEndDatePicker();
      return;
    }

    if (!eDate) {
      Alert.alert("Select End Date", "Please select an end date before selecting an end time.");
      hideEndDatePicker();
      return;
    }

    const startDateTime = moment(`${sDate} ${startTime}`, "YYYY-MM-DD HH:mm:ss");
    const endDateTime = moment(`${eDate} ${moment(date).format("HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss");

    if (endDateTime.isSameOrBefore(startDateTime, "minute")) {
      Alert.alert("Invalid End Time", "End time must be after start time.");
      hideEndDatePicker();
      return;
    }

    setEndTime(moment(date).format("HH:mm:ss"));
    hideEndDatePicker();
  }

  const handlePosterImages = async (image) => {
    contextValue?.setLoader(true);
    const extension = image?.uri?.split(".").pop();
    const userId = await decryptService("userId");
    let payload = {
      userid: userId,
      documenttype: "photo",
      extention: extension,
      document: image?.fileData,
    };
    apiCall(payload, "photo", image);
  };

  const apiCall = async (postData, type, item) => {
    try {
      const res = await uploadDocument(postData);
      if (res?.status === 200) {
        const data = [...posterImg];
        data.push({ ...item, id: res?.data?.data?.reqId });
        setPosterImg(data);
        contextValue?.setLoader(false);
        showToast("success", "Successfully uploaded the image");
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };

  const onCancel = async (doc) => {
    try {
      contextValue?.setLoader(true);
      const userId = await decryptService("userId");
      const postData = {
        userid: userId,
        id: doc?.id,
      };
      const res = await deleteDocument(postData);
      if (res?.status === 200) {
        const removeItemById = posterImg?.filter((it) => it?.id !== doc?.id);
        setPosterImg(removeItemById);
        contextValue?.setLoader(false);
        showToast("success", "Successfully deleted the image");
      }
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error.message);
    }
  };

  const renderItem = (item, index) => {
    const photo = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity
          onPress={() => {
            onCancel(item?.item);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const onSubmit = async () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    if (!eventName) {
      showToast("error", "Please enter Event name");
    } else if (!posterImg?.length) {
      showToast("error", "Please enter poster images");
    } else if (!description) {
      showToast("error", "Please enter description");
    } else if (!sDate) {
      showToast("error", "Please enter start date");
    } else if (!startTime) {
      showToast("error", "Please enter start time");
    } else if (!eDate) {
      showToast("error", "Please enter end date");
    } else if (!endTime) {
      showToast("error", "Please enter end time");
    } else if (!contactNo) {
      showToast("error", "Please enter contact number");
    } else if (validateInput(contactNo) == "invalid") {
      showToast("error", "Please enter valid mobile number");
    } else {
      try {
        const currentPosition = await getCurrentLocation();
        contextValue?.setLoader(true);
        const userId = await decryptService("userId");
        let obj = {
          id: 0,
          name: eventName,
          description: description,
          startdate: sDate ? sDate : "",
          enddate: eDate ? eDate : "",
          starttime: startTime ? startTime?.replace(/:AM|:PM/, "") : "",
          endtime: endTime ? endTime?.replace(/:AM|:PM/, "") : "",
          contact: contactNo,
          registrationlink: registrationlink ? registrationlink : "",
          audience: audience,
          userId: userId,
          location: location,
          documents: posterImg.map((item) => item.id).join(","), //TODO
          latitude: currentPosition?.coords?.latitude
            ? currentPosition?.coords?.latitude?.toString()
            : "0",
          longitude: currentPosition?.coords?.longitude
            ? currentPosition?.coords?.longitude?.toString()
            : "0",
        };
        let res = await createEvent(obj);
        if (res?.data?.status_code == 200) {
          contextValue?.setLoader(false);
          setModal(true);
        } else {
          contextValue?.setLoader(false);
          setSuccess(false);
        }
      } catch (error) {
        contextValue?.setLoader(false);
        console.log("error", error);
      }
    }
  };

  const selectStartTime = useMemo(() => {
    return startTime ? new Date(`${sDate} ${startTime}`) : new Date()
  }, [startTime])
  const selectEndTime = useMemo(() => {
    return endTime ? new Date(`${eDate} ${endTime}`) : new Date()
  }, [endTime])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={"Create Event"}
          fontColor="#EC559C"
          showBack
          bgColor="transparent"
        />
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainView}>
            <InputField
              label={"Name of Event/ Offer*"}
              placeholderText={"Enter Name of Event/ Offer"}
              value={eventName}
              onChange={setEventName}
            />
            <>
              <View style={styles.secondaryFlex}>
                <Text style={styles.titleText}>Event poster/images</Text>
                <TouchableOpacity onPress={() => setPosterVisible(true)}>
                  <Text style={styles.addText}>{Strings.add}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.flatlistView,
                  {
                    alignItems:
                      posterImg?.length == 0 ? "center" : "flex-start",
                  },
                ]}
              >
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    justifyContent: posterImg?.length ? "flex-start" : "center",
                    alignItems: "center",
                    padding: posterImg?.length
                      ? moderateScale(0)
                      : moderateScale(16),
                    borderColor: THEMES.colors.darkGrey,
                    borderRadius: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={posterImg}
                  renderItem={renderItem}
                  ListHeaderComponent={() =>
                    posterImg?.length == 0 ? (
                      <Text style={styles.imgPlaceholder}>
                        {Strings.pleaseAddImg}
                      </Text>
                    ) : null
                  }
                />
              </View>
            </>

            <View style={styles.pt16}>
              <InputField
                label={"Description*"}
                placeholderText={"Enter the offer description"}
                multiline
                value={description}
                onChange={setDescription}
              />
            </View>
            <View style={styles.pt16}>
              <InputField
                label={"Location"}
                placeholderText={"Enter location name"}
                value={location}
                onChange={setLocation}
              />
            </View>
            <View style={styles.dateView}>
              <Text style={styles.startDate}>Start*</Text>
              <TouchableOpacity
                style={styles.dates}
                onPress={() => setCalendarModal(true)}
              >
                <View style={{ paddingRight: moderateScale(9) }}>
                  <Text style={styles.selectDateText}>Select Date</Text>
                  <Text style={styles.dateText}>
                    {sDate ? sDate : "DD/MM/YYYY"}
                  </Text>
                </View>
                <Calendar />
              </TouchableOpacity>

              <View style={styles.timeView}>
                <TouchableOpacity
                  onPress={() => setStartTimeModalVisible(true)}
                  style={{ paddingRight: moderateScale(9) }}
                >
                  <Text style={styles.timeText}>Time</Text>
                  {startTime ? (
                    <Text style={styles.timeValue}>{startTime}</Text>
                  ) : (
                    <Text style={styles.timeValue}>{Strings.hhmm}</Text>
                  )}
                </TouchableOpacity>
                <Time />
              </View>
            </View>

            <View style={styles.endContent}>
              <Text style={styles.endText}>End*</Text>
              <TouchableOpacity
                onPress={() => setCalendarModal(true)}
                style={styles.endValue}
              >
                <View style={{ paddingRight: moderateScale(9) }}>
                  <Text style={styles.datePlaceholder}>Select Date</Text>
                  <Text style={styles.value}>
                    {eDate ? eDate : "DD/MM/YYYY"}
                  </Text>
                </View>
                <Calendar />
              </TouchableOpacity>

              <View style={styles.endValue}>
                <TouchableOpacity
                  onPress={() => setEndTimeModalVisible(true)}
                  style={{
                    paddingRight: moderateScale(9),
                    backgroundColor: "#fff",
                  }}
                >
                  <Text style={styles.datePlaceholder}>Time</Text>
                  {endTime ? (
                    <Text style={styles.timeValue}>{endTime}</Text>
                  ) : (
                    <Text style={styles.timeValue}>{Strings.hhmm}</Text>
                  )}
                </TouchableOpacity>
                <Time />
              </View>
            </View>

            <View style={styles.pt16}>
              <InputField
                label={"Contact Information*"}
                placeholderText={"Enter Contact Number"}
                value={contactNo}
                onChange={setContactNo}
                maxLength={10}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.pt16}>
              <InputField
                label={"Registration Link"}
                placeholderText={"Paste registration link"}
                rightIcon={<ClipboardPaste stroke={THEMES.colors.silver} />}
                value={registrationlink}
                onChange={setRegistrationlink}
              />
            </View>
            <View style={styles.pt16}>
              <InputField
                editable={false}
                label={"Whom to send"}
                placeholderText={"Enter"}
                // rightIcon={<ArrowDown stroke={THEMES.colors.darkGrey} />}
                value={audience}
                onChange={setAudience}
              />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: moderateScale(16),
              marginBottom: moderateScale(10),
            }}
          >
            <Button title="Submit" onPress={() => onSubmit()}></Button>
          </View>
        </ScrollView>
        <DateTimePicker
          isVisible={isStartTimeModalVisible}
          mode="time"
          display="spinner"
          onConfirm={handleStartConfirm}
          onCancel={hideStartDatePicker}
          date={selectStartTime}
        />
        <DateTimePicker
          isVisible={isEndTimeModalVisible}
          mode="time"
          display="spinner"
          onConfirm={handleEndConfirm}
          onCancel={hideEndDatePicker}
          date={selectEndTime}
        />
        {calendarModal && (
          <Modal
            isVisible={calendarModal}
            backdropOpacity={0.5}
            onBackdropPress={() => setCalendarModal(false)}
            style={{ margin: 0, flex: 1 }}
          >
            <CalendarScreen
              onBack={() => setCalendarModal(false)}
              setEDate={setEDate}
              sDate={sDate}
              eDate={eDate}
              setSDate={setSDate}
              updateField={() => {
                setStartTime("");
                setEndTime("");
              }}
            />
          </Modal>
        )}
        <UploadImageModal
          isVisible={posterVisible}
          onClose={() => setPosterVisible(false)}
          handleSelectedImage={(image) => handlePosterImages(image)}
        />
      </View>
      <Dialog
        flag={modal}
        title={"✨ Event Created Successfully!✨"}
        description={
          "Congratulations! Your event has been created. Get ready to meet some furry friends!"
        }
        rightButtonText="Go back to Homescreen"
        rightButtonPressed={() => {
          setModal(false);
          goBack();
        }}
        onClose={() => {
          setModal(false);
          goBack();
        }}
      />
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
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(30),
    marginBottom: moderateScale(20),
  },
  pt16: {
    paddingTop: moderateScale(16),
  },
  dateView: {
    paddingTop: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  startDate: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    width: "15%",
  },
  dates: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    marginLeft: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectDateText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  dateText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    paddingTop: moderateScale(5),
  },
  timeView: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    marginLeft: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  timeText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  timeValue: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    paddingTop: moderateScale(2),
  },
  endContent: {
    paddingTop: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  endText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    width: "15%",
  },
  endValue: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    marginLeft: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  datePlaceholder: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  value: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    paddingTop: moderateScale(5),
  },
  flatlistView: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: THEMES.colors.iron,
    borderRadius: 8,
    backgroundColor: THEMES.colors.white,
  },
  imgPlaceholder: {
    width: "100%",
    textAlign: "center",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
  },
  secondaryFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: moderateScale(16),
  },
  titleText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
  },
  addText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.cyan,
  },
  imgContent: {
    width: 60,
    height: 60,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    marginLeft: 16,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(16),
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEMES.colors.darkGrey,
  },
  crossImg: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  crossView: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    left: 5,
    bottom: 5,
  },
});

export default CreateEvent;
