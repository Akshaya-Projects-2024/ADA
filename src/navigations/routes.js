import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "./rootNavigationRef";
import AuthStack from "./authStack";
import AppStack from "./appStack";
import Splash from "../pages/Authentication/splash";
import PetParentAppStack from "./petParent/petParentAppRoutes";
import ParentDetails from "../pages/ParentRegister/parentDetails";
import PetDetail from "../pages/ParentRegister/petDetail";
import ParentHome from "../pages/Home/parentHome";
import TrendDetail from "../pages/TrendingTopics/trendDetail";
import ServiceList from "../pages/Services/serviceList";
import ServiceDetail from "../pages/Services/serviceDetail";
import UpcomingEvents from "../pages/Events/upcomingEvents";
import Service from "../pages/Services/service";
import ContactPage from "../pages/CommonPages/contactPage";
import WriteUs from "../pages/CommonPages/WriteUs";
import Feedback from "../pages/CommonPages/feedback";
import MyBookings from "../pages/Account/myBookings";
import SelectAppointment from "../pages/Services/selectAppointment";
import AppointmentDetail from "../pages/Appointment/appointmentDetail";
import IntroScreens from "../pages/Authentication/IntroScreens";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { showNotification } from "../utils/pushNotificationUtils";
import ParentReviews from "../pages/ClientReviews/parentReviews";
import CommonScreen from "../pages/Account/commonScreen";
import LostDogAlert from "../pages/Notification/rescueAlert";
import LostPetAlert from "../pages/Alerts/LostPetAlert";
import Location from "../pages/Alerts/Location";
import EmergencyAlert from "../pages/Alerts/EmergencyAlert";
import OtherLostPetAlert from "../pages/Alerts/OtherLostPetAlert";
import MedicalHelp from "../pages/Alerts/MedicalHelp";
import OtherMedicalAlert from "../pages/Alerts/otherMedicalAlert";
import RescueHelp from "../pages/Alerts/RescueHelp";
import OtherRescueHelpAlert from "../pages/Alerts/OtherRescueHelpAlert";

const Stack = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

const Routes = (props) => {
  const onMessage = async (notification) => {
    console.log("🚀 ~ onMessage ~ notification:", notification);
    try {
      if (notification && notification?.data) {
        showNotification(notification);
      }
    } catch (error) {
      console.log("onMessage:notificationAction Error: ", error);
    }
  };

  const notificationAction = async (notification) => {
    console.log("🚀 ~ notificationAction ~ notification:", notification);
    try {
      if (notification?.data) {
        // TODO DO YOUR WORK HERE
      }
    } catch (error) {
      console.log("notificationAction Error: ", error);
    }
  };
  useEffect(() => {
    const unsubscribeMessaging = messaging().onMessage(onMessage);
    const unsubscribeMessagingOpen =
      messaging().onNotificationOpenedApp(notificationAction);
    PushNotification.popInitialNotification(notificationAction);
    PushNotification.configure({
      onNotification: function (notification) {
        if (notification.userInteraction) {
          notificationAction(notification);
        }
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    return () => {
      unsubscribeMessaging();
      unsubscribeMessagingOpen();
    };
  }, []);
  return (
    <NavigationContainer
      ref={navigationRef}
      screenOptions={{
        animationEnabled: false,
      }}
    >
      <StatusBar backgroundColor={"#fff"} />
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{
          animationEnabled: false,
        }}
      >
        <Stack.Screen
          name="splash"
          component={Splash}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="intro"
          component={IntroScreens}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="auth"
          component={AuthStack}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="app"
          component={AppStack}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="petParentAppStack"
          component={PetParentAppStack}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="parentDetails"
          component={ParentDetails}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="petDetail"
          component={PetDetail}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="parentHome"
          component={ParentHome}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="myBookings"
          component={MyBookings}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="appointmentDetail"
          component={AppointmentDetail}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="trendDetail"
          component={TrendDetail}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="serviceList"
          component={ServiceList}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="serviceDetail"
          component={ServiceDetail}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="selectAppointment"
          component={SelectAppointment}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="upComingEvents"
          component={UpcomingEvents}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="service"
          component={Service}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="contactPage"
          component={ContactPage}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="writeUs"
          component={WriteUs}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="feedback"
          component={Feedback}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="parentReviews"
          component={ParentReviews}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="commonScreen"
          component={CommonScreen}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="lostPetAlert"
          component={LostPetAlert}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="location"
          component={Location}
          options={navOptionHandler}
        />
      
        <Stack.Screen
          name="otherLostPetAlert"
          component={OtherLostPetAlert}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="medicalHelp"
          component={MedicalHelp}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="otherMedicalAlert"
          component={OtherMedicalAlert}
          options={navOptionHandler}
        />
        <Stack.Screen
          name="rescueHelp"
          component={RescueHelp}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="otherRescueHelpAlert"
          component={OtherRescueHelpAlert}
          options={navOptionHandler}
        />

        <Stack.Screen
          name="emergencyAlert"
          component={EmergencyAlert}
          options={navOptionHandler}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Routes;
