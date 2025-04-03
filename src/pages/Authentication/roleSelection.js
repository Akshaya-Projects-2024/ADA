import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Tick from "../../assets/svg/check-circle.svg";
import Button from "../../components/Button";
import Modal from "react-native-modal";
import Cross from "../../assets/svg/cross.svg";
import { useDispatch, useSelector } from "react-redux";
import { dispathGuestUser } from "../../redux-store/actions/userActions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { decryptService, encryptService } from "../../utils/storageFunc";
import { requestNotificationPermission } from "../../utils/permissionUtils";

const RoleSelection = (props) => {
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { logindetails } = useSelector((state) => state?.commonReducer);

  const onLaterPressed = (type) => {
    dispatch(dispathGuestUser(true));
    setModalVisible(false);
    setTimeout(() => {
      if (type === "service") {
        props.navigation.reset({
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
      } else {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "petParentAppStack" }],
        });
      }
    });
  };

  useEffect(() => {
    init()
  },[]);

  const init = async () => {
    await requestNotificationPermission();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={"dark-content"}
      />
      <ImageBackground
        source={require("../../assets/images/bgImage.png")}
        resizeMode="cover"
        style={{ flex: 1, paddingTop: moderateScale(top) }}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
            marginTop: "35%",
          }}
        >
          <Text
            key={`moderateScale_${selected}`}
            style={{
              color: THEMES.colors.black,
              fontFamily: THEMES.fontFamily.bold,
              fontSize: THEMES.fonts.font24,
              textAlign: "center",
            }}
          >
            🐾 Selection of Roles 🐾
          </Text>
          <Text
            style={{
              color: THEMES.colors.black,
              fontFamily: THEMES.fontFamily.regular,
              fontSize: THEMES.fonts.font18,
              textAlign: "center",
              paddingTop: moderateScale(25),
              paddingHorizontal: moderateScale(45),
            }}
          >
            Choose your role and
          </Text>
          <Text
            style={{
              color: THEMES.colors.black,
              fontFamily: THEMES.fontFamily.regular,
              fontSize: THEMES.fonts.font18,
              textAlign: "center",
              paddingTop: moderateScale(1),
              paddingHorizontal: moderateScale(45),
            }}
          >
            start your adventure!
          </Text>
          <View
            style={{
              paddingTop: moderateScale(45),
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={async () => {
                setSelected("parent");
                const val = await decryptService("isPetParentRegisterLater");
                if (!val && !Boolean(logindetails?.isparent)) {
                  setModalVisible(true);
                } else {
                  onLaterPressed("parent");
                }
              }}
            >
              <Image
                style={{
                  width: moderateScale(112),
                  height: moderateScale(112),
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#CFD3D4",
                }}
                source={require("../../assets/images/profileImg.png")}
              />
              {selected == "parent" && (
                <>
                  <View
                    style={{
                      width: moderateScale(112),
                      height: moderateScale(112),
                      borderRadius: 10,
                      backgroundColor: "#0b7e5a",
                      opacity: 0.7,
                      position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <View
                    style={{
                      width: moderateScale(112),
                      height: moderateScale(112),
                      borderRadius: 10,
                      position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Tick />
                  </View>
                </>
              )}

              <Text
                style={{
                  color: THEMES.colors.black,
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font14,
                  textAlign: "center",
                  paddingTop: moderateScale(20),
                }}
              >
                Pet Parent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setSelected("service");
                const val = await decryptService("isPetProviderRegisterLater");
                if (!val && !Boolean(logindetails?.isprovider)) {
                  setModalVisible(true);
                } else {
                  onLaterPressed("service");
                }
              }}
              style={{ marginLeft: moderateScale(43), alignItems: "center" }}
            >
              <Image
                style={{
                  width: moderateScale(112),
                  height: moderateScale(112),
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#CFD3D4",
                }}
                source={require("../../assets/images/profileImg.png")}
              />

              {selected == "service" && (
                <>
                  <View
                    style={{
                      width: moderateScale(112),
                      height: moderateScale(112),
                      borderRadius: 10,
                      backgroundColor: "#0b7e5a",
                      opacity: 0.7,
                      position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <View
                    style={{
                      width: moderateScale(112),
                      height: moderateScale(112),
                      borderRadius: 10,
                      position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Tick />
                  </View>
                </>
              )}

              <Text
                style={{
                  color: THEMES.colors.black,
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font14,
                  textAlign: "center",
                  paddingTop: moderateScale(20),
                }}
              >
                Pet Service Provider
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          onBackdropPress={() => setModalVisible(false)}
          transparent={true}
          animationType="none"
          style={{
            margin: 0,
          }}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font20,
                    color: THEMES.colors.black,
                    width: "75%",
                    lineHeight: moderateScale(30),
                  }}
                >
                  Unlock a World of Tail-Wagging Fun!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelected("");
                    setModalVisible(false);
                  }}
                >
                  <Cross />
                </TouchableOpacity>
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.regular,
                    fontSize: THEMES.fonts.font16,
                    color: THEMES.colors.black,
                    lineHeight: moderateScale(22),
                  }}
                >
                  Would you like to register for purr-sonalized profile and
                  pawsome content?
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: moderateScale(31),
                }}
              >
                <View style={{ width: "45%" }}>
                  <Button
                    textColor="#000"
                    onlyBorder
                    title="Later"
                    onPress={async () => {
                      await encryptService(
                        "loggedInModule",
                        selected == "service" ? "provider" : "parent"
                      );
                      encryptService(
                        selected == "service"
                          ? "isPetProviderRegisterLater"
                          : "isPetParentRegisterLater",
                        true
                      );
                      onLaterPressed(selected);
                    }}
                  />
                </View>
                <View style={{ width: "45%" }}>
                  <Button
                    title="Register"
                    onPress={() => {
                      encryptService(
                        selected == "service"
                          ? "isPetProviderRegisterLater"
                          : "isPetParentRegisterLater",
                        false
                      );
                      setModalVisible(false);
                      setTimeout(() => {
                        if (selected == "service") {
                          props.navigation.navigate("businessDetail");
                        } else {
                          props.navigation.navigate("parentDetails");
                        }
                      }, 200);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: moderateScale(20),
  },
  modalContent: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 16,
    padding: moderateScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: moderateScale(20),
  },
});

export default RoleSelection;
