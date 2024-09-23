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
import Search from "../pages/TrendingTopics/search";
import SelectDate from "../pages/Account/selectDate";

const Stack = createStackNavigator();
const AppStack = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

export default Routes = (props) => {
  const App = () => {
    return (
      <AppStack.Navigator initialRouteName={"home"}>
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
          name="search"
          component={Search}
          options={navOptionHandler}
        />
        <AppStack.Screen
          name="selectDate"
          component={SelectDate}
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
