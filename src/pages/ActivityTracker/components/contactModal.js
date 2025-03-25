import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Linking,
} from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "react-native-modal";
import { THEMES } from "../../../assets/theme/themes";
import InputField from "../../../components/InputField";
import CloseSquare from "../../../assets/svg/closeSquare";
import Contact from "../../../assets/svg/contact";
import Button from "../../../components/Button";
import {
  addContacts,
  deleteContact,
  getContact,
} from "../../../redux-store/actions/auth";
import ModalLoader from "../../../components/ModalLoader";
import ContactDropdown from "./ContactDropdownField";
import { showToast } from "../../../utils/utils";
import Contacts from "react-native-contacts";

const { fontFamily, fonts, colors } = THEMES;

const ContactModal = ({ contactModalVisible, toggleContactModal, petInfo }) => {
  const [contactList, setContactList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [phoneContact, setPhoneContact] = useState([]);

  useEffect(() => {
    getContactList();
  }, []);

  useEffect(() => {
    getPhoneContacts();
  }, [contactList]);

  const getPhoneContacts = async () => {
    let contactObj = {};
    contactList?.map((item) => {
      contactObj = {
        ...contactObj,
        [item.contact || item.id]: item.name || item.label,
      };
      return item;
    });

    try {
      const contacts = await Contacts.getAllWithoutPhotos();
      const filteredContacts = contacts
        .filter(
          ({ givenName, phoneNumbers }) =>
            givenName &&
            phoneNumbers?.length &&
            !contactObj[phoneNumbers?.[0]?.number]
        )
        .map(({ givenName, phoneNumbers }) => ({
          label: givenName,
          id: phoneNumbers?.[0]?.number,
        }));

      setPhoneContact(filteredContacts);
    } catch (err) {
      console.warn(err);
    }
  };

  const getContactList = async () => {
    setLoader(true);
    const obj = {
      parentid: petInfo.userid,
      petId: petInfo.id,
    };
    const res = await getContact(obj);
    if (res.status === 200) {
      setLoader(false);
      setContactList(res.data.data);
    }
  };

  const deleteContactItem = async (item) => {
    if (item.label) {
      const arr = [...contactList];
      const index = arr.findIndex((x) => x.id === item.id);
      arr.splice(index, 1);
      setContactList(arr);
    } else {
      const obj = {
        id: item.id,
        parentid: item.parentid,
      };
      const res = await deleteContact(obj);
      if (res.status === 200) {
        showToast("success", res.data.message);
        getContactList();
      } else {
        showToast("error", res.data.message);
      }
    }
  };

  const onAdd = async () => {
    const list = [...contactList]
      .filter((x) => x.label)
      .map((item) => {
        return {
          name: item.label,
          contact: item.id,
        };
      });
    const postObj = {
      parentid: petInfo.userid,
      petId: petInfo.id,
      contact: list,
    };
    const res = await addContacts(postObj);
    if (res.status === 200) {
      getContactList();
      showToast("success", res.data.message);
    }
  };

  const contactAdded = useMemo(() => {
    return Boolean(contactList.filter((item) => item.label)?.length);
  });

  return (
    <Modal
      isVisible={true}
      onBackdropPress={toggleContactModal}
      onBackButtonPress={toggleContactModal}
      style={styles.modal}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Add contact details for reminder {petInfo.name}
        </Text>
        {loader ? (
          <ModalLoader loading={loader} />
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {contactList?.map((item, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.inputContainer}>
                    <InputField
                      placeholderText="Contact Number"
                      label={item.name || item.label}
                      onChange={(text) => {}}
                      value={item.contact || item.id}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => deleteContactItem(item)}
                          style={{ flexDirection: "row" }}
                        >
                          <CloseSquare stroke="red" strokeWidth={1} />
                        </TouchableOpacity>
                      }
                      editable={false}
                    />
                  </TouchableOpacity>
                );
              })}

              <View style={{ marginTop: 10 }} />
              <ContactDropdown
                title="Select Contacts"
                placeholderText="Contact Number"
                label="Name"
                multiSelect={true}
                data={phoneContact}
                onDone={(data) => {
                  setContactList([...contactList, ...data]);
                }}
              />
            </ScrollView>
            <View style={{ marginBottom: 10 }}>
              <Button disabled={!contactAdded} title="Add" onPress={onAdd} />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ContactModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: "transparent",
  },
  container: {
    flex: 0.7,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopRightRadius: 49,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fonts.font16,
    color: colors.black,
    marginBottom: 30,
  },
});
