import moment from "moment";
import { React, useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, ms } from "react-native-size-matters";
import { useSelector } from "react-redux";
import RightArrow from "../../assets/svg/arrowRight.svg";
import BlackCross from "../../assets/svg/cross.svg";
import More from "../../assets/svg/more.svg";
import Call from "../../assets/svg/phoneCall.svg";
import { THEMES } from "../../assets/theme/themes";
import BackArrowComponent from "../../components/BackArrowComponent";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import InputField from "../../components/InputField";
import { contextValue } from "../../components/Loader";
import ProfilePhoto from "../../components/ProfilePhoto";
import { AppointmentStatus } from "../../constants/enums";
import Strings from "../../constants/strings";
import {
  completeAppointment,
  confirmAppointment,
  getAppointmentById,
} from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { showToast } from "../../utils/utils";
import { navigate } from "../../navigations/rootNavigationRef";
import { useIsFocused } from "@react-navigation/native";

const AppointmentDetail = (props) => {
  const selectedData = props?.route?.params?.selectedItem;
  const [appointmentData, setAppointmentData] = useState();
  const [document, setDocument] = useState();
  const profile = useSelector((state) => state?.commonReducer);
  const [isVisible, setVisible] = useState(false);
  const [attendedModal, setAttendedModal] = useState(false);
  const [appointmentConfirm, setAppointmentConfirm] = useState(false);
  const [otpInput, setOtpInput] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && initData();
  }, [isFocused]);

  const initData = async () => {
    try {
      contextValue?.setLoader(true);
      let obj = {
        userid: await decryptService("userId"),
        id: selectedData?.appointment_id,
      };
      let res = await getAppointmentById(obj);
      if (res?.data?.status_code == 200) {
        if (res?.data?.data?.length) {
          contextValue?.setLoader(false);
          setAppointmentData(res?.data?.data?.[0]);
          if (res?.data?.data?.[0]?.petdetails?.documents?.length) {
            const certificateDocs =
              res?.data?.data?.[0]?.petdetails?.documents?.filter(
                (doc) => doc.documenttype === "certificate"
              );
            setDocument(certificateDocs);
          }
        }
      }
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };

  const petImage = useMemo(
    () =>
      appointmentData?.petdetails?.documents?.find(
        (it) => it?.documenttype === "profilePhoto"
      ),
    [appointmentData?.petdetails?.documents]
  );

  const itemtextColor = () => {
    if (appointmentData?.status === AppointmentStatus.cancelled) {
      return "#F4511E";
    } else if (appointmentData?.status === AppointmentStatus.scheduled) {
      return "#6DAE43";
    } else if (
      appointmentData?.status === AppointmentStatus.rescheduled ||
      appointmentData?.status === AppointmentStatus.pending
    ) {
      return "#FD9F00";
    } else if (appointmentData?.status === AppointmentStatus.completed) {
      return "#02bac7";
    }
    return THEMES.colors.black;
  };

  const handleAttended = async () => {
    try {
      contextValue?.setLoader(true);
      if (!appointmentData) {
        throw new Error("Please select the appointment!");
      } else if (!appointmentData?.clientname && !otpInput) {
        throw new Error("Please enter OTP first!");
      } else {
        const params = {
          appointment_id: appointmentData?.appointment_id,
          parent_id: appointmentData?.parentdetails?.userid,
          provider_id: appointmentData?.provider_id,
          otp: otpInput,
        };
        const res = await completeAppointment(params);
        if (res?.status === 200) {
          showToast("success", res.data.data);
          setVisible(false);
          setAttendedModal(false);
          setAppointmentConfirm(false);
          setOtpInput("");
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
      if (!appointmentData) {
        throw new Error("Please select the appointment!");
      } else {
        const params = {
          appointment_id: appointmentData?.appointment_id,
          parent_id: appointmentData?.parentdetails?.userid,
          provider_id: appointmentData?.provider_id,
        };
        const res = await confirmAppointment(params);
        if (res?.status === 200) {
          showToast("success", res.data.data);
          setVisible(false);
          setAttendedModal(false);
          setAppointmentConfirm(false);
          setOtpInput("");
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
  };

  const onCancel = () => {
    setVisible(false);
    navigate("cancelAppointment", {
      selectedItem: selectedData,
      requestedby: "provider",
    });
  };

  const onReschedule = () => {
    setVisible(false);
    navigate("rescheduleAppointment", {
      selectedItem: selectedData,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: petImage?.url }}
          resizeMode="cover"
          style={styles.imgBackground}
        >
          <BackArrowComponent />
          <View style={styles.contentView}>
            <ScrollView
              style={{ flex: 1 }}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.mainContent}>
                <View style={styles.flexRow}>
                  <Text numberOfLines={1} style={styles.petName}>
                    {appointmentData?.petdetails?.name
                      ? appointmentData?.petdetails?.name
                      : appointmentData?.petname}
                  </Text>
                  <Text numberOfLines={1} style={styles.breedType}>
                    {appointmentData?.petdetails?.breed}
                    {"  "}
                  </Text>
                </View>
                {Boolean(appointmentData?.petdetails?.age) && (
                  <View style={styles.content}>
                    <View style={styles.boxView}>
                      <Text style={styles.dogText}>
                        {appointmentData?.petdetails?.type}
                      </Text>
                      <Text style={styles.type}>Type</Text>
                    </View>
                    <View style={styles.ageContent}>
                      <Text style={styles.ageText}>
                        {appointmentData?.petdetails?.age}
                      </Text>
                      <Text style={styles.age}>Age</Text>
                    </View>
                    <View style={styles.genderContent}>
                      <Text style={styles.genderText}>
                        {appointmentData?.petdetails?.gender}
                      </Text>
                      <Text style={styles.gender}>Gender</Text>
                    </View>
                    <View style={styles.weightContent}>
                      <Text style={styles.weightText}>
                        {appointmentData?.petdetails?.weight} kg
                      </Text>
                      <Text style={styles.weight}>Weight</Text>
                    </View>
                  </View>
                )}
                {Boolean(appointmentData?.petdetails?.about) && (
                  <View>
                    <Text style={styles.aboutPetText}>About Pet:</Text>
                    <Text style={styles.petDescription}>
                      {appointmentData?.petdetails?.about}
                    </Text>
                  </View>
                )}
                <View style={{ marginTop: ms(10) }}>
                  <View style={{ flexDirection: "row" }}>
                    <View>
                      <Text style={styles.aboutPetText}>Status:</Text>
                      <Text
                        style={[styles.statusText, { color: itemtextColor() }]}
                      >
                        {appointmentData?.status === "completed"
                          ? "Attended"
                          : appointmentData?.status}
                      </Text>
                    </View>
                    {Boolean(appointmentData?.status == "cancelled") && (
                      <View style={{ marginLeft: ms(30) }}>
                        <Text style={styles.aboutPetText}>Cancelled By:</Text>
                        <Text style={styles.statusText}>
                          {appointmentData?.modifiedName}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ marginTop: ms(10) }}>
                    <View>
                      <Text style={styles.aboutPetText}>Note:</Text>
                      <Text style={[styles.statusText]}>
                        {appointmentData?.notes}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: ms(15) }}>
                    <View>
                      <Text style={styles.chargesText}>Appointment Date</Text>
                      <Text style={styles.chargesValue}>
                        {moment(appointmentData?.appointment_date).format(
                          "DD-MM-YYYY"
                        )}
                      </Text>
                    </View>
                    <View style={{ marginLeft: ms(20) }}>
                      <Text style={styles.chargesText}>Start Time </Text>
                      <Text style={styles.chargesValue}>
                        {appointmentData?.start_time}
                      </Text>
                    </View>
                    <View style={{ marginLeft: ms(20) }}>
                      <Text style={styles.chargesText}>End Time </Text>
                      <Text style={styles.chargesValue}>
                        {appointmentData?.end_time}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", marginTop: ms(15) }}>
                  <View>
                    <Text style={styles.chargesText}>Session Charges</Text>
                    <Text style={styles.chargesValue}>
                      {appointmentData?.sessioncharges} / Per Session
                    </Text>
                  </View>
                  {Boolean(+appointmentData?.monthcharges) && (
                    <View style={{ marginLeft: ms(20) }}>
                      <Text style={styles.chargesText}>Monthly Charges </Text>
                      <Text style={styles.chargesValue}>
                        {appointmentData?.monthcharges} / Per Month
                      </Text>
                    </View>
                  )}
                </View>
                {Boolean(document?.length) && (
                  <View style={styles.medicalDocView}>
                    <Text style={styles.medicalText}>Medical documents</Text>
                    <RightArrow stroke="#000" />
                  </View>
                )}
                {Boolean(document?.length) && (
                  <View style={styles.documentView}>
                    <ScrollView
                      horizontal={true}
                      style={{ flex: 1 }}
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                    >
                      {document?.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => Linking.openURL(item.url)}
                            style={[
                              styles.documents,
                              {
                                marginLeft: index === 0 ? 0 : moderateScale(10),
                              },
                            ]}
                          >
                            <Text style={styles.docText}>
                              {item?.documenttype} {index + 1}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
                {Boolean(document?.length > 1) && (
                  <View style={styles.moreView}>
                    <More />
                  </View>
                )}
                <View style={styles.cardView}>
                  <View style={styles.imgView}>
                    <ProfilePhoto
                      url={appointmentData?.ParentPhoto}
                      style={styles.img}
                    />
                  </View>
                  <View style={styles.parentDetailsView}>
                    <Text style={styles.parentText}>Pet parent details</Text>
                    <Text numberOfLines={2} style={styles.location}>
                      {appointmentData?.parentdetails?.name
                        ? appointmentData?.parentdetails?.name
                        : appointmentData?.clientname}
                    </Text>
                    <View style={styles.rowDetail}>
                      <Text style={styles.numberText}>
                        {appointmentData?.parentdetails?.mobile
                          ? appointmentData?.parentdetails?.mobile
                          : appointmentData?.contactnum}
                      </Text>

                      <TouchableOpacity
                        style={styles.ml20}
                        onPress={() =>
                          Linking.openURL(
                            `tel:${
                              appointmentData?.parentdetails?.mobile
                                ? appointmentData?.parentdetails?.mobile
                                : appointmentData?.contactnum
                            }`
                          )
                        }
                      >
                        <Call />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            {Boolean(
              ["pending", "rescheduled", "scheduled"].includes(
                appointmentData?.status
              )
            ) && (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: ms(15),
                }}
              >
                <View
                  style={{
                    width: "48%",
                  }}
                >
                  <Button title="Edit" onPress={() => setVisible(true)} />
                </View>
                <View style={{ width: "48%" }}>
                  <Button
                    title={
                      appointmentData?.status === "pending"
                        ? "Accept"
                        : "Confirm"
                    }
                    onPress={() => {
                      if (
                        appointmentData?.status === "pending" ||
                        appointmentData?.status === "rescheduled"
                      ) {
                        setAppointmentConfirm(true);
                      } else {
                        if (appointmentData?.clientname) {
                          handleAttended();
                        } else {
                          setAttendedModal(true);
                        }
                      }
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
        <Modal
          onBackdropPress={() => {
            setVisible(false);
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
            setOtpInput("");
          }}
          onBackdropPress={() => {
            setAttendedModal(false);
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
          title="Scheduling"
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
  imgBackground: {
    flex: 1,

    height: 288,
  },
  contentView: {
    backgroundColor: THEMES.colors.bgColor,
    alignItems: "flex-start",
    alignSelf: "flex-end",
    paddingHorizontal: moderateScale(17),
    width: "100%",
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    flex: 1,
    marginTop: moderateScale(200),
    paddingTop: moderateScale(38),
  },
  mainContent: {
    paddingVertical: moderateScale(5),
    paddingBottom: moderateScale(30),
    backgroundColor: THEMES.colors.bgColor,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  petName: {
    fontFamily: THEMES.fontFamily.bold,
    width: "50%",
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
  },
  breedType: {
    fontFamily: THEMES.fontFamily.regular,
    width: "50%",
    fontSize: THEMES.fonts.font14,
    textAlign: "right",
    color: THEMES.colors.darkGrey,
  },
  content: {
    paddingVertical: moderateScale(32),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxView: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#fee6e4",
    paddingVertical: moderateScale(16),
  },
  dogText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(23),
  },
  type: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(21),
  },
  ageContent: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#efeaec",
    paddingVertical: moderateScale(16),
  },
  ageText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(14),
  },
  age: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(23),
  },
  genderContent: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#fdf4d7",
    paddingVertical: moderateScale(16),
  },
  genderText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(21),
    textTransform: "capitalize",
  },
  gender: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(14),
  },
  weightContent: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#fcd7d4",
    paddingVertical: moderateScale(16),
  },
  weightText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(21),
  },
  weight: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(14),
  },
  aboutPetText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
  },
  petDescription: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(5),
    lineHeight: moderateScale(18),
  },
  medicalDocView: {
    flexDirection: "row",
    paddingTop: moderateScale(24),
    alignItems: "center",
  },
  medicalText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
    paddingRight: moderateScale(8),
  },
  documentView: {
    flexDirection: "row",
    paddingTop: moderateScale(18),
  },
  documents: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    backgroundColor: "#d6f2f5",
  },
  docText: {
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font12,
    textTransform: "capitalize",
  },
  moreView: {
    paddingTop: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
  },
  cardView: {
    marginTop: moderateScale(16),
    padding: moderateScale(14),
    backgroundColor: THEMES.colors.white,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: THEMES.colors.lightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  imgView: {
    width: 51,
    height: 51,
    borderRadius: 51 / 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  img: {
    width: 51,
    height: 51,
    borderRadius: 51 / 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  parentDetailsView: {
    width: "80%",
    marginLeft: moderateScale(11),
  },
  parentText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
  },
  location: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    paddingTop: moderateScale(3),
    textTransform: "capitalize",
  },
  rowDetail: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: moderateScale(5),
    width: "100%",
  },
  numberText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
  },
  ml20: {
    marginLeft: moderateScale(10),
  },
  goBackBtn: {
    paddingTop: moderateScale(18),
    paddingHorizontal: moderateScale(15),
  },
  statusText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    textTransform: "capitalize",
    color: THEMES.colors.black,
  },
  chargesText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.darkGrey,
  },
  chargesValue: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
  },
});

export default AppointmentDetail;
