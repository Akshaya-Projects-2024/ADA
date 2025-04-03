import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ActivityType } from "../../../constants/enums";
import MissedIc from "../../../assets/svg/MissedIc";
import CheckOutline from "../../../assets/svg/checkOutline";
import { styles } from "./styles";
import moment from "moment";

export const ActivityListItem = memo(({ item, updateActivity,onCardPress }) => {
  const renderValue = () => {
    if (item.iscustomise) {
      return item.time;
    } else {
      if (item.type == "Medication") {
        return item.duration !== "Daily"
          ? item.startdate
          : item[item.name.toLowerCase()];
      } else if (item.type == "Vaccination") {
        return item.time;
      } else {
        return item?.[
          ActivityType[item.type].activityLabel[
            item.name?.toLowerCase()
          ]?.toLowerCase()
        ];
      }
    }
  };

  const getValidValue = () => {
    if (item.iscustomise) {
      return moment(item.time, "HH:mm:ss");
    } else {
      if (item.type == "Medication") {
        return item.duration !== "Daily"
          ? moment(item.startdate, "YYY-MM-DD")
          : moment(item[item.name.toLowerCase()], "HH:mm:ss");
      } else if (item.type == "Vaccination") {
        return moment(`${item.date} ${item.time}`, "YYYY-MM-DD HH:mm:ss");
      } else {
        return moment(item[item.name.toLowerCase()], "HH:mm:ss");
      }
    }
  };

  return (
    <View style={styles.activityItemContainer}>
      <LinearGradient
        colors={ActivityType[item.type].colors}
        style={styles.activityGradient}
      >
        <TouchableOpacity style={{width: "60%"}}onPress={() => onCardPress(item)} >
          <View>{ActivityType[item.type].icon()}</View>
          <Text style={styles.activityTime}>{renderValue(item)}</Text>
          <Text style={[styles.activityName]}>
            {item?.iscustomise
              ? item.name
              : item.type == "Medication" || item.type == "Vaccination"
              ? item.subname +
                " " +
                ActivityType[item.type].label[[item.name.toLowerCase()]]
              : ActivityType[item.type].label[[item.name.toLowerCase()]]}
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={[
              styles.activityButton,
              {
                backgroundColor:
                  item?.activitystatus?.id && !item.activitystatus.status
                    ? "#E9967A"
                    : "white",
              },
            ]}
            onPress={() => updateActivity(item, 0, getValidValue())}
          >
            <MissedIc />
            <Text style={styles.buttonText}>Missed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              [
                styles.activityButton,
                {
                  backgroundColor:
                    item?.activitystatus?.id && item.activitystatus.status
                      ? "#ACE1AF"
                      : "white",
                },
              ],
              styles.marginTop10,
            ]}
            onPress={() => updateActivity(item, 1, getValidValue())}
            // disabled={todayDate !== selectedDate}
          >
            <CheckOutline
              strokeColor={
                item?.activitystatus?.id && item.activitystatus.status
                  ? "white"
                  : "black"
              }
            />
            <Text style={[styles.buttonText]}>Done</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
});
