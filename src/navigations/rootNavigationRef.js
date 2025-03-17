import * as React from "react";

import { CommonActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute().name;
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function dispatch(name, params) {
  navigationRef.current?.navigate?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    })
  );
}
export function resetNavigation(name) {
  navigationRef.current.reset({
    index: 0,
    routes: [{ name }],
  });
}

export function navigateToParent(name, navigation) {
  navigation?.reset({
    index: 0,
    routes: [{ name: "petParentAppStack" }],
  });
}

export const navigateToServiceProvider = (navigation) => {
  navigation?.reset({
    index: 0,
    routes: [
      {
        name: "auth",
        state: {
          routes: [
            {
              name: "home",
            },
          ],
        },
      },
    ],
  });
};
