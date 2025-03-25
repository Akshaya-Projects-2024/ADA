import React, { useState, useCallback, useRef, useEffect } from "react";
import { StatusBar, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import { THEMES } from "../../assets/theme/themes";
import {
  ActivityType,
  CustomActivity,
  DefaultActivityList,
} from "../../constants/enums";
import { ActivityCard } from "./components/ActivityCard";
import { MealActivity } from "./components/MealActivity";
import { VaccineeActivity } from "./components/VaccineeActivity";
import { MedicationActivity } from "./components/MedicationActivity";
import Button from "../../components/Button";
import AddActivityModal from "./AddActivityModal";
import { getCurrentRoute } from "../../navigations/rootNavigationRef";
import { contextValue } from "../../components/Loader";
import { TrainingActivity } from "./components/TrainingActivity";
import { showToast } from "../../utils/utils";
import {
  deleteActivity,
  getMyActivity,
  saveActivity,
} from "../../redux-store/actions/auth";
import { updateActivityData } from "../../redux-store/actions/commonApis";
import { useDispatch } from "react-redux";
import Dialog from "../../components/Dialog";

export const ActivityList = (props) => {
  const [activityDataList, setActivityDataList] = useState([]);
  const [openNewActivity, setOpenNewActivity] = useState(false);
  const activityTypeRef = useRef();
  const dispatch = useDispatch();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState({
    flag: false,
    details: {}, // add details here if needed
  });

  const parentid = props?.route?.params?.parentid;
  const petId = props?.route?.params?.petId;
  const [errors, setError] = useState({});

  useEffect(() => {
    // getList();
    getEditData();
  }, []);

  const getEditData = () => {
    contextValue?.setLoader(true);
    setActivityDataList(props?.route?.params?.activityListData);
    contextValue?.setLoader(false);
  };

  const getList = async () => {
    try {
      contextValue?.setLoader(true);
      const obj = {
        parentid,
        petId,
      };
      const res = await getMyActivity(obj);
      if ((res.status = 200)) {
        const userActivity = res.data.data ?? [];
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
                const activityName = activity.name
                  ?.split(" ")[0]
                  ?.toLowerCase();
                obj.acitivityId[
                  ActivityType[activity.type].idIndex[activityName]
                ] = activity.id;

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
          } else if (
            item.type === "Medication" ||
            item.type === "Vaccination"
          ) {
            const arr = userActivity?.filter(
              (x) => x.type == item.type && !x.iscustomise
            );
            if (arr.length) {
              let obj = {
                acitivityId: [],
              };
              arr.forEach((activity) => {
                const activityName = activity.name
                  ?.split(" ")[0]
                  ?.toLowerCase();
                activity.name = activity.type;
                obj.acitivityId[ActivityType[item.type].idIndex[activityName]] =
                  activity.id;

                if (
                  !obj.subname ||
                  (obj.subname === activity.subname &&
                    obj.duration === activity.duration)
                ) {
                  Object.keys(activity).forEach((key) => {
                    const existingValue = obj[key];
                    const newValue = activity[key];
                    if (newValue) {
                      obj[key] = newValue ? newValue : existingValue;
                    } else if (!existingValue) {
                      obj[key] = newValue;
                    }
                  });
                } else {
                  arr1.push(obj);
                  obj = { ...activity };
                }
              });
              obj["name"] = item.type;
              arr1.push(obj);
            } else {
              arr1.push(item);
            }
          }
        });
        const arr2 = userActivity?.filter((x) => x.iscustomise === 1);
        setActivityDataList([...arr1, ...arr2]);
        contextValue?.setLoader(false);
      }
    } catch (error) {
      contextValue?.setLoader(false);
      console.log("error", error);
    }
  };

  const onRemoveActicty = (index, item) => {
    setOpenConfirmationDialog({
      flag: true,
      details: {
        index,
        item,
      },
    });
  };

  const onConfirmationModalClose = () => {
    setOpenConfirmationDialog({
      flag: false,
      details: {},
    });
  };

  const onConfirm = () => {
    const { item, index } = openConfirmationDialog?.details;
    contextValue.setLoader(true);
    const arr = [...activityDataList];
    const idList =
      item?.iscustomise && item.id
        ? [item.id]
        : item?.acitivityId?.filter((x) => x);

    if (idList?.length) {
      idList.map(async (x) => {
        const obj = {
          parentid,
          id: x,
        };
        const res = await deleteActivity(obj);
        if (res.status == 200) {
          showToast("success", res.data.message);
        }
      });
    }
    if (item.iscustomise || item.copied) {
      arr.splice(index, 1);
    } else {
      arr[index] = { ...DefaultActivityList[item.type] };
    }

    contextValue.setLoader(false);
    setActivityDataList(JSON.parse(JSON.stringify(arr)));
    setOpenConfirmationDialog({
      flag: false,
      details: {},
    });
  };

  // Combine modal states
  const [modalState, setModalState] = useState({
    time: { isVisible: false, index: 0, key: "" },
    date: { isVisible: false, index: 0, key: "" },
  });

  // Modal handlers
  const handleModalVisibility = useCallback(
    (type, isVisible, index = 0, key = "") => {
      setModalState((prev) => ({
        ...prev,
        [type]: { isVisible, index, key },
      }));
    },
    [activityDataList]
  );

  // Optimized data handlers
  const handleDataChange = useCallback(
    (index, updates) => {
      setActivityDataList((prev) => {
        const temp = [...prev];
        temp[index] = { ...temp[index], ...updates };
        return temp;
      });
    },
    [activityDataList]
  );

  const handleCheckboxChange = useCallback(
    (value, index) => {
      const updates = {
        frequency: value,
        days: value ? "Mon,Tue,Wed,Thu,Fri,Sat,Sun," : "",
      };
      handleDataChange(index, updates);
    },
    [handleDataChange, activityDataList]
  );

  const handleDayChange = useCallback(
    (day, index, isSelected) => {
      // Logic to update days
      const currentDays = activityDataList[index].days;
      const newDays = isSelected
        ? currentDays.replace(`${day},`, "")
        : `${currentDays}${day},`;
      handleDataChange(index, {
        days: newDays,
        frequency: newDays.length == 28 ? "Daily" : "",
      });
    },
    [handleDataChange]
  );

  // Memoized time and date handlers
  const handleTimeChange = useCallback(
    (date, index, key) => {
      const formattedTime = moment(date).format("HH:mm:ss");
      const formattedTimeFormat = moment(date).format("A");

      handleDataChange(index, {
        [key]: formattedTime,
        timeFormat: formattedTimeFormat,
      });
    },
    [handleDataChange]
  );

  const handleDateChange = useCallback(
    (date, index, key) => {
      handleDataChange(index, {
        [key]: moment(date).format("YYYY-MM-DD"),
      });
    },
    [handleDataChange]
  );

  // Memoized value getters
  const getTimeValue = useCallback(
    (index, key) => {
      const item = activityDataList?.[index];
      const timeString =
        key === "time" ? `${item?.[key]} ${item?.timeFormat}` : item[key];
      return item?.[key] ? moment(timeString, "hh:mm A").toDate() : new Date();
    },
    [activityDataList]
  );

  const getDateValue = useCallback(
    (index, key) => {
      const dateString = activityDataList[index]?.[key];
      return dateString
        ? moment(dateString, "YYYY-MM-DD").toDate()
        : new Date();
    },
    [activityDataList]
  );

  // Memoized activity renderer
  const renderActivity = useCallback(
    (item, index) => {
      const commonProps = {
        item,
        index,
        errors,
        onCheckboxChange: handleCheckboxChange,
        onDayChange: handleDayChange,
        onTimeFormatChange: (period) =>
          handleDataChange(index, { timeFormat: period }),
        onTimeFieldClick: (key) =>
          handleModalVisibility("time", true, index, key),
        onDateFieldClick: (key) =>
          handleModalVisibility("date", true, index, key),
        onChange: (key, value) => handleDataChange(index, { [key]: value }),
        handleActivityType: handleActivityType,
        onRemoveActicty: onRemoveActicty,
      };

      switch (item.type) {
        case "Walking":
        case "Running":
          return <ActivityCard {...commonProps} />;
        case "Training":
        case "Custom":
          return <TrainingActivity {...commonProps} />;
        case "Meal":
        case "Potty":
          return <MealActivity {...commonProps} />;
        case "Vaccination":
          return <VaccineeActivity {...commonProps} />;
        case "Medication":
          return <MedicationActivity {...commonProps} />;
        default:
          return null;
      }
    },
    [
      handleCheckboxChange,
      handleDayChange,
      handleDataChange,
      handleModalVisibility,
      activityDataList,
    ]
  );

  const handleActivitySubmit = (name) => {
    const obj =
      activityTypeRef.current === "Custom"
        ? { ...DefaultActivityList[activityTypeRef.current] }
        : CustomActivity;
    setOpenNewActivity(false);
    props?.navigation?.push("addEditActivity", {
      parentid,
      petId,
      activityListData: [
        {
          ...obj,
          iscustomise: 1,
          name,
          type: activityTypeRef.current,
        },
      ],
    });
  };

  const handleActivityType = (type, index) => {
    if (type === "Medication" || type === "Vaccination") {
      activityTypeRef.current = type;
      let obj = DefaultActivityList[type];
      obj = {
        ...obj,
        copied: true,
      };
      const arr = [...activityDataList];
      arr.splice(index + 1, 0, obj);
      setActivityDataList(arr);
    } else {
      activityTypeRef.current = type;
      setOpenNewActivity(true);
    }
  };

  function isValidTime(key, time) {
    const timeRanges = {
      morning: {
        start: "05:00",
        end: "11:59",
        errorMessage: "Please Select time between 5 am to 11.59 am",
      },
      afternoon: {
        start: "12:00",
        end: "16:59",
        errorMessage: "Please Select time between 12.00 pm to 16.59 pm",
      },
      night: {
        start: "17:00",
        end: "23:59",
        errorMessage: "Please Select time between 17.00 pm to 11.59 pm",
      },
    };

    if (!timeRanges[key]) {
      return ""; // Invalid key
    }
    const inputTime = moment(time, "HH:mm");
    const startTime = moment(timeRanges[key].start, "HH:mm");
    const endTime = moment(timeRanges[key].end, "HH:mm");
    return inputTime.isBetween(startTime, endTime, undefined, "[]")
      ? ""
      : timeRanges[key].errorMessage;
  }

  const getErrors = (arr) => {
    let errors = {};
    arr.forEach((item, index) => {
      const { type, iscustomise } = item;
      if (type === "Walking" || type === "Running" || type == "Training") {
        const checkCard = item.days || item.morning || item.night || item.time;
        if (Boolean(checkCard)) {
          if (item.days && (item.morning || item.night || item.time)) {
            errors[index] = false;
          } else {
            errors[index] = true;
          }
        } else {
          errors[index] = false;
        }
      } else if (type == "Medication") {
        const checkCard = item.subname || item.quantity || item.duration;
        if (Boolean(checkCard)) {
          if (item.subname && item.quantity && item.duration) {
            if (item.duration === "Daily") {
              if (item.days && (item.morning || item.afternoon || item.night)) {
                errors[index] = false;
              } else {
                errors[index] = true;
              }
            } else {
              if (item.startdate) {
                errors[index] = false;
              } else {
                errors[index] = true;
              }
            }
          } else {
            errors[index] = true;
          }
        } else {
          errors[index] = false;
        }
      } else if (type == "Vaccination") {
        const checkCard = item.subname || item.date || item.time;
        if (Boolean(checkCard)) {
          if (item.subname && item.date && item.time) {
            errors[index] = false;
          } else {
            errors[index] = true;
          }
        } else {
          errors[index] = false;
        }
      } else if (item.iscustomise) {
        if (!item.days || !item.time) {
          errors[index] = true;
        }
      }
    });
    return errors;
  };

  const handleSubmit = async () => {
    const errors = getErrors(activityDataList);
    setError(errors);
    if (Object.values(errors).some((x) => x)) {
      showToast(
        "error",
        "Please add all the required fields in the activity card"
      );
      setActivityDataList([...activityDataList]);
    } else {
      contextValue.setLoader(true);
      const arr = [...activityDataList];
      const arr1 = [];
      arr.map(async (item, index) => {
        if (!item.iscustomise) {
          const keyArr = Object.keys(ActivityType[item.type].idIndex);
          keyArr.map(async (key) => {
            let id =
              item?.acitivityId?.[ActivityType?.[item.type]?.idIndex?.[key]];

            if (item[key]) {
              let obj = {
                ...item,
                ...ActivityType[item.type]?.defaultValue[key],
                name: ActivityType[item.type].activityLabel[key],
              };
              if (item.type == "Medication") {
                if (["morning", "afternoon", "evening"].includes(key)) {
                  obj["startdate"] = moment().format("YYYY-MM-DD");
                }
                obj["date"] = moment().format("YYYY-MM-DD");
              }
              delete obj["id"];
              if (id) {
                obj["id"] = id;
              }
              arr1.push(obj);
            } else if (id && !item[key]) {
              const obj = {
                parentid,
                id: id,
              };
              await deleteActivity(obj);
            }
          });
        } else {
          arr1.push(item);
        }
      });
      const obj = {
        petid: petId,
        parentid,
        activities: arr1,
      };
      console.log(obj);
      const res = await saveActivity(obj);

      if (res.status == 200) {
        contextValue.setLoader(false);
        dispatch(updateActivityData());
        showToast("success", "Activity added successfully");
        props?.navigation?.goBack();
      } else {
        contextValue.setLoader(false);
        showToast("error", res?.data?.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title="Add Activity" showBack bgColor="transparent" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {activityDataList.map((item, index) => (
          <React.Fragment key={`activity-${index}`}>
            {renderActivity(item, index)}
          </React.Fragment>
        ))}
        {Boolean(activityDataList.length) && (
          <View style={{ marginTop: 10 }}>
            <Button
              title="Save"
              onPress={() => {
                handleSubmit();
              }}
            />
          </View>
        )}
      </ScrollView>
      {Boolean(modalState.time.isVisible) && (
        <DateTimePicker
          isVisible={modalState.time.isVisible}
          mode="time"
          display="spinner"
          onConfirm={(date) => {
            handleModalVisibility("time", false);
            const msg = isValidTime(modalState.time.key, date);
            if (msg) {
              showToast("error", msg);
              return;
            }
            handleTimeChange(date, modalState.time.index, modalState.time.key);
          }}
          onCancel={() => handleModalVisibility("time", false)}
          is24Hour={true}
          date={getTimeValue(modalState.time.index, modalState.time.key)}
        />
      )}
      {Boolean(modalState.date.isVisible) && (
        <DateTimePicker
          isVisible={modalState.date.isVisible}
          mode="date"
          display="calendar"
          onConfirm={(date) => {
            handleModalVisibility("date", false);
            handleDateChange(date, modalState.date.index, modalState.date.key);
          }}
          onCancel={() => handleModalVisibility("date", false)}
          is24Hour={false}
          date={getDateValue(modalState.date.index, modalState.date.key)}
          minimumDate={new Date()}
        />
      )}
      {Boolean(openNewActivity) && (
        <AddActivityModal
          activityModalVisible={openNewActivity}
          toggleactivityModal={() => setOpenNewActivity(false)}
          handleActivitySubmit={handleActivitySubmit}
        />
      )}
      <Dialog
        flag={openConfirmationDialog.flag}
        description={"Are you sure you want to delete this Activity?"}
        leftButtonText="No"
        rightButtonText="Yes"
        leftButtonPressed={onConfirmationModalClose}
        rightButtonPressed={onConfirm}
        onClose={onConfirmationModalClose}
        title="Delete Activity"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(15),
  },
});

export default ActivityList;
