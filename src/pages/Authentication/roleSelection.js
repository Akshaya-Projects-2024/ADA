import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Header from "../../components/Header";
import Tick from "../../assets/svg/check-circle.svg";
import Button from "../../components/Button";
import Strings from "../../constants/strings";
import Modal from "react-native-modal";
import Cross from "../../assets/svg/cross.svg";
import { decryptService } from "../../utils/storageFunc";
import { getProfile } from "../../redux-store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { saveRegisterData } from "../../redux-store/actions/registerAction";

const RoleSelection = (props) => {
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const {registerData} = useSelector(({register}) => register);


  // const checkAllIds = () =>{
  //   if(Object.keys(registerData).length !== 0){
  //     return Object.keys(registerData).every(key => {
  //       const obj = registerData[key];
  //       if (Array.isArray(obj)) {
  //         return true;
  //       }
  //       return obj.id === 0;
  //     });
  //   }
  // }

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    let obj = {
      userid: await decryptService("userId"),
    };
    try {
      let response = await getProfile(obj);
      dispatch(saveRegisterData(response?.data?.data));
    } catch (error) {
      console.log("err111", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title={""} showBack bgColor="transparent" />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: moderateScale(100),
        }}
      >
        <Text
          style={{
            color: THEMES.colors.black,
            fontFamily: THEMES.fontFamily.bold,
            fontSize: THEMES.fonts.font20,
            textAlign: "center",
            paddingHorizontal: moderateScale(45),
          }}
        >
          🐾 Selection of Roles 🐾
        </Text>
        <Text
          style={{
            color: THEMES.colors.black,
            fontFamily: THEMES.fontFamily.regular,
            fontSize: THEMES.fonts.font16,
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
            fontSize: THEMES.fonts.font16,
            textAlign: "center",
            paddingTop: moderateScale(2),
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
            onPress={() => {
              setSelected("parent");
              setModalVisible(true);
            }}
          >
            <Image
              style={{
                width: 112,
                height: 112,
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
                    width: 112,
                    height: 112,
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
                    width: 112,
                    height: 112,
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
                fontFamily: THEMES.fontFamily.medium,
                fontSize: THEMES.fonts.font12,
                textAlign: "center",
                paddingTop: moderateScale(20),
              }}
            >
              Pet Parent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelected("service");
              setModalVisible(true);
            }}
            style={{ marginLeft: moderateScale(43), alignItems: "center" }}
          >
            <Image
              style={{
                width: 112,
                height: 112,
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
                    width: 112,
                    height: 112,
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
                    width: 112,
                    height: 112,
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
                fontFamily: THEMES.fontFamily.medium,
                fontSize: THEMES.fonts.font12,
                textAlign: "center",
                paddingTop: moderateScale(20),
              }}
            >
              Pet Service Provider
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View
        style={{
          bottom: 0,
          paddingHorizontal: moderateScale(24),
          position: "absolute",
          bottom: 0,
          width: "100%",
          marginBottom: moderateScale(20),
        }}
      >
        <Button  title={Strings.submit} />
      </View> */}
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
                  lineHeight: moderateScale(28),
                }}
              >
                Unlock a World of Tail-Wagging Fun!
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Cross />
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.regular,
                  fontSize: THEMES.fonts.font16,
                  color: THEMES.colors.black,
                  lineHeight: moderateScale(28),
                }}
              >
                Would you like to register for purr-sonalized recommendations
                and pawsome content?
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
                  onlyBorder
                  title="Later"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View style={{ width: "45%" }}>
                <Button
                  title="Register"
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => {
                      props.navigation.navigate("businessDetail");
                    }, 200);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: moderateScale(20),
  },
});

export default RoleSelection;
