import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ActivityType } from "../../../constants/enums";
import MissedIc from "../../../assets/svg/MissedIc";
import CheckOutline from "../../../assets/svg/checkOutline";
import { styles } from "./styles";

export const ActivityListItem = memo(({ item, updateActivity }) => (
  <View style={styles.activityItemContainer}>
    <LinearGradient
      colors={ActivityType[item.type].colors}
      style={styles.activityGradient}
    >
      <View>
        <View>{ActivityType[item.type].icon()}</View>
        <Text style={styles.activityTime}>
          {item?.iscustomise
            ? item.time
            : item.type == "Medication"
            ? item.duration !== "Daily"
              ? item.startdate
              : item[item.name.toLowerCase()]
            : item.type == "Vaccination"
            ? item.time
            : item[item.name.toLowerCase()]}
        </Text>
        <Text>
          {item?.iscustomise
            ? item.name
            : item.type == "Medication" || item.type == "Vaccination"
            ? item.subname + " " + item.type
            : ActivityType[item.type].label[[item.name.toLowerCase()]]}
        </Text>
      </View>
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
          onPress={() => updateActivity(item, 0)}
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
          onPress={() => updateActivity(item, 1)}
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
));
