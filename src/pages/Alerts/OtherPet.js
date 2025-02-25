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
import Location from "../../assets/svg/location.svg";

const categoryData = [
  { id: "1", label: "Training" },
  { id: "2", label: "ABC" },
  { id: "3", label: "XYZ" },
  { id: "4", label: "MNO" },
];

const OtherPet = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [petImage, setPetImage] = useState([]);
  const [petImagesVisible, setPetImageVisible] = useState(false);
  const [isDateVisible, setDateVisibility] = useState(false);
  const [date, selectedDate] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [facebook, setFacebook] = useState();
  const [instagram, setInstagram] = useState();
  const [whatsup, setWhatsup] = useState();
  const hideDatePickerCancel = () => {
    setDateVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    selectedDate(formattedDate);
    hideDatePickerCancel();
  };

  const handlePetImg = (image) => {
    var temp = [...petImage];
    temp.push(image);
    setPetImage(temp);
  };

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
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
            const removeItemById = petImage.filter(
              (item) => item?.fileData !== photo
            );
            setPetImage(removeItemById);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title="Other Pet" fontColor="#000" showBack />

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
              paddingTop: moderateScale(24),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"Location"}
              placeholderText={Strings.enterLocation}
              rightIcon={<Location stroke={THEMES.colors.darkGrey} />}
            />
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
                      Help needed date
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
                      Help needed date
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
              label={"Help Description*"}
              placeholderText={"Enter description"}
              multiline={true}
            />
          </View>

          <View
            style={{
              paddingTop: moderateScale(24),
            }}
          >
            <ModalDropdown
              editable={false}
              placeholder="Select whom to send"
              data={categoryData}
              title={"Select"}
              setSelectedValue={setSelectedCategory}
              selectedValue={selectedCategory}
            />
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
              Do you want to share this alert on Facebook with details to reach
              out common people
            </Text>

            <View style={styles.contentValueView}>
              <CheckBox
                checkedImage={<Checked />}
                unCheckedImage={<UnChecked />}
                onClick={() => setFacebook(!facebook)}
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
                onClick={() => setInstagram(!instagram)}
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
                onClick={() => setWhatsup(!whatsup)}
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
          </View>
          <View
            style={{
              paddingTop: moderateScale(24),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"Additional contact number*"}
              placeholderText={"Enter addditional number"}
            />

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
                onClick={() => setWhatsup(!whatsup)}
                isChecked={whatsup}
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
              <Button title="Submit"></Button>
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

export default OtherPet;
