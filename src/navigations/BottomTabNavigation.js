import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../pages/Home/home";
import TrendingTopics from "../pages/TrendingTopics/trendingTopics";
import PetAdoption from "../pages/PetAdoption/petAdoption";
import MyAccount from "../pages/Account/myAccount";
import BottomTabBarItem from "./BottomTabBarItem";
import AlertList from "../pages/Alerts/AlertList";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const Tab = createBottomTabNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

export default function BottomTabNavigation() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBar={(props) =>
        isKeyboardVisible ? <></> : <BottomTabBarItem {...props} />
      }
    >
      <Tab.Screen name="home" component={Home} options={navOptionHandler} />

      <Tab.Screen
        name="trendingTopics"
        component={TrendingTopics}
        options={navOptionHandler}
      />
      <Tab.Screen
        name="petAdoption"
        component={PetAdoption}
        options={navOptionHandler}
      />
      <Tab.Screen
        name="alertList"
        component={AlertList}
        options={navOptionHandler}
      />
      <Tab.Screen
        name="myAccount"
        component={MyAccount}
        options={navOptionHandler}
      />
    </Tab.Navigator>
  );
}
