/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { SafeAreaView, StatusBar, Text } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./src/navigations/routes";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import configureStore from "./src/redux-store/store";

const store = configureStore();

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Routes />
          <Toast />
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
