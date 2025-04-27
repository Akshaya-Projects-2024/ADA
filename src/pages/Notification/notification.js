import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { readNotification } from "../../redux-store/actions/auth";
import { showToast } from "../../utils/utils";
import { contextValue } from "../../components/Loader";
import { decryptService } from "../../utils/storageFunc";
import { THEMES } from "../../assets/theme/themes";
import Booking from "../../assets/svg/bookings.svg";
import Star from "../../assets/svg/star.svg";
import Badge from "../../assets/svg/badgeCheck.svg";
import Activity from "../../assets/svg/activity.svg";
import Alert from "../../assets/svg/msgSquare.svg";
import PetAdoption from "../../assets/svg/heart.svg";
import ProfileImg from "../../assets/svg/profile.svg";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "../../navigations/rootNavigationRef";
import { screenHeight } from "../../utils/dimensions";
import { getNotificationList } from "../../redux-store/actions/notifications";

const IconConfig = {
  myBookings: {
    icon: Booking,
    backgroundColor: THEMES.colors.sandyBeach,
    params: {
      stroke: THEMES.colors.california,
    },
  },
  myReview: {
    icon: Star,
    backgroundColor: THEMES.colors.hawkesBlue,
  },
  subscription: {
    icon: Badge,
  },
  Activity: {
    icon: Activity,
    backgroundColor: THEMES.colors.hawkesBlue,
  },
  rescue: {
    icon: Alert,
    backgroundColor: "#0091EA",
    params: {
      stroke: THEMES.colors.white,
      strokeWidth: 1,
    },
    showValue: true,
  },
  lostpet: {
    icon: Alert,
    backgroundColor: "#0091EA",
    params: {
      stroke: THEMES.colors.white,
      strokeWidth: 1,
    },
    showValue: true,
  },
  medical: {
    icon: Alert,
    backgroundColor: "#0091EA",
    params: {
      stroke: THEMES.colors.white,
      strokeWidth: 1,
    },
    showValue: true,
  },
  petAdoption: {
    icon: PetAdoption,
    backgroundColor: "#EC559C",
    params: {
      stroke: THEMES.colors.white,
      strokeWidth: 2,
    },
  },
  home: {
    icon: ProfileImg,
    backgroundColor: THEMES.colors.lightCyan,
  },
};

const Notification = (props) => {
  const { loggedInModule, guestUser, logindetails } = useSelector(
    (state) => state?.register
  );
  const dispatch = useDispatch();
  const notificationList = useSelector(
    (state) => state?.notification?.notificationList
  );

  const getNotificationListData = async (showLoader = true) => {
    try {
      showLoader && contextValue?.setLoader(true);
      const userId = await decryptService("userId");
      const params = { userid: userId, usertype: loggedInModule };
      dispatch(getNotificationList(params)); // Add await here
    } catch (error) {
      console.log(error);
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  useEffect(() => {
    if (notificationList) {
      contextValue?.setLoader(false);
    }
  }, [notificationList]);

  const handleOnPress = async (item) => {
    if (!item?.isread) {
      const params = {
        id: item?.id,
        userid: await decryptService("userId")
      };
      await readNotification(params);
      getNotificationListData(false);
    }

    switch (item?.value) {
      case "myBookings":
        props.navigation.navigate(
          loggedInModule === "parent"
            ? "appointmentProviderDetail"
            : "appointmentDetail",
          {
            selectedItem: {
              appointment_id: item.data.id,
            },
          }
        );
        break;
      case "myReview":
        props.navigation.navigate(
          loggedInModule === "parent" ? "serviceListReviews" : "clientReview"
        );
        break;
      case "subscription":
        props.navigation.navigate("Subscription");
        break;
      case "Activity":
        props.navigation.navigate("actvityTrackerDashboard");
        break;
      case "home":
        props.navigation.navigate("myProfile");
        break;
      case "rescue":
        props.navigation?.navigate("resuceAlertDetail", {
          id: item.data.id,
        });
        break;
      case "lostpet":
        props.navigation?.navigate("lostAlertDetail", {
          id: item.data.id,
        });
        break;
      case "medical":
        props.navigation?.navigate("medicalAlertDetail", {
          id: item.data.id,
        });
        break;
    }
  };

  const renderNotificationItem = ({ item, index, length, isToday }) => {
    const Ic = IconConfig?.[item.value]?.icon ?? Badge;

    return (
      <TouchableOpacity
        onPress={() => handleOnPress(item)}
        style={[
          styles.notificationItem,
          {
            borderBottomWidth: index === length - 1 ? 0 : 1,
            borderRadius: !index || index === length - 1 ? 12 : 0,
            borderBottomLeftRadius: index === length - 1 ? 12 : 0,
            borderBottomRightRadius: index === length - 1 ? 12 : 0,
          },
        ]}
      >
        {Boolean(
          !item?.isread &&
            (item.value !== "Activity" || (item.value == "Activity" && isToday))
        ) && (
          <View
            style={{
              position: "absolute",
              top: moderateScale(8),
              right: moderateScale(8),
              width: moderateScale(5),
              height: moderateScale(5),
              borderRadius: moderateScale(8),
              backgroundColor: THEMES.colors.cyan,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        <View style={styles.notificationContent}>
          {/* <ProfileInitial style={styles.profileImage} name={"Test Y"} /> */}
          <View
            style={[
              styles.profileImage,
              {
                backgroundColor: IconConfig[item.value]?.backgroundColor,
                padding: 2,
                borderRadius: 50,
              },
            ]}
          >
            <Ic
              width={moderateScale(24)}
              height={moderateScale(24)}
              {...IconConfig[item.value]?.params}
            />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={styles.title}>
              {item.title}{" "}
              {IconConfig[item.value]?.showValue ? "-" + " " + item.value : ""}
            </Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
          <Text style={styles.timeText}>{item.createdon}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title, data) => {
    if (!data || data.length === 0) return null;
    const isToday = title === "Today";
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={data}
          renderItem={({ item, index }) =>
            renderNotificationItem({
              item,
              index,
              length: data?.length,
              isToday,
            })
          }
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          style={{
            borderRadius: moderateScale(12),
            borderWidth: 1,
            borderColor: "#0000001F",
            elevation: 10,
            shadowColor: "#fff",
            backgroundColor: "#fff",
          }}
          extraData={notificationList}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={"dark-content"}
      />
      <Header
        title={"Notifications"}
        showBack
        bgColor="transparent"
        fontColor="#EC559C"
      />
      <ScrollView style={styles.scrollView}>
        {renderSection("Today", notificationList?.today)}
        {renderSection("Yesterday", notificationList?.yesterday)}
        {renderSection("Last 7 Days", notificationList?.last7day)}
        {Boolean(notificationList && !notificationList?.totalcnt) && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: screenHeight * 0.9,
            }}
          >
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: moderateScale(14),
              }}
            >
              No Notification Found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF5",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },
  section: {
    marginBottom: moderateScale(10),
  },
  sectionTitle: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: moderateScale(16),
    color: "#0000008F",
    marginVertical: moderateScale(6),
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(8),
    borderBottomColor: "#EEEEEE",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: moderateScale(14),
    color: THEMES.colors.black,
    marginBottom: moderateScale(4),
    textTransform: "capitalize",
  },
  message: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: moderateScale(12),
    color: THEMES.colors.black,
    marginBottom: moderateScale(4),
  },
  timeText: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: moderateScale(12),
    color: THEMES.colors.textLight,
    marginLeft: moderateScale(8),
  },
});

export default Notification;
