import React, { useState } from "react";
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
import InputField from "../../components/InputField";
import Modal from "react-native-modal";
import UploadImageModal from "../../components/UploadImageModal";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import Strings from "../../constants/strings";
import Calendars from "../../assets/svg/calendar.svg";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import ModalDropdown from "../../components/ModalDropdown";
import CheckBox from "react-native-check-box";
import { SafeAreaView } from "react-native-safe-area-context";
import { decryptService } from "../../utils/storageFunc";
import Share from "react-native-share";
import { getCurrentLocation } from "../../utils/geolocationUtils";
import { deleteDocument, uploadDocument } from "../../redux-store/actions/auth";
import { DOCUMENT_TYPES } from "../Account/uploadImagesDocs";
import { showToast } from "../../utils/utils";
import { AddLostPetAlert } from "../../redux-store/actions/alerts";
import { goBack } from "../../navigations/rootNavigationRef";

const OtherLostPetAlert = (props) => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [petImage, setPetImage] = useState([]);
  const [petImagesVisible, setPetImageVisible] = useState(false);
  const [isDateVisible, setDateVisibility] = useState(false);
  const [date, selectedDate] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Public");
  const [facebook, setFacebook] = useState();
  const [instagram, setInstagram] = useState();
  const [whatsup, setWhatsup] = useState();
  const [petName, setPetName] = useState();
  const [location, setLocation] = useState();
  const [feature, setFeature] = useState();
  const [message, setMessage] = useState();
  const [contactNo, setContactNo] = useState();
  const [agree, setAgree] = useState();
  const [petId, setPetId] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const hideDatePickerCancel = () => {
    setDateVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    selectedDate(formattedDate);
    hideDatePickerCancel();
  };

  const handlePetImg = async (image) => {
    const extension = image?.fileName?.split(".").pop();
    const userId = await decryptService("userId");
    let payload = {
      userid: userId,
      documenttype: "photo",
      extention: extension,
      document: image?.fileData,
    };
    apiCall(payload, DOCUMENT_TYPES.document, image);
  };

  const apiCall = async (postData, type, item) => {
    try {
      const res = await uploadDocument(postData);
      if (res?.status == 200) {
        const data = [...petImage];
        data.push({ ...item, id: res?.data?.data?.reqId });
        setPetImage(data);

        const dataId = [...petId];
        dataId.push({ id: res?.data?.data?.reqId });
        setPetId(dataId);
        showToast("success", "Successfully uploaded the image");
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };

  const shareImageBase64 = async (image, platforms = []) => {
    try {
      for (const platform of platforms) {
        console.log("platform", platform);
        if (platform == "FACEBOOK") {
          const shareData = {
            title: "Share on Facebook",
            message: "Check out this image!",
            url: `data:image/jpeg;base64,${image}`, // Base64 encoded image
          };
          await Share.open(shareData);
        }

        if (platform == "INSTAGRAM") {
          const shareData = {
            title: "Share on instagram",
            message: "Check out this image!",
            url: `data:image/jpeg;base64,${image}`, // Base64 encoded image
          };
          await Share.open(shareData);
        }

        if (platform == "WHATSUP") {
          const shareData = {
            title: "Share on instagram",
            message: "Check out this image!",
            url: `data:image/jpeg;base64,${image}`, // Base64 encoded image
            social: Share.Social.WHATSAPP,
          };
          await Share.open(shareData);
        }
      }
    } catch (error) {
      console.log("Error sharing image:", error);
    }
  };

  const onSubmit = async () => {
    try {
      if (!petImage) {
        showToast("error", "Please add images of the pet");
      } else if (!date) {
        showToast("error", "Please select date");
      } else if (!location) {
        showToast("error", "Please enter location");
      } else if (!feature) {
        showToast("error", "Please enter feature");
      } else if (!message) {
        showToast("error", "Please enter message");
      } else if (!contactNo) {
        showToast("error", "Please enter contact No");
      } else if (!agree) {
        showToast("error", "Please select the terms and condition");
      }
      const currentPosition = await getCurrentLocation();
      const [day, month, year] = date?.split("/"); // Split into parts
      const dateString = new Date(`${year}-${month}-${day}T00:00:00Z`); // Rearrange & create Date object

      let obj = {
        userid: await decryptService("userId"),
        isownpet: 0,
        name: "",
        gender: "",
        lastseen: dateString.toISOString(),
        lastseenlocation: location,
        audience: "Public",
        features: feature,
        message: message,
        contactnum: contactNo,
        documents: petId.map((item) => item.id).join(","),
        requesttype: "lostpet",
        coordinates: `${currentPosition?.coords.latitude},${currentPosition.coords.longitude}`,
      };
      let res = await AddLostPetAlert(obj);
      if (Boolean(res?.image)) {
        if (selectedPlatforms) {
          await shareImageBase64(res?.image, selectedPlatforms);
        }
        showToast("success", "Lost Pet Alert has successfully create");
        goBack();
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const renderItem = (item, index) => {
    const photo = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity
          onPress={() => {
            onCancel(DOCUMENT_TYPES.image, item?.item);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const onCancel = async (type, doc) => {
    try {
      const userId = await decryptService("userId");
      const postData = {
        userid: userId,
        id: doc?.id,
      };
      const res = await deleteDocument(postData);
      if (res?.status == 200) {
        const removeItemById = petImage.filter((it) => it?.id !== doc?.id);
        const removeId = petImage.filter((it) => it?.id !== doc?.id);
        setPetId(removeId);
        setPetImage(removeItemById);
        showToast("success", "Successfully deleted the image");
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleSelection = (platform, isChecked) => {
    if (isChecked) {
      setSelectedPlatforms((prev) => [...prev, platform]); // Add to array
    } else {
      setSelectedPlatforms((prev) => prev.filter((p) => p !== platform)); // Remove from array
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
        <StatusBar backgroundColor={THEMES.colors.white} />
        <Header title="Lost pet alert" fontColor="#000" showBack />

        <ScrollView style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
          <View
            style={{
              flex: 1,
              backgroundColor: THEMES.colors.bgColor,
              marginBottom: moderateScale(24),
            }}
          >
            <View
              style={{
                paddingHorizontal: moderateScale(20),
                paddingTop: moderateScale(24),
              }}
            >
              <View style={styles.secondaryFlex}>
                <Text style={styles.titleText}>Photo of the pet</Text>
                <TouchableOpacity onPress={() => setPetImageVisible(true)}>
                  <Text style={styles.addText}>{Strings.add}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.flatlistView,
                  {
                    alignItems: petImage?.length == 0 ? "center" : "flex-start",
                  },
                ]}
              >
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    justifyContent: petImage?.length ? "flex-start" : "center",
                    alignItems: "center",
                    padding: petImage?.length
                      ? moderateScale(0)
                      : moderateScale(16),
                    borderColor: THEMES.colors.darkGrey,
                    borderRadius: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={petImage}
                  renderItem={renderItem}
                  ListHeaderComponent={() =>
                    petImage?.length == 0 ? (
                      <Text style={styles.imgPlaceholder}>
                        {Strings.pleaseAddImg}
                      </Text>
                    ) : null
                  }
                />
              </View>
            </View>

            <View
              style={{
                paddingHorizontal: moderateScale(20),
                paddingTop: moderateScale(24),
              }}
            >
              <TouchableOpacity
                onPress={() => setDateVisibility(true)}
                style={[
                  styles.dateContainer,
                  {
                    paddingHorizontal: moderateScale(15),
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <View style={{ paddingRight: moderateScale(10) }}>
                  {date ? (
                    <>
                      <Text
                        style={[
                          styles.datePlaceholderText,
                          {
                            paddingBottom: moderateScale(1),
                            fontSize: THEMES.fonts.font10,
                          },
                        ]}
                      >
                        Last seen date
                      </Text>
                      <Text style={styles.dateValue}>{date}</Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.datePlaceholderText,
                          {
                            paddingBottom: moderateScale(2),
                            fontSize: THEMES.fonts.font10,
                          },
                        ]}
                      >
                        Last seen date
                      </Text>
                      <Text style={styles.datePlaceholderText}>
                        {Strings.ddMMYYYY}
                      </Text>
                    </>
                  )}
                </View>
                <Calendars />
              </TouchableOpacity>
            </View>

            <View
              style={{
                paddingHorizontal: moderateScale(20),
                paddingTop: moderateScale(24),
              }}
            >
              <InputField
                label={"Last seen location"}
                placeholderText={"Enter location name"}
                value={location}
                onChange={setLocation}
              />
            </View>

            <View
              style={{
                paddingTop: moderateScale(24),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                editable={false}
                label={"Select whom to send"}
                placeholderText={"Select"}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
              {/* <ModalDropdown
                placeholder="Select whom to send"
                data={categoryData}
                title={"Select"}
                setSelectedValue={setSelectedCategory}
                selectedValue={selectedCategory}
              /> */}
            </View>

            <View
              style={{
                paddingTop: moderateScale(24),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  color: THEMES.colors.darkGrey,
                  fontSize: THEMES.fonts.font12,
                }}
              >
                Do you want to share this alert on Facebook with details to
                reach out common people
              </Text>

              <View style={styles.contentValueView}>
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => {
                    setFacebook(!facebook);
                    handleSelection("FACEBOOK", !facebook);
                  }}
                  isChecked={facebook}
                  style={{ flex: 1 }}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                  rightText={"Facebook"}
                />
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => {
                    setInstagram(!instagram);
                    handleSelection("INSTAGRAM", !instagram);
                  }}
                  isChecked={instagram}
                  style={{ flex: 1 }}
                  rightText={"Instagram"}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                />
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => {
                    setWhatsup(!instagram);
                    handleSelection("WHATSUP", !whatsup);
                  }}
                  isChecked={whatsup}
                  style={{ flex: 1 }}
                  rightText={"Whatsup"}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                />
              </View>

              <View
                style={{
                  paddingTop: moderateScale(24),
                }}
              >
                <InputField
                  label={"Distinguishing features*"}
                  placeholderText={"Enter the Distinguishing features"}
                  multiline={true}
                  value={feature}
                  onChange={setFeature}
                />
              </View>
              <View
                style={{
                  paddingTop: moderateScale(24),
                }}
              >
                <InputField
                  label={"Your Message*"}
                  placeholderText={"Write your message"}
                  multiline={true}
                  value={message}
                  onChange={setMessage}
                />
              </View>
              <View
                style={{
                  paddingTop: moderateScale(24),
                }}
              >
                <InputField
                  label={"Additional contact number*"}
                  placeholderText={"Enter number"}
                  value={contactNo}
                  keyboardType="phone-pad"
                  onChange={setContactNo}
                  maxLength={10}
                />
              </View>

              <View
                style={{
                  paddingTop: moderateScale(24),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckBox
                  checkedImage={<Checked />}
                  unCheckedImage={<UnChecked />}
                  onClick={() => setAgree(!agree)}
                  isChecked={agree}
                  style={{ flex: 1 }}
                  rightText={"Agree terms and conditions"}
                  rightTextStyle={{
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font12,
                    fontFamily: THEMES.fontFamily.medium,
                  }}
                />
              </View>

              <View
                style={{
                  paddingTop: moderateScale(30),
                }}
              >
                <Button title="Submit" onPress={() => onSubmit()}></Button>
              </View>
            </View>
          </View>
        </ScrollView>

        <UploadImageModal
          isVisible={petImagesVisible}
          onClose={() => setPetImageVisible(false)}
          handleSelectedImage={(image) => handlePetImg(image)}
        />
        <DateTimePicker
          isVisible={isDateVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePickerCancel}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(15),
    paddingTop: moderateScale(24),
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    width: "45%",
    alignItems: "center",
    borderColor: THEMES.colors.cyan,
    borderBottomLeftRadius: 0,
  },
  toggleText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.cyan,
  },
  imgContent: {
    width: 60,
    height: 60,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    marginLeft: 16,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(16),
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEMES.colors.darkGrey,
  },
  crossView: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    left: 5,
    bottom: 5,
  },
  crossImg: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  secondaryFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
  },
  addText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.cyan,
  },
  flatlistView: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: THEMES.colors.iron,
    borderRadius: 8,
    backgroundColor: THEMES.colors.white,
  },
  imgPlaceholder: {
    width: "100%",
    textAlign: "center",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    borderEndStartRadius: 0,
    alignItems: "center ",
    justifyContent: "space-between",
    paddingVertical: moderateScale(10),
    backgroundColor: "#fff",
  },
  dateValue: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  datePlaceholderText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  contentValueView: {
    paddingTop: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
  },
});

export default OtherLostPetAlert;
