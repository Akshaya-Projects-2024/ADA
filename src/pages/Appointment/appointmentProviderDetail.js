import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import Back from "../../assets/svg/back.svg";
import Msg from "../../assets/svg/msgSquareText.svg";
import Call from "../../assets/svg/phoneCall.svg";
import RightArrow from "../../assets/svg/arrowRight.svg";
import More from "../../assets/svg/more.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { decryptService } from "../../utils/storageFunc";
import { getAppointmentById } from "../../redux-store/actions/auth";
import { contextValue } from "../../components/Loader";
import { useSelector } from "react-redux";
import BackArrowComponent from "../../components/BackArrowComponent";
import ProfilePhoto from "../../components/ProfilePhoto";

const AppointmentProviderDetail = (props) => {
  const selectedData = props?.route?.params?.selectedItem;
  const [appointmentData, setAppointmentData] = useState();
  const [document, setDocument] = useState();
  const profile = useSelector((state) => state?.commonReducer);

  useEffect(() => {
    initData();
  }, []);

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
                  <Text style={styles.petName}>
                    {appointmentData?.servicedetails?.service}
                  </Text>
                  {/* <Text numberOfLines={1} style={styles.breedType}>
                    {appointmentData?.petdetails?.breed}
                  </Text> */}
                </View>
                {/* <View style={styles.content}>
                  <View style={styles.boxView}>
                    <Text style={styles.dogText}>
                      {" "}
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
                </View> */}

                <View style={{ marginTop: 20 }}>
                  <Text style={styles.aboutPetText}>Appointment Date</Text>
                  <Text style={styles.petDescription}>
                    {appointmentData?.appointment_date}
                  </Text>

                  <View style={{ marginTop: 20, flexDirection: "row" }}>
                    <View>
                      <Text style={styles.aboutPetText}>Start Time</Text>
                      <Text style={styles.petDescription}>
                        {appointmentData?.start_time}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <Text style={styles.aboutPetText}>End Time</Text>
                      <Text style={styles.petDescription}>
                        {appointmentData?.end_time}
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <Text style={styles.aboutPetText}>Notes</Text>
                    <Text style={styles.petDescription}>
                      {appointmentData?.notes}
                    </Text>
                  </View>

                  <View style={styles.cardView}>
                    <View style={styles.imgView}>
                      <ProfilePhoto
                        url={appointmentData?.providerPhoto}
                        style={styles.img}
                      />
                    </View>
                    <View style={styles.parentDetailsView}>
                      <Text style={styles.parentText}>Provider details</Text>
                      <Text style={styles.location}>
                        {appointmentData?.providername?.trim()}
                      </Text>
                      <View style={styles.rowDetail}>
                        <Text style={styles.numberText}>
                          {appointmentData?.ProviderContact?.mobile}
                        </Text>

                        <TouchableOpacity
                          style={styles.ml20}
                          onPress={() =>
                            Linking.openURL(
                              `tel:${appointmentData?.ProviderContact?.mobile}`
                            )
                          }
                        >
                          <Call />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
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
    marginTop: moderateScale(32),
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
});

export default AppointmentProviderDetail;
