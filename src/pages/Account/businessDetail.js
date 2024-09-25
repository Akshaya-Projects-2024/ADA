import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  StyleSheet,
  Keyboard,
} from "react-native";
import Strings from "../../utils/strings";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import ModalDropdown from "../../components/ModalDropdown";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Stepper from "../../components/Stepper";

const businessName = [
  { id: "1", label: "ADV Solutions" },
  { id: "2", label: "Mighty Furries" },
  { id: "3", label: "Premium Pets" },
  { id: "4", label: "THE CITY PET SHOP & CLINIC" },
  { id: "5", label: "PET STORE - A Complete Pet Shop" },
];

const serviceProviderData = [
  { id: "1", label: "Pet Training" },
  { id: "2", label: "Grooming" },
  { id: "3", label: "Pet Boarding" },
];

const categoryData = [
  { id: "1", label: "Training" },
  { id: "2", label: "ABC" },
  { id: "3", label: "XYZ" },
  { id: "4", label: "MNO" },
];

const experienceData = [
  { id: "1", label: "1 Years" },
  { id: "2", label: "2 Years" },
  { id: "3", label: "3 Years" },
  { id: "4", label: "4 Years" },
  { id: "5", label: "5 Years" },
  { id: "6", label: "6 Years" },
  { id: "7", label: "7 Years" },
  { id: "8", label: "8 Years" },
];

const BusinessDetail = (props) => {
  const route = props?.route?.params?.route;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedBusinessValue, setBusinessValue] = useState();
  const [selectedServiceProvider, setServiceProviderValue] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedExperience, setSelectedExperience] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.businessDetail} showBack bgColor="transparent" />
      {route !== "myprofile" && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#B8B8B8",
            borderBottomColor: "#B8B8B8",
            borderBottomWidth: 1,
            backgroundColor: "#fff",
          }}
        >
          <Stepper currentStep={1} totalSteps={5} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ paddingTop: route !== "myprofile" ? 18 : 30 }}>
            <ModalDropdown
              placeholder="Business name/ Person Name*"
              data={businessName}
              title={"Select business name"}
              setSelectedValue={setBusinessValue}
              selectedValue={selectedBusinessValue}
            />
          </View>

          <View style={{ paddingTop: moderateScale(16) }}>
            <ModalDropdown
              placeholder="Service provider Role*"
              data={serviceProviderData}
              title={"Select service role"}
              setSelectedValue={setServiceProviderValue}
              selectedValue={selectedServiceProvider}
              multiSelect={true}
            />
          </View>
          <View style={{ paddingTop: moderateScale(16) }}>
            <ModalDropdown
              placeholder="Category of Services*"
              data={categoryData}
              title={"Select category"}
              setSelectedValue={setSelectedCategory}
              selectedValue={selectedCategory}
              multiSelect={true}
            />
          </View>
          <View style={{ paddingTop: moderateScale(16) }}>
            <ModalDropdown
              placeholder="Years of Experience"
              data={experienceData}
              title={"Select experience"}
              setSelectedValue={setSelectedExperience}
              selectedValue={selectedExperience}
              multiSelect={true}
            />
          </View>
          <View
            style={{
              paddingTop: moderateScale(16),
              marginHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"About Info /Description*"}
              placeholderText={"Write the about info/description"}
              multiline
            />
          </View>
        </ScrollView>
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button
              title={route !== "myprofile" ? Strings.next : Strings.submit}
              onPress={() => props.navigation.navigate("contactDetails")}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  submitButton: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(22),
  },
});

export default BusinessDetail;
