import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../../../assets/theme/themes";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%"
  },
  activityText: {
    fontSize: THEMES.fonts.font16,
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  label: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.regular,
    color: THEMES.colors.black,
  },
  frequencyButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  frequencyText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
    marginLeft: 4,
  },
  dayContainer: {
    flexDirection: "row",
    gap: 6,
  },
  dayButton: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
  },
  dayText: {
    fontSize: THEMES.fonts.font12,
  },
  timeWrapper: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commonTimeButton: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEMES.colors.lightGrey,
    width: 202,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: THEMES.fonts.font16,
    fontFamily: THEMES.fontFamily.regular,
    color: THEMES.colors.black,
  },
  amPmContainer: {
    flexDirection: "row",
    backgroundColor: THEMES.colors.white,
    borderWidth: 0.2,
    borderColor: THEMES.colors.lightGrey,
    borderRadius: 12,
    marginLeft: 10,
  },
  amPmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  shiftLabel: {
    fontSize: THEMES.fonts.font16,
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.black,
  },
  timeLabel: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
  },
  commonTextInput: {
    height: moderateScale(40),
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
  },
  dropdownContainer: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  getDayTextStyle: (isSelected) => ({
    fontFamily: isSelected
      ? THEMES.fontFamily.semiBold
      : THEMES.fontFamily.regular,
    color: isSelected ? THEMES.colors.white : THEMES.colors.black,
    opacity: isSelected ? 1 : 0.5,
  }),
  getAmPmTextStyle: (isSelected) => ({
    color: isSelected ? "white" : "black",
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.medium,
  }),
  bondingContainer: {
    marginTop: 30,
    marginBottom: 100,
  },
  bondingImagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  bondingDivider: {
    marginHorizontal: 10,
  },
  dividerBox: {
    width: 50,
    height: 50,
  },
  bondingTextContainer: {
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  bondingText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.black,
    marginRight: 10,
  },

  // WeekView styles
  weekViewContainer: {
    marginHorizontal: 30,
  },
  weekHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  todayText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
  },
  dateText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
    color: "#B3B3B3",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  dateButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDate: {
    backgroundColor: THEMES.colors.outrageousOrange,
    color: THEMES.colors.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 44,
  },
  getDayText: (isSelected) => ({
    fontSize: THEMES.fonts.font12,
    fontFamily: isSelected
      ? THEMES.fontFamily.semiBold
      : THEMES.fontFamily.regular,
    color: isSelected ? THEMES.colors.white : THEMES.colors.black,
    opacity: isSelected ? 1 : 0.5,
  }),

  // ActivityListItem styles
  activityItemContainer: {
    backgroundColor: "white",
  },
  activityGradient: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityTime: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
    color: "#757575",
    marginVertical: 5,
  },
  activityButton: {
    paddingVertical: 6,
    paddingRight: 12,
    paddingLeft: 8,
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    borderBottomLeftRadius: 0,
    elevation: 5
  },
  buttonText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.black,
    marginLeft: 8,
  },
  marginTop10: {
    marginTop: 10,
  },

  // Main container styles
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  carouselContainer: {
    marginLeft: "30%",
    marginTop: 20,
    marginBottom: 20,
  },
  activityListContainer: {
    marginTop: 20,
    backgroundColor: THEMES.colors.white,
    borderTopLeftRadius: 43,
    borderTopRightRadius: 43,
    borderWidth: 1,
    borderColor: THEMES.colors.alto,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // SwipeList styles
  rowBack: {
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    borderRadius: 15,
    height: 96,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "#289BFE",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "#BF0101",
    right: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  backTextWhite: {
    color: "#FFF",
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.semiBold,
    paddingTop: 18,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amPmContainer: {
    flexDirection: "row",
    backgroundColor: THEMES.colors.white,
    borderWidth: 0.2,
    borderColor: THEMES.colors.lightGrey,
    borderRadius: 12,
    marginLeft: 10,
  },
  amPmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  getAmPmTextStyle: (isSelected) => ({
    color: isSelected ? THEMES.colors.white : THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.medium,
  }),
  // DaySelector styles
  dayContainer: {
    flexDirection: "row",
    gap: 6,
  },
  dayButton: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
  },
  dayText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.regular,
  },
});
