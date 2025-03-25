import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import ShareImg from "../../../assets/svg/share.svg";
import { styles } from "./styles";

export const WeekView = memo(
  ({ weekList, setWeekList, toggleContactModal }) => (
    <View style={styles.weekViewContainer}>
      <View style={styles.weekHeaderContainer}>
        <Text style={styles.todayText}>
          Today {"  "}
          <Text style={styles.dateText}>{moment().format("DD MMMM")}</Text>
        </Text>
        <TouchableOpacity onPress={toggleContactModal}>
          <ShareImg />
        </TouchableOpacity>
      </View>
      <View style={styles.daysContainer}>
        {weekList?.weekList?.map((item, index) => (
          <TouchableOpacity
            key={item}
            onPress={() => setWeekList({ ...weekList, selectedDate: item })}
            style={
              weekList.selectedDate === item
                ? styles.selectedDate
                : styles.dateButton
            }
          >
            <Text style={styles.getDayText(weekList.selectedDate === item)}>
              {moment(item).format("ddd")}
            </Text>
            <Text style={styles.getDayText(weekList.selectedDate === item)}>
              {moment(item).format("DD")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
);
