import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PetParentBottoTabbarItem from "./petParentBottomTabbarItem";
import ParentHome from "../../pages/Home/parentHome";
import TrendingTopics from "../../pages/TrendingTopics/trendingTopics";
import PetAdoption from "../../pages/PetAdoption/petAdoption";
import Chat from "../../pages/Chat/chat";
import ParentAccount from "../../pages/Account/parentAccount";

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

const Tab = createBottomTabNavigator();

const PetParentAppStack = () => (
  <Tab.Navigator
    initialRouteName="parentHome"
    tabBar={(props) => <PetParentBottoTabbarItem {...props} />}
  >
    <Tab.Screen
      name="parentHome"
      component={ParentHome}
      options={navOptionHandler}
    />
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
    <Tab.Screen name="chat" component={Chat} options={navOptionHandler} />
    <Tab.Screen
      name="parentAccount"
      component={ParentAccount}
      options={navOptionHandler}
    />
  </Tab.Navigator>
);

export default PetParentAppStack;
