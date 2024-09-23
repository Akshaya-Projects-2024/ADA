import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Strings from "../../utils/strings";
import SearchIcon from "../../assets/svg/search.svg";

const Chip = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderWidth: 0.5,
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(8),
        borderRadius: 20,
        margin: 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => onPress(item)}
    >
      <Text style={styles.chipText}>{item.label}</Text>
    </TouchableOpacity>
  );
};
const TrendingChip = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={[
        styles.trendingChip,
        selected ? styles.trendingChipSelected : null,
      ]}
      onPress={() => onPress(item)}
    >
      <Icon
        name={"trending-up"}
        size={16}
        color={selected ? "#ffffff" : "#000000"}
      />
      <Text style={selected ? styles.selectedchipText : styles.chipText}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};
const SearchedChip = ({ item, onPress, selected }) => {
  return (
    <TouchableOpacity style={styles.chip}>
      <Icon
        name={"search"}
        size={20}
        color={selected ? "#ffffff" : "#000000"}
      />
      <Text
        style={{
          fontSize: THEMES.fonts.font12,
          paddingHorizontal: moderateScale(5),
          paddingVertical: moderateScale(4),
        }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};
const Search = () => {
  const { colors, fontFamily, fonts } = THEMES;

  const [data, setData] = useState([
    { id: "1", label: "Tricks", trending: true },
    { id: "2", label: "Pet Food", trending: true },
    { id: "3", label: "Pet Toys", trending: true },
    { id: "4", label: "Pet Stores", trending: true },
    { id: "5", label: "Kittens", trending: true },
    { id: "6", label: "Pet Adoption", trending: false },
    { id: "7", label: "Pet House", trending: false },
    { id: "8", label: "Pet Doctor", trending: false },
    { id: "9", label: "Pet Boarding Centers", trending: false },
  ]);

  const [searchText, setSearchText] = useState("");
  const [selectedChips, setSelectedChips] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleChipPress = (item) => {
    setSelectedChips((prevSelected) => {
      if (prevSelected.includes(item.id)) {
        return prevSelected.filter((id) => id !== item.id);
      } else {
        // Add the selected item to recent searches if it's not already present
        setRecentSearches((prev) => {
          if (!prev.find((recentItem) => recentItem.id === item.id)) {
            return [...prev, item];
          }
          return prev;
        });
        return [...prevSelected, item.id];
      }
    });
    setSearchText("");
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Filter trending topics and recent searches
  const trendingTopics = data.filter((item) => item.trending);
  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        showBack
        title={"Search"}
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />
      <View style={{ paddingHorizontal: moderateScale(20) }}>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: moderateScale(8),
            borderColor: "#bebebd",
            borderWidth: 1.5,
            borderRadius: 25,
            marginBottom: 16,
            backgroundColor: "#f5f5f5",
            elevation: 1,
            alignItems: "center",
          }}
        >
          <View style={{ paddingRight: 10 }}>
            <SearchIcon />
          </View>

          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchText}
            onChangeText={handleSearchChange}
          />
        </View>

        {/* Show search results only when searchText is not empty */}
        {searchText !== "" && (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Chip
                item={item}
                onPress={handleChipPress}
                selected={selectedChips.includes(item.id)}
              />
            )}
            contentContainerStyle={styles.chipContainer}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.selectTimeText}>Trending Topics</Text>
        </View>
        <FlatList
          data={trendingTopics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrendingChip
              item={item}
              onPress={handleChipPress}
              selected={selectedChips.includes(item.id)}
            />
          )}
          contentContainerStyle={styles.chipContainer}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.selectTimeText}>Recent Searches</Text>
          <Pressable onPress={clearRecentSearches}>
            <Text style={styles.sameTimeForDayText}>Clear</Text>
          </Pressable>
        </View>
        <FlatList
          data={recentSearches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SearchedChip
              item={item}
              // onPress={handleChipPress}
              // selected={selectedChips.includes(item.id)}
            />
          )}
          contentContainerStyle={styles.chipContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  searchBar: {
    height: 42,
    flex: 1,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.darkGrey,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: moderateScale(5),
  },
  chip: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: 0.5,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    borderRadius: 20,
    margin: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  trendingChip: {
    backgroundColor: "#EAFFF6",
    borderColor: THEMES.colors.darkGrey,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: "#6200EE",
    // Selected color
  },
  trendingChipSelected: {
    backgroundColor: "#06bac8",
    borderColor: "none",
    borderWidth: 0, // Selected color
  },
  chipText: {
    fontSize: 13,
    color: "#000",
    fontFamily: THEMES.fontFamily.medium,
    paddingLeft: moderateScale(5),
  },
  selectedchipText: {
    fontSize: 13,
    color: "#ffffff",
    fontFamily: THEMES.fontFamily.medium,
    paddingLeft: moderateScale(5),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(8),
  },
  selectTimeText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  sameTimeForDayText: {
    fontFamily: THEMES.fontFamily.medium,
    color: "#323232",
    fontSize: THEMES.fonts.font14,
  },
});

export default Search;
