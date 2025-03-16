import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Children, useState } from "react";
import { useUser } from "../api/UserContext";
import Strings from "../constants/strings";
import Dialog from "./Dialog";
import Button from "./Button";
import { useSelector } from "react-redux";
import { LoginModules } from "../constants/enums";

const TouchableButtonWithPermission = ({
  checkPayment = true,
  useButton = false,
  checkPermission = true,
  children,
  customMsgForRegistration = "",
  customMsgForApproval = "",
  customMsgForPayment = "",
  ...rest
}) => {
  const { loggedInModule } = useSelector((state) => state?.register);
  const [title, setTitle] = useState("");
  const isServiceProvider = loggedInModule === LoginModules.provider;
  const profile = useSelector((state) => state?.commonReducer);

  const handlePress = async () => {
    if (checkPermission) {
      const registrationStatus =
        profile?.logindetails?.[
          isServiceProvider ? "providerstatus" : "parentstatus"
        ];
      const paymentStatus =
        profile?.[isServiceProvider ? "providerProfile" : "parentProfie"]
          ?.subscription?.status;

      if (registrationStatus === "PENDING") {
        setTitle(
          customMsgForRegistration
            ? customMsgForRegistration
            : Strings.approvalAlertForRegistration
        );
      } else if (registrationStatus === "AAPPROVALPENDING") {
        setTitle(
          customMsgForApproval ? customMsgForApproval : Strings.approvaltError
        );
      } else if (
        checkPayment &&
        registrationStatus === "APPROVED" &&
        paymentStatus !== "active"
      ) {
        setTitle(
          customMsgForPayment ? customMsgForPayment : Strings.paymentError
        );
      } else {
        rest?.onPress?.();
      }
    } else {
      rest?.onPress?.();
    }
  };

  return (
    <>
      {useButton ? (
        <Button {...rest} onPress={handlePress} />
      ) : (
        <TouchableOpacity {...rest} onPress={handlePress}>
          {children}
        </TouchableOpacity>
      )}

      <Dialog
        flag={Boolean(title)}
        title={"Warning!!!"}
        description={title}
        rightButtonText="Close"
        rightButtonPressed={() => {
          setTitle("");
        }}
        onClose={() => {
          setTitle("");
        }}
      />
    </>
  );
};

export default TouchableButtonWithPermission;
