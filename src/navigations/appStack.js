import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../pages/Authentication/signIn";
import OtpScreen from "../pages/Authentication/otpScreen";
import RoleSelection from "../pages/Authentication/roleSelection";
import BusinessDetail from "../pages/Account/businessDetail";
import MediaLink from "../pages/Account/mediaLink";
import ContactDetails from "../pages/Account/contactDetails";
import UploadImagesDocs from "../pages/Account/uploadImagesDocs";
import SessionDetail from "../pages/Account/sessionDetail";

const AppStacks = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: true,
});

const AppStack = () => (
  <AppStacks.Navigator
    initialRouteName={"signIn"}
    screenOptions={{
      headerShown: false,
    }}
  >
    <AppStacks.Screen
      name="signIn"
      component={SignIn}
      options={navOptionHandler}
    />

    <AppStacks.Screen
      name="otpScreen"
      component={OtpScreen}
      options={navOptionHandler}
    />
  </AppStacks.Navigator>
);

export default AppStack;
