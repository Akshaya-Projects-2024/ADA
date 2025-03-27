import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import { THEMES } from "../../../assets/theme/themes";
import CrossIcon from "../../../assets/svg/CrossIcon";
import { styles } from "./styles";
import { ActivityType } from "../../../constants/enums";
import { getCurrentRoute } from "../../../navigations/rootNavigationRef";
import { useNavigation } from "@react-navigation/native";

export const ActivityHeader = ({
  type,
  name,
  iscustomise,
  handleActivityType,
  index,
  item,
  onRemoveActicty
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {ActivityType[iscustomise ? "Custom" : type].icon()}
        <Text style={styles.activityText}>{name}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {getCurrentRoute() !== "addEditActivity" && 
          (type === "Medication" || type == "Vaccination") && (
            <TouchableOpacity
              style={{
                width: 24,
                height: 24,
                alignItems: "center",
              }}
              onPress={() => handleActivityType(type, index)}
            >
              <Octicons
                name="duplicate"
                size={18}
                color={THEMES.colors.black}
              />
            </TouchableOpacity>
          )}
        {Boolean(getCurrentRoute() !== "addEditActivity") && (
          <TouchableOpacity
            style={{
              width: 24,
              height: 24,
              marginLeft: 5,
              alignItems: "center",
            }}
            onPress={() => onRemoveActicty(index,item)}
          >
            <CrossIcon width={18} height={18} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
