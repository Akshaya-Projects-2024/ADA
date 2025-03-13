import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Children, useState } from "react";
import { useUser } from "../api/UserContext";
import Strings from "../constants/strings";
import Dialog from "./Dialog";
import Button from "./Button";

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
  const { userData } = useUser();
  const [title, setTitle] = useState("");

  const handlePress = async () => {
    if (checkPermission) {
      console.log(userData?.providerProfile?.subscription);
      if (userData?.logindetails?.providerstatus === "PENDING") {
        setTitle(customMsgForRegistration ?? Strings.approvalAlertForRegistration);
      } else if (
        userData?.logindetails?.providerstatus === "AAPPROVALPENDING"
      ) {
        setTitle(customMsgForApproval ?? Strings.approvaltError);
      } else if (
        checkPayment &&
        userData?.logindetails?.providerstatus === "APPROVED" &&
        userData?.providerProfile?.subscription?.status !== "active"
      ) {
        setTitle(customMsgForPayment ?? Strings.paymentError);
      } else {
        rest?.onPress?.();
      }
    } else {
      rest?.onPress?.();
    }
  };
  console.log(userData);

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
