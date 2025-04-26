import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import SearchImg from "../../assets/svg/search.svg";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import { LoginModules } from "../../constants/enums";
import Header from "../../components/Header";
import Toggle from "../../components/Toggle";
import Cross from "../../assets/svg/cross.svg";
import Back from "../../assets/svg/back.svg";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import { useIsFocused } from "@react-navigation/native";

const HeaderWithSearch = ({ loggedInModule, handleSwitch, featureList }) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const isFocused = useIsFocused()

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const listOpacity = useRef(new Animated.Value(0)).current; // Start opacity at 0

  useEffect(() => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 300, // Adjust animation duration
      useNativeDriver: true,
    }).start();
  }, [filteredData]);

  // Helper function to animate search bar
  const toggleSearchBar = useCallback(
    (active) => {
      Animated.timing(slideAnim, {
        toValue: active ? 0 : -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [slideAnim]
  );

  useEffect(() => {
    toggleSearchBar(searchActive);
  }, [searchActive, toggleSearchBar]);

  useEffect(() => {
    if (!isFocused && searchActive) {
      setSearchText("");
      setSearchActive(false);
      setFilteredData([]);
    }
  }, [isFocused]);

  const handleSearch = useCallback(
    (text) => {
      setSearchText(text);
      setFilteredData(
        featureList.filter((item) =>
          item?.label?.toLowerCase().includes(text.toLowerCase())
        )
      );
    },
    [featureList]
  );

  const closeSearch = useCallback(() => {
    toggleSearchBar(false);
    setSearchActive(false);
    setSearchText("");
    setFilteredData([]);
    Keyboard.dismiss();
  }, [toggleSearchBar]);

  return (
    <TouchableWithoutFeedback onPress={closeSearch}>
      <View style={styles.container}>
        {!searchActive ? (
          <Header
            customIcon={
              <Toggle
                state={loggedInModule === LoginModules.provider}
                onPress={handleSwitch}
              />
            }
            right={
              <TouchableOpacity
                onPress={() => {
                  setSearchActive(true);
                  setFilteredData([]);
                }}
                style={styles.searchIcon}
              >
                <SearchImg />
              </TouchableOpacity>
            }
            title={Strings.myAccount}
            bgColor="transparent"
          />
        ) : (
          <>
            {/* Search Bar */}
            <Animated.View
              style={[
                styles.searchContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => setSearchActive(false)}
              >
                <Back stroke="#fff" />
              </TouchableOpacity>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Search"
                  placeholderTextColor={THEMES.colors.darkGrey}
                  value={searchText}
                  onChangeText={handleSearch}
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => setSearchText("")}
                >
                  <Cross />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Search Results */}
            {filteredData.length > 0 && (
              <View style={styles.searchResults}>
                <AnimatedFlatList
                  data={filteredData}
                  keyExtractor={(item) => item.label}
                  renderItem={({ item, index }) => {
                    const itemAnim = new Animated.Value(-20); // Start position above
                    Animated.timing(itemAnim, {
                      toValue: 0,
                      duration: 300,
                      delay: index * 100, // Staggered effect
                      useNativeDriver: true,
                    }).start();

                    return (
                      <Animated.View
                        style={{
                          transform: [{ translateY: itemAnim }],
                          opacity: listOpacity,
                        }}
                      >
                        <TouchableButtonWithPermission
                          checkPermission={item.checkPermission ?? false}
                          checkPayment={item.checkPayment ?? false}
                          checkPetExist={item.checkPetExist ?? false}
                          onPress={() => {
                            closeSearch();
                            item.onPress();
                          }}
                        >
                          <Text style={styles.listItem}>{item.label}</Text>
                        </TouchableButtonWithPermission>
                      </Animated.View>
                    );
                  }}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  contentContainerStyle={{ flexGrow: 1, borderRadius: 15 }}
                />
              </View>
            )}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  searchIcon: {
    alignItems: "flex-end",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBox: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(8),
    borderRadius: 25,
    borderWidth: 0.9,
    borderColor: "#bebebd",
    backgroundColor: "#f5f5f5",
    elevation: 1,
    alignItems: "center",
    flex: 1,
  },
  searchBar: {
    height: 42,
    flex: 1,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: "Inter-SemiBold",
  },
  iconWrapper: {
    paddingRight: 10,
    width: 25,
  },
  searchResults: {
    maxHeight: 200,
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 10,
    elevation: 5,
    borderRadius: 15,
    padding: 10,
  },
  listItem: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
    padding: 10,
    color: "black",
  },
});

export default HeaderWithSearch;
