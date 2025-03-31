import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native-svg";
import ProfileDummy from "../assets/svg/user.svg";

const ProfilePhoto = ({ url, style, dummyImageContainerStyle = {} }) => {
  return (
    <>
      {url ? (
        <Image source={{ uri: url }} style={style} />
      ) : (
        <View
          style={[
            {
              borderWidth: 1,
              alignItems: "center",
              borderColor: "gray",
              backgroundColor: "#fff",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 48 / 2,
            },
            dummyImageContainerStyle,
          ]}
        >
          <ProfileDummy width={30} />
        </View>
      )}
    </>
  );
};

export default ProfilePhoto;

const styles = StyleSheet.create({});
