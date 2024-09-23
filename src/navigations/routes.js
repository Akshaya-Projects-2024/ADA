import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "./rootNavigationRef";
import BottomTabNavigation from "./BottomTabNavigation";
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
import SignIn from "../pages/Authentication/signIn";
import OtpScreen from "../pages/Authentication/otpScreen";
import RoleSelection from "../pages/Authentication/roleSelection";
import AdoptionDetail from "../pages/PetAdoption/adoptionDetail";
import LostDogAlert from "../pages/Notification/lostDogAlert";
import RescueAlert from "../pages/Notification/rescueAlert";
import MedicalAlert from "../pages/Notification/medicalAlert";
import AppointmentDetail from "../pages/Appointment/appointmentDetail";
import CreateEvent from "../pages/Events/createEvent";
import CalendarScreen from "../pages/Events/calendarScreen";
import Search from "../pages/TrendingTopics/search";

const Stack = createStackNavigator();
const AppStack = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

export default Routes = (props) => {
  const App = () => {
    return (
      <AppStack.Navigator initialRouteName={"signIn"}>
        <AppStack.Screen
          name="signIn"
          component={SignIn}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="otpScreen"
          component={OtpScreen}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="roleSelection"
          component={RoleSelection}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="home"
          component={BottomTabNavigation}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="myProfile"
          component={MyProfile}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="mediaLink"
          component={MediaLink}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="contactDetails"
          component={ContactDetails}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="uploadImagesDocs"
          component={UploadImagesDocs}
          options={navOptionHandler}
        />
        <AppStack.Screen
          name="sessionDetail"
          component={SessionDetail}
          options={navOptionHandler}
        />
        <AppStack.Screen
          name="paymentsSubscription"
          component={PaymentsSubscription}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="paymentDetails"
          component={PaymentDetails}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="clientReview"
          component={ClientReview}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="markHoliday"
          component={MarkHoliday}
          options={navOptionHandler}
        />
        <AppStack.Screen
          name="cancelAppointment"
          component={CancelAppointment}
          options={navOptionHandler}
        />
        <AppStack.Screen
          name="rescheduleAppointment"
          component={RescheduleAppointment}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="myBookings"
          component={MyBookings}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="newTopic"
          component={NewTopic}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="trendDetail"
          component={TrendDetail}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="adoptionDetail"
          component={AdoptionDetail}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="lostDogAlert"
          component={LostDogAlert}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="rescueAlert"
          component={RescueAlert}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="medicalAlert"
          component={MedicalAlert}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="appointmentDetail"
          component={AppointmentDetail}
          options={navOptionHandler}
        />

        <AppStack.Screen
          name="createEvent"
          component={CreateEvent}
          options={navOptionHandler}
        />
        <AppStack.Screen
          name="calendarScreen"
          component={CalendarScreen}
          options={navOptionHandler}
        />
         <AppStack.Screen
          name="search"
          component={Search}
          options={navOptionHandler}
        />
      </AppStack.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      screenOptions={{
        animationEnabled: false,
      }}
    >
      <StatusBar backgroundColor={"#fff"} />
      <Stack.Navigator
        screenOptions={{
          animationEnabled: false,
        }}
      >
        <Stack.Screen name="app" component={App} options={navOptionHandler} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
