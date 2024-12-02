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
import CommonScreen from "../pages/Account/commonScreen";
import ParentDetails from "../pages/ParentRegister/parentDetails";
import PetDetail from "../pages/ParentRegister/petDetail";
import Service from "../pages/Services/service";
import ServiceDetail from "../pages/Services/serviceDetail";
import SelectAppointment from "../pages/Services/selectAppointment";
import ServiceList from "../pages/Services/serviceList";
import EmergencyAlert from "../pages/Alerts/EmergencyAlert";
import LostPetAlert from "../pages/Alerts/LostPetAlert";
import MedicalHelp from "../pages/Alerts/MedicalHelp";
import OtherPet from "../pages/Alerts/OtherPet";
import WorkingHours from "../pages/Account/WorkingHours";

const AuthStacks = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: true,
});

const AuthStack = () => (
  <AuthStacks.Navigator
    initialRouteName={"roleSelection"}
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStacks.Screen
      name="roleSelection"
      component={RoleSelection}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="home"
      component={BottomTabNavigation}
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
      name="workingHours"
      component={WorkingHours}
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
    <AuthStacks.Screen
      name="commonScreen"
      component={CommonScreen}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="service"
      component={Service}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="serviceDetail"
      component={ServiceDetail}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="selectAppointment"
      component={SelectAppointment}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="serviceList"
      component={ServiceList}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="emergencyAlert"
      component={EmergencyAlert}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="lostPetAlert"
      component={LostPetAlert}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="medicalHelp"
      component={MedicalHelp}
      options={navOptionHandler}
    />

    <AuthStacks.Screen
      name="otherPet"
      component={OtherPet}
      options={navOptionHandler}
    />
  </AuthStacks.Navigator>
);

export default AuthStack;
