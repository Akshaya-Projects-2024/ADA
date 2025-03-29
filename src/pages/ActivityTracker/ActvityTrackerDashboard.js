import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import { useSelector } from "react-redux";
import { SwipeListView } from "react-native-swipe-list-view";
import Feather from "react-native-vector-icons/Feather";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import PetCarousel from "../../components/PetCarousel";
import { BondingSection } from "./components/BondingSection";
import { WeekView } from "./components/WeekView";
import { ActivityListItem } from "./components/ActivityListItem";
import CrossIcon from "../../assets/svg/CrossIcon";
import { styles } from "./components/styles";
import Plus from "../../assets/svg/plus.svg";
import {
  deleteActivity,
  getActivityDashboard,
  getMyActivityByDate,
  saveActivity,
  updateActivitystatus,
} from "../../redux-store/actions/auth";
import { navigate } from "../../navigations/rootNavigationRef";
import Dialog from "../../components/Dialog";
import ContactModal from "./components/contactModal";
import { contextValue } from "../../components/Loader";
import { showToast } from "../../utils/utils";
import { useIsFocused } from "@react-navigation/native";
import { ActivityType, DefaultActivityList } from "../../constants/enums";

export const ActvityTrackerDashboard = (props) => {
  const { parentProfie, logindetails } = useSelector(
    (state) => state?.commonReducer
  );
  const { petDetails } = parentProfie;

  const [selectedPet, setSelectedPet] = useState(petDetails?.[0]);
  const [petImage, setPetImage] = useState();
  const [weekList, setWeekList] = useState({
    selectedDate: moment().format("YYYY-MM-DD"),
    weekList: Array.from({ length: 7 }, (_, i) =>
      moment().add(i, "days").format("YYYY-MM-DD")
    ),
    todayDate: moment().format("YYYY-MM-DD"),
  });
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState({
    flag: false,
    details: {}, // add details here if needed
  });
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const toggleContactModal = () => {
    setContactModalVisible(!contactModalVisible);
  };
  const [dashboardData, setDashboardData] = useState(null); // []
  const [activityListData, setActivityDataList] = useState([]);
  const refreshActivityData = useSelector(
    (state) => state?.commonReducer?.refreshActivityData
  );
  const isFocused = useIsFocused();
  const [bound, setBound] = useState(0);

  useEffect(() => {
    if (petDetails?.length && selectedPet?.documents) {
      const profilePhoto = selectedPet.documents.find(
        (item) => item.documenttype === "profilePhoto"
      );
      setPetImage(profilePhoto?.url);
    }
  }, [selectedPet, petDetails]);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: "Contacts",
        message: "This app would like to view your contacts.",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (permission !== "granted") {
      Alert.alert(
        "Permission Denied",
        "This app requires permission to access your contacts.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () =>
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS
              ),
          },
        ]
      );
    }
  };

  useEffect(() => {
    fetchActivityDashboardData();
  }, [isFocused]);

  useEffect(() => {
    fetchActivity();
  }, [weekList?.selectedDate, refreshActivityData, selectedPet, isFocused]);

  const fetchActivity = async () => {
    contextValue.setLoader(true);
    const obj = {
      petId: selectedPet?.id,
      userId: logindetails?.userid,
      date: weekList?.selectedDate,
    };
    const res = await getMyActivityByDate(obj);
    if (res.status == 200) {
      setActivityDataList(res.data.data);
      contextValue.setLoader(false);
    }
  };

  const fetchActivityDashboardData = async () => {
    const userId = logindetails?.userid;
    const petId = selectedPet?.id;
    const res = await getActivityDashboard({ userId, petId });
    if (res?.status === 200) {
      setDashboardData(res?.data?.data);
      setTimeout(() => {
        setBound(res?.data?.data?.bound);
      }, 700);
    }
  };

  const closeRow = (rowMap, rowKey) => {
    rowMap[rowKey]?.closeRow();
  };

  const deleteRow = useCallback(
    (item) => {
      setOpenConfirmationDialog({
        flag: true,
        details: item,
      });
    },
    [props?.navigation]
  );

  const onCardPress = (item) => {
    // Handle card press
    const filterActvity = getFilterAcivity(item);
    navigate("addEditActivity", {
      petId: selectedPet?.id,
      parentid: logindetails?.userid,
      activityListData: filterActvity,
      isEdit: true,
    });
  };

  const getFilterAcivity = (item) => {
    const userActivity =
      activityListData.filter((x) => x.type == item.type) ?? [];
    const activitySubname = item.subname;
    let arr1 = [];

    const staticActivityList = Object.values(DefaultActivityList);
    staticActivityList.map((item) => {
      if (item.type !== "Medication" && item.type !== "Vaccination") {
        const arr = userActivity?.filter(
          (x) => x.type == item.type && !x.iscustomise
        );
        let obj = {
          acitivityId: [],
        };
        if (arr?.length) {
          arr.forEach((activity) => {
            const activityName = activity.name?.split(" ")[0]?.toLowerCase();
            obj.acitivityId[ActivityType[activity.type].idIndex[activityName]] =
              activity.id;

            Object.keys(activity).forEach((key) => {
              const existingValue = obj[key];
              const newValue = activity[key];
              if (newValue) {
                obj[key] = newValue ? newValue : existingValue;
              } else if (!existingValue) {
                obj[key] = newValue;
              }
            });
          });
          obj["name"] = item.type;
        } else {
          obj = item;
        }
        arr1.push(obj);
      } else if (item.type === "Medication" || item.type === "Vaccination") {
        const arr = userActivity?.filter(
          (x) =>
            x.type == item.type &&
            !x.iscustomise &&
            activitySubname == x.subname
        );

        if (arr.length) {
          let obj = {
            acitivityId: [],
          };
          arr.forEach((activity) => {
            const activityName = activity.name?.split(" ")[0]?.toLowerCase();
            activity.name = activity.type;
            obj.acitivityId[ActivityType[item.type].idIndex[activityName]] =
              activity.id;
            Object.keys(activity).forEach((key) => {
              const existingValue = obj[key];
              const newValue = activity[key];
              if (newValue) {
                obj[key] = newValue ? newValue : existingValue;
              } else if (!existingValue) {
                obj[key] = newValue;
              }
            });
          });
          obj["name"] = item.type;
          arr1.push(obj);
        } else {
          arr1.push(item);
        }
      }
    });
    return item.iscustomise
      ? [item]
      : arr1.filter((x) => x?.acitivityId?.includes(item.id));
  };

  const renderHiddenItem = useCallback(
    ({ item, index }, rowMap) => (
      <View style={[styles.rowBack]}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => {
            closeRow(rowMap, index);
            onCardPress(item);
          }}
        >
          <Feather name="edit-2" size={18} color={THEMES.colors.white} />
          <Text style={styles.backTextWhite}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => {
            closeRow(rowMap, index);
            deleteRow(item);
          }}
        >
          <CrossIcon color={THEMES.colors.white} />
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    ),
    [closeRow, deleteRow, onCardPress]
  );

  const updateActivity = async (item, status, value) => {
    if (
      weekList.todayDate !== weekList.selectedDate ||
      moment().isBefore(value)
    ) {
      showToast("error", "This activity is not started yet.");
      return;
    }
    if (status == item?.activitystatus?.status) {
      return;
    }
    const userid = logindetails?.userid;
    const postObj = {
      activityid: item?.id,
      petid: selectedPet?.id,
      date: weekList.selectedDate,
      status: status,
      userid,
    };
    if (item.activitystatus.id) {
      postObj.id = item?.activitystatus?.id;
    }
    const res = await updateActivitystatus(postObj);
    if (res?.status === 200) {
      showToast("success", res.data?.message);
      fetchActivityDashboardData();
      fetchActivity();
    }
  };

  const onConfirmationModalClose = () => {
    setOpenConfirmationDialog({
      flag: false,
      details: {},
    });
  };
  const confirm = async () => {
    onConfirmationModalClose();
    const obj = {
      id: openConfirmationDialog?.details?.id,
      parentid: openConfirmationDialog?.details?.parentid,
    };
    const res = await deleteActivity(obj);
    if (res?.status === 200) {
      fetchActivity();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title="Activity Tracker" showBack bgColor="transparent" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {Boolean(selectedPet) && (
          <PetCarousel
            pets={petDetails}
            onSelectPet={setSelectedPet}
            selectedPet={selectedPet}
          />
        )}
        <BondingSection
          bound={bound}
          logindetails={logindetails}
          petImage={petImage}
        />
        <WeekView
          weekList={weekList}
          setWeekList={setWeekList}
          toggleContactModal={toggleContactModal}
        />
        <View style={[styles.activityListContainer, { flex: 1 }]}>
          <View style={[styles.row, { paddingTop: 10, paddingBottom: 20 }]}>
            <Text
              style={{
                fontSize: THEMES.fonts.font16,
                fontFamily: THEMES.fontFamily.semiBold,
                color: THEMES.colors.black,
              }}
            >
              Activity
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                props?.navigation?.navigate("activityTrackerList", {
                  petId: selectedPet?.id,
                  parentId: logindetails?.userid,
                })
              }
            >
              <Plus
                stroke={THEMES.colors.cyan}
                strokeWidth={2}
                width={21}
                height={21}
              />
            </TouchableOpacity>
          </View>
          <SwipeListView
            useFlatList
            data={activityListData}
            renderItem={({ item }) => (
              <ActivityListItem
                item={item}
                updateActivity={updateActivity}
                todayDate={weekList.todayDate}
                selectedDate={weekList.selectedDate}
              />
            )}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewOpenValue={-100}
            previewOpenDelay={0}
            disableRightSwipe
            previewDuration={500}
            previewRowKey="0"
            closeOnRowBeginSwipe
            closeOnScroll
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              paddingBottom: 30,
            }}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={<View style={{ marginBottom: 10 }} />}
            ListEmptyComponent={
              <View
                style={[
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 100,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: THEMES.fonts.font14,
                    fontFamily: THEMES.fontFamily.medium,
                    color: THEMES.colors.darkGrey,
                  }}
                >
                  No Activity added
                </Text>
              </View>
            }
          />
        </View>
        <Dialog
          flag={openConfirmationDialog.flag}
          description={"Are you sure you want to delete this Activity?"}
          leftButtonText="No"
          rightButtonText="Yes"
          leftButtonPressed={onConfirmationModalClose}
          rightButtonPressed={confirm}
          onClose={onConfirmationModalClose}
          title="Delete Activity"
        />
        {Boolean(contactModalVisible) && (
          <ContactModal
            contactModalVisible={contactModalVisible}
            parentProfie={parentProfie}
            petInfo={selectedPet}
            toggleContactModal={toggleContactModal}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
