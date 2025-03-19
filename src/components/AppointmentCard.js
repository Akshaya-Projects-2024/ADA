import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo } from "react";
import { THEMES } from "../assets/theme/themes";
import { useNavigation } from "@react-navigation/native";
import { getBase64Obj } from "../utils/documentUtils";
import { moderateScale } from "react-native-size-matters";
import moment from "moment";
import Cross from "../assets/svg/redCross.svg";
import Check from "../assets/svg/check.svg";
import { AppointmentStatus } from "../constants/enums";
import ProfileDummy from "../assets/svg/user.svg";

const AppointmentCard = ({
  item,
  setSelectedItem,
  routeFrom,
  setAppointmentConfirm,
  setVisible,
  setAttendedModal,
}) => {
  const navigation = useNavigation();

  const petImage = useMemo(
    () =>
      item?.petdetails?.documents?.find(
        (it) => it?.documenttype === "profilePhoto"
      ),
    [item]
  );

  const itemBackgroundColor = useMemo(() => {
    if (item?.status === AppointmentStatus.cancelled) {
      return "#fee9e9";
    } else if (item?.status === AppointmentStatus.scheduled) {
      return "#f0ffe6";
    } else if (item?.status === AppointmentStatus.rescheduled) {
      return "#feefd4";
    } else if (item?.status === AppointmentStatus.completed) {
      return "#d6f2f5";
    }
    return THEMES.colors.white;
  }, [item?.status]);

  const itemtextColor = useMemo(() => {
    if (item?.status === AppointmentStatus.cancelled) {
      return "#F4511E";
    } else if (item?.status === AppointmentStatus.scheduled) {
      return "#6DAE43";
    } else if (item?.status === AppointmentStatus.rescheduled) {
      return "#FD9F00";
    } else if (item?.status === AppointmentStatus.completed) {
      return "#02bac7";
    }
    return THEMES.colors.black;
  }, [item?.status]);
  return (
    <Pressable
      onPress={() => {
        setSelectedItem(item);
        {
          item.requestedby !== "provider"
            ? navigation.navigate("appointmentDetail", { selectedItem: item })
            : null;
        }
      }}
      style={[styles.flatlistView, { backgroundColor: itemBackgroundColor }]}
    >
      {item?.status === AppointmentStatus.pending ? (
        <View style={styles.tagView}>
          <Text style={styles.tagText}>New</Text>
        </View>
      ) : null}
      <View style={styles.flatlistContent}>
        <View style={styles.flatListRow}>
          <View style={styles.flatListImgView}>
            <View style={styles.imageContainer}>
              {petImage?.url ? (
                <Image
                  style={styles.petImage}
                  source={getBase64Obj(petImage?.url)}
                />
              ) : (
                <View
                  style={{
                    borderWidth: 1,
                    alignItems: "center",
                    borderColor: "gray",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 48 / 2,
                  }}
                >
                  <ProfileDummy width={30} />
                </View>
              )}
            </View>
            <View style={styles.profileContainer}>
              {item?.providerPhoto ? (
                <Image
                  style={styles.profileImage}
                  source={getBase64Obj(item?.providerPhoto)}
                />
              ) : (
                <View
                  style={{
                    borderWidth: 1,
                    alignItems: "center",
                    borderColor: "gray",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 48 / 2,
                  }}
                >
                  <ProfileDummy width={30} />
                </View>
              )}
            </View>
          </View>
          <View style={styles.nameText}>
            <Text style={[styles.name, { textTransform: "capitalize" }]}>
              {item?.requestedby !== "provider"
                ? `${item?.parentdetails?.name} & ${item?.petdetails?.name}`
                : `${item?.clientname}`}
            </Text>
            <View style={styles.flatListNameRow}>
              <View style={styles.serviceText}>
                <Text
                  style={StyleSheet.flatten([
                    styles.profileTypeText,
                    { paddingRight: moderateScale(3) },
                  ])}
                >
                  {item?.servicedetails?.service}
                </Text>
              </View>
            </View>
            <View style={styles.flatListNameRow}>
              <View style={styles.row}>
                <Text
                  style={StyleSheet.flatten([
                    styles.visitTypeText,
                    {
                      marginRight: moderateScale(5),
                      textDecorationLine: item.isSeduled
                        ? "line-through"
                        : "none",
                    },
                  ])}
                >
                  {moment(item?.appointment_date)?.format("Do MMM")}
                </Text>
                <Text
                  style={StyleSheet.flatten([
                    styles.visitTypeText,
                    {
                      marginRight: moderateScale(5),
                      textDecorationLine: item.isSeduled
                        ? "line-through"
                        : "none",
                    },
                  ])}
                >
                  |
                </Text>
                <Text
                  style={StyleSheet.flatten([
                    styles.visitTypeText,
                    {
                      textDecorationLine: item.isSeduled
                        ? "line-through"
                        : "none",
                    },
                  ])}
                >
                  {item?.start_time}
                </Text>
              </View>
            </View>
            {routeFrom && routeFrom === "parentAccount" && item?.otp ? (
              <Text style={styles.otp}>{`OTP: ${item?.otp}`}</Text>
            ) : null}
          </View>
        </View>

        <>
          {item?.requestedby !== "provider" ? (
            <>
              {routeFrom &&
              routeFrom === "parentAccount" ? null : item?.status ===
                AppointmentStatus.pending ? (
                <View style={styles.row}>
                  <Pressable
                    onPress={() => {
                      setSelectedItem(item);
                      setVisible(true);
                    }}
                  >
                    <Cross width={24} height={24} />
                  </Pressable>
                  <Pressable
                    style={{ marginLeft: moderateScale(12) }}
                    onPress={() => {
                      setSelectedItem(item);
                      setAppointmentConfirm(true);
                    }}
                  >
                    <Check width={24} height={24} />
                  </Pressable>
                </View>
              ) : null}
              {item?.status === AppointmentStatus.cancelled ? (
                <Text style={[styles.statusText, { color: itemtextColor }]}>
                  Cancelled
                </Text>
              ) : null}
              {routeFrom &&
              routeFrom === "parentAccount" ? null : item?.status ===
                AppointmentStatus.scheduled ? (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item);
                    setAttendedModal(true);
                  }}
                  style={styles.confirmButton}
                >
                  <Text style={(styles.statusText, { color: itemtextColor })}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              ) : null}
              {item?.status === AppointmentStatus.rescheduled ? (
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
              ) : null}
              {item?.status === AppointmentStatus.completed ? (
                <Text style={(styles.statusText, { color: itemtextColor })}>
                  Attended
                </Text>
              ) : null}
            </>
          ) : null}
        </>
      </View>
    </Pressable>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  imageContainer: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    position: "absolute",
    top: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffff",
  },
  confirmButton: {
    borderRadius: 8,
    borderBottomStartRadius: 0,
    borderWidth: 1,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderColor: "#6DAE43",
  },
  row: { flexDirection: "row", alignItems: "center" },
  serviceText: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(1),
  },
  nameText: {
    marginHorizontal: moderateScale(13),
    paddingVertical: moderateScale(5),
    flex: 1,
  },
  profileContainer: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    position: "absolute",
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  petImage: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
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
  flatlistContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
  },
  flatListImgView: {
    width: 55,
    height: 55,
  },
  flatListRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  name: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  flatListNameRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  visitTypeText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  otp: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  statusText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.bold,
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
});
