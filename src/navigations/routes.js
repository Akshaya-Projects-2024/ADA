import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "./rootNavigationRef";
import AuthStack from "./authStack";
import AppStack from "./appStack";
import Splash from "../pages/Authentication/splash";

const Stack = createStackNavigator();

const navOptionHandler = () => ({
  headerShown: false,
  gestureEnabled: false,
});

export default Routes = (props) => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
