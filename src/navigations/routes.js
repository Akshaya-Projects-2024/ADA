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
import WorkingHours from "../pages/Account/WorkingHours";
import ContactPage from "../pages/CommonPages/contactPage";
import WriteUs from "../pages/CommonPages/WriteUs";
import Feedback from "../pages/CommonPages/feedback";
import MyBookings from "../pages/Account/myBookings";

const Stack = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

const Routes = (props) => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Routes;
