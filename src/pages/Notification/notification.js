import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const Notification = (props) => {
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={"dark-content"}
      />
       <Header title={"Notifications"} showBack bgColor="transparent"  fontColor="#EC559C" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#000",
            fontSize: moderateScale(14),
          }}
        >
          No new Notifications
        </Text>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default Notification;
