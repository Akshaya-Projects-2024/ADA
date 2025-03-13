import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Checked from "../../assets/svg/checked.svg";
import UnChecked from "../../assets/svg/unchecked.svg";

import { moderateScale } from "react-native-size-matters";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { showToast } from "../../utils/utils";
import CheckBox from "react-native-check-box";
import { LoginModules } from "../../constants/enums";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";

const EmergencyAlert = (props) => {
  const [agree, setAgree] = useState(false);
  const [alertType, setAlertType] = useState();
  const [type, setType] = useState();
  const [provider, setProvider] = useState(false);

  const { loggedInModule, guestUser, logindetails } = useSelector(
    (state) => state?.register
  );
  const profile = useSelector((state) => state?.commonReducer);

  const alertOptions = [
    { type: "Rescue", image: require("../../assets/images/rescue.png") },
    { type: "Lost Pet", image: require("../../assets/images/lost.png") },
    { type: "Medical", image: require("../../assets/images/medical.png") },
  ];

  useEffect(() => {
    if (loggedInModule === LoginModules.provider) {
      setProvider(true);
    } else {
      setProvider(false);
    }
  }, []);

  const onSubmit = () => {
    if (!alertType) {
      showToast("error", "Please select the alert type");
    } else if (!type && !provider) {
      showToast("error", "Please select whom we are creating alert");
    } else if (!agree) {
      showToast("error", "Please select terms & condition");
    } else {
      if (!provider) {
        if (alertType == "Lost Pet" && type == "Pet") {
          props.navigation.navigate("lostPetAlert");
        } else if (alertType == "Lost Pet" && type == "otherPet") {
          props.navigation.navigate("otherLostPetAlert");
        } else if (alertType == "Medical" && type == "Pet") {
          props.navigation.navigate("medicalHelp");
        } else if (alertType == "Medical" && type == "otherPet") {
          props.navigation.navigate("otherMedicalAlert");
        } else if (alertType == "Rescue" && type == "Pet") {
          props.navigation.navigate("rescueHelp");
        } else if (alertType == "Rescue" && type == "otherPet") {
          props.navigation.navigate("otherRescueHelpAlert");
        }
      } else {
        if (alertType == "Lost Pet") {
          props.navigation.navigate("otherLostPetAlert");
        } else if (alertType == "Medical") {
          props.navigation.navigate("otherMedicalAlert");
        } else if (alertType == "Rescue") {
          props.navigation.navigate("otherRescueHelpAlert");
        }
      }
      setAgree(false);
      setAlertType();
      setType();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
        <StatusBar backgroundColor={THEMES.colors.white} />
        <Header title="Create Emergency Alert" fontColor="#000" showBack />
        <ScrollView style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
          <View
            style={{
              flex: 1,
              paddingTop: moderateScale(30),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <Text
              style={{
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font12,
                color: THEMES.colors.black,
              }}
            >
              Select alert type
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: moderateScale(11),
              }}
            >
              {alertOptions.map((item) => (
                <>
                  <TouchableOpacity
                    key={item.type}
                    style={{
                      alignItems: "center",
                      padding: moderateScale(5),
                      borderRadius: 10,
                    }}
                    onPress={() => setAlertType(item.type)}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ width: 90, height: 90, borderRadius: 10 }}
                      source={item.image}
                    />
                    {alertType === item.type && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          width: 100,
                          height: 100,
                          borderRadius: 10,
                          backgroundColor: "#00BBC8", // Light blue transparent overlay
                          borderRadius: 10,
                          opacity: 0.4,
                        }}
                      ></View>
                    )}
                    <Text
                      style={{
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font12,
                        color: THEMES.colors.black,
                        paddingTop: moderateScale(5),
                      }}
                    >
                      {item.type}
                    </Text>
                  </TouchableOpacity>
                </>
              ))}
            </View>

            {!provider ? (
              <>
                <View style={{ paddingTop: moderateScale(30) }}>
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.semiBold,
                      fontSize: THEMES.fonts.font12,
                      color: THEMES.colors.black,
                    }}
                  >
                    For whom we are creating alert
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: moderateScale(20),
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setType("Pet")}
                    style={{
                      alignItems: "center",
                      width: "50%",
                      justifyContent: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 10,
                        marginTop: 5,
                      }}
                      source={{
                        uri: profile?.parentProfie?.petDetails?.[0]
                          ?.documents?.[0]?.url,
                      }}
                    />

                    {type === "Pet" && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          width: 100,
                          height: 100,
                          borderRadius: 10,
                          backgroundColor: "#00BBC8", // Light blue transparent overlay
                          opacity: 0.4,
                        }}
                      ></View>
                    )}

                    <Text
                      style={{
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font12,
                        color: THEMES.colors.black,
                        paddingTop: moderateScale(5),
                        textAlign: "center",
                      }}
                    >
                      Create Alert for{" "}
                      {profile?.parentProfie?.petDetails?.[0]?.name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setType("otherPet")}
                    style={{
                      alignItems: "center",
                      width: "50%",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 10,
                        marginTop: 5,
                      }}
                      source={require("../../assets/images/rescue.png")}
                    />

                    {type === "otherPet" && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          width: 100,
                          height: 100,
                          borderRadius: 10,
                          backgroundColor: "#00BBC8", // Light blue transparent overlay
                          opacity: 0.4,
                        }}
                      ></View>
                    )}

                    <Text
                      style={{
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font12,
                        color: THEMES.colors.black,
                        paddingTop: moderateScale(5),
                        width: "80%",
                        textAlign: "center",
                      }}
                    >
                      Other pet
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </ScrollView>
        <View
          style={{
            bottom: 0,
            paddingVertical: 10,
            backgroundColor: THEMES.colors.bgColor,
            paddingHorizontal: moderateScale(30),
          }}
        >
          <View
            style={{
              paddingTop: moderateScale(24),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              marginHorizontal: moderateScale(50),
            }}
          >
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setAgree(!agree)}
              isChecked={agree}
              style={{
                flex: 1,
                alignSelf: "center",
                flexGrow: 1, // Prevent it from growing too large
                flexShrink: 1,
              }}
              rightText={"Agree terms and conditions"}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.medium,
              }}
            />
          </View>
          {/* <View
            style={{
              paddingTop: moderateScale(16),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UnChecked />
            <Text
              style={{
                paddingLeft: moderateScale(8),
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font12,
                color: THEMES.colors.black,
              }}
            >
              Agree terms and conditions
            </Text>
           
          </View> */}

          <View style={{ paddingVertical: moderateScale(20) }}>
            <TouchableButtonWithPermission
              customMsgForRegistration={
                "Complete your Registration and Subscribe to the app to create new alerts."
              }
              useButton={true}
              title="Submit"
              onPress={() => onSubmit()}
            ></TouchableButtonWithPermission>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmergencyAlert;
