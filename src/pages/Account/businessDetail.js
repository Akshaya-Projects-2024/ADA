import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  StyleSheet,
  Keyboard,
} from "react-native";
import Strings from "../../constants/strings";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import ModalDropdown from "../../components/ModalDropdown";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Stepper from "../../components/Stepper";
import Toast from "react-native-toast-message";
import { decryptService } from "../../utils/storageFunc";
import { saveBusinessDetails } from "../../redux-store/actions/auth";
import { getServiceProviderRole } from "../../redux-store/actions/registerAction";
import { useDispatch, useSelector } from "react-redux";

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
  const [businessValue, setBusinessValue] = useState();
  const [selectedServiceProvider, setServiceProviderValue] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedExperience, setSelectedExperience] = useState();
  const [description, setDescription] = useState();
  const dispatch = useDispatch();
  const { serviceProviderRoleData } = useSelector(({ register }) => register);
  const [serviceProviderRole, setServiceProviderRole] = useState();

  useEffect(() => {
    if (serviceProviderRoleData.length) {
      setServiceProviderRole(serviceProviderRoleData);
    }
  }, [serviceProviderRoleData]);

  useEffect(() => {
    dispatch(getServiceProviderRole());
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

  const showToast = (type, message) => {
    Toast.show({
      type: type,
      text1: message,
    });
  };

  const onSubmit = async () => {

    if (!businessValue) {
      showToast("error", "Please enter Business name or person name");
    } else if (!selectedServiceProvider) {
      showToast("error", "Please select service provider role");
    } else if (!description) {
      showToast("error", "Please enter description");
    } else {
      try {
        const userId = await decryptService("userId");
        const formattedYear = selectedExperience[0].label
        const formattedServices = selectedServiceProvider.map((service) => ({
          code: service.id,
        }));
        const postData = {
          userid: userId,
          name: businessValue,
          experience: JSON.stringify(
            parseInt(formattedYear.replace("Years", ""), 10)
          ),
          description: description,
          services: formattedServices,
        };
        const res = await saveBusinessDetails(postData);
        if (res?.data?.status_code == 200) {
          props.navigation.navigate("contactDetails");
        } else {
          showToast("error", res?.data?.message);
        }
      } catch (error) {
        showToast("error", "Something went wrong!!!");
      }
    }
  };

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
          <Stepper currentStep={1} totalSteps={6} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View
            style={{
              paddingTop: route !== "myprofile" ? 18 : 30,
              marginHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"Business name/Person name*"}
              placeholderText={"Enter name"}
              value={businessValue}
              onChange={setBusinessValue}
            />
          </View>

          <View style={{ paddingTop: moderateScale(16) }}>
            <ModalDropdown
              placeholder="Service provider Role*"
              data={serviceProviderRole}
              title={"Select service role"}
              setSelectedValue={setServiceProviderValue}
              selectedValue={selectedServiceProvider}
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
              value={description}
              onChange={setDescription}
            />
          </View>
        </ScrollView>
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button
              title={route !== "myprofile" ? Strings.next : Strings.submit}
              onPress={() => onSubmit()}
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
