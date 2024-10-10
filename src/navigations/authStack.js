import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigation from "./BottomTabNavigation";
import BusinessDetail from "../pages/Account/businessDetail";
import MyProfile from "../pages/Account/myProfile";
import MediaLink from "../pages/Account/mediaLink";
import ContactDetails from "../pages/Account/contactDetails";
import UploadImagesDocs from "../pages/Account/uploadImagesDocs";
import SessionDetail from "../pages/Account/sessionDetail";
import PaymentsSubscription from "../pages/Payment/paymentsSubscription";
import PaymentDetails from "../pages/Payment/paymentDetails";
import ClientReview from "../pages/ClientReviews/clientReview";
import MarkHoliday from "../pages/Account/markHoliday";
import CancelAppointment from "../pages/Appointment/cancelAppointment";
import RescheduleAppointment from "../pages/Appointment/rescheduleAppointment";
import MyBookings from "../pages/Account/myBookings";
import NewTopic from "../pages/TrendingTopics/newTopic";
import TrendDetail from "../pages/TrendingTopics/trendDetail";
import AdoptionDetail from "../pages/PetAdoption/adoptionDetail";
import RescueAlert from "../pages/Notification/rescueAlert";
import MedicalAlert from "../pages/Notification/medicalAlert";
import AppointmentDetail from "../pages/Appointment/appointmentDetail";
import CreateEvent from "../pages/Events/createEvent";
import CalendarScreen from "../pages/Events/calendarScreen";
import Search from "../pages/TrendingTopics/search";
import LostDogAlert from "../pages/Notification/rescueAlert";
import RoleSelection from "../pages/Authentication/roleSelection";

const AuthStacks = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: true,
});

const AuthStack = () => (
  <AuthStacks.Navigator
    initialRouteName={"home"}
    screenOptions={{
      headerShown: false,
    }}
  >
     <AuthStacks.Screen
      name="home"
      component={BottomTabNavigation}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="roleSelection"
      component={RoleSelection}
      options={navOptionHandler}
    />

   
    <AuthStacks.Screen
      name="businessDetail"
      component={BusinessDetail}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="myProfile"
      component={MyProfile}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="mediaLink"
      component={MediaLink}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="contactDetails"
      component={ContactDetails}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="uploadImagesDocs"
      component={UploadImagesDocs}
      options={navOptionHandler}
    />
    <AuthStacks.Screen
      name="sessionDetail"
      component={SessionDetail}
      options={navOptionHandler}
    />
    <AuthStacks.Screen
      name="paymentsSubscription"
      component={PaymentsSubscription}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="paymentDetails"
      component={PaymentDetails}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="clientReview"
      component={ClientReview}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="markHoliday"
      component={MarkHoliday}
      options={navOptionHandler}
    />
    <AuthStacks.Screen
      name="cancelAppointment"
      component={CancelAppointment}
      options={navOptionHandler}
    />
    <AuthStacks.Screen
      name="rescheduleAppointment"
      component={RescheduleAppointment}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="myBookings"
      component={MyBookings}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="newTopic"
      component={NewTopic}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="trendDetail"
      component={TrendDetail}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="adoptionDetail"
      component={AdoptionDetail}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="lostDogAlert"
      component={LostDogAlert}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="rescueAlert"
      component={RescueAlert}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="medicalAlert"
      component={MedicalAlert}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="appointmentDetail"
      component={AppointmentDetail}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="createEvent"
      component={CreateEvent}
      options={navOptionHandler}
    />
    <AuthStacks.Screen
      name="calendarScreen"
      component={CalendarScreen}
      options={navOptionHandler}
    />
    <AuthStacks.Screen
      name="search"
      component={Search}
      options={navOptionHandler}
    />
  </AuthStacks.Navigator>
);

export default AuthStack;
