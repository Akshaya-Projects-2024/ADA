import Footprint from "../assets/svg/footprint.svg";
import Running from "../assets/svg/running.svg";
import Training from "../assets/svg/traning.svg";
import Potty from "../assets/svg/potty.svg";
import Medication from "../assets/svg/medication.svg";
import Vaccination from "../assets/svg/vaccines.svg";
import PetFood from "../assets/svg/petFood.svg";
import CustomIc from "../assets/svg/load.svg";

export const LoginModules = { parent: "parent", provider: "provider" };
export const ApprovalStatus = {
  pending: 0,
  inprogress: 1,
  approvalPending: 2,
  rejected: 3,
  approved: 4,
};

export const AppointmentStatus = {
  pending: "pending",
  scheduled: "scheduled",
  completed: "completed",
  cancelled: "cancelled",
  rescheduled: "rescheduled",
};

export const WalkingActivity = {
  type: "Walking",
  name: "Walking",
  iscustomise: 0,
  quantity: "",
  duration: "",
  frequency: "",
  days: "",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};
export const RunningActivity = {
  type: "Running",
  name: "Running",
  iscustomise: 0,
  quantity: "",
  duration: "",
  frequency: "",
  days: "",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};
export const TrainingActivity = {
  type: "Training",
  name: "Training",
  iscustomise: 0,
  quantity: "",
  duration: "",
  frequency: "",
  days: "",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};
export const MealActivity = {
  type: "Meal",
  name: "Meal",
  iscustomise: 0,
  quantity: "",
  duration: "",
  frequency: "Daily",
  days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun,",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};
export const PottyActivity = {
  type: "Potty",
  name: "Potty",
  iscustomise: 0,
  quantity: "",
  duration: "",
  frequency: "Daily",
  days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun,",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};
export const MedicationActivity = {
  type: "Medication",
  name: "Medication",
  iscustomise: 0,
  quantity: "",
  duration: "",
  frequency: "",
  days: "",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};
export const VaccinationActivity = {
  type: "Vaccination",
  name: "Vaccination",
  iscustomise: 0,
  quantity: "",
  duration: "",
  frequency: "",
  days: "",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};

export const CustomActivity = {
  type: "Custom",
  name: "",
  iscustomise: 1,
  quantity: "",
  duration: "",
  frequency: "",
  days: "",
  morning: "",
  afternoon: "",
  night: "",
  date: null,
  time: null,
  timeFormat: "AM",
};

export const DefaultActivityList = {
  Walking: WalkingActivity,
  Running: RunningActivity,
  Training: TrainingActivity,
  Meal: MealActivity,
  Potty: PottyActivity,
  Medication: MedicationActivity,
  Vaccination: VaccinationActivity,
};

export const ActivityType = {
  Walking: {
    icon: Footprint,
    colors: ["rgba(255, 229, 204, 0.4)", "rgba(161, 234, 154, 0.4)"],
    idIndex: {
      morning: 0,
      night: 1,
    },
    activityLabel: {
      morning: "Morning",
      night: "Night",
    },
    label: {
      morning: "Morning Walk",
      night: "Evening Walk",
    },
    defaultValue: {
      morning: {
        afternoon: null,
        night: null,
      },
      night: {
        morning: null,
        afternoon: null,
      },
    },
  },
  Running: {
    icon: Running,
    colors: ["#f8dfef", "#FBC7BD"],
    idIndex: {
      morning: 0,
      night: 1,
    },
    label: {
      morning: "Morning Running",
      night: "Evening Running",
    },
    activityLabel: {
      morning: "Morning",
      night: "Night",
    },
    defaultValue: {
      morning: {
        afternoon: null,
        night: null,
      },

      night: {
        morning: null,
        afternoon: null,
      },
    },
  },
  Training: {
    icon: Training,
    colors: ["rgba(246, 191, 233, 0.4)", "rgba(162, 140, 209, 0.4)"],
    idIndex: {
      time: 0,
    },
    activityLabel: {
      time: "Time",
    },
    defaultValue: {},
    label: {
      time: "It's time Training",
    },
  },
  Meal: {
    icon: PetFood,
    colors: ["rgba(254, 208, 252, 0.4)", "rgba(250, 208, 200, 0.4)"],
    idIndex: {
      morning: 0,
      afternoon: 1,
      night: 2,
    },
    activityLabel: {
      morning: "Morning",
      afternoon: "Afternoon",
      night: "Night",
    },
    label: {
      morning: "Morning Meal",
      afternoon: "Afternoon Meal",
      night: "Night Meal",
    },
    defaultValue: {
      morning: {
        afternoon: null,
        night: null,
      },

      afternoon: {
        morning: null,
        night: null,
      },

      night: {
        morning: null,
        afternoon: null,
      },
    },
  },
  Potty: {
    icon: Potty,
    colors: ["#FFE7CD", "#FCB9A2"],
    idIndex: {
      morning: 0,
      afternoon: 1,
      night: 2,
    },
    activityLabel: {
      morning: "Morning",
      afternoon: "Afternoon",
      night: "Night",
    },
    label: {
      morning: "Morning Potty",
      afternoon: "Afternnon Potty",
      night: "Evening Potty",
    },
    defaultValue: {
      morning: {
        afternoon: null,
        night: null,
      },

      afternoon: {
        morning: null,
        night: null,
      },

      night: {
        morning: null,
        afternoon: null,
      },
    },
  },
  Medication: {
    icon: Medication,
    colors: ["#f8dfef", "#ffc0c3"],
    idIndex: {
      morning: 0,
      afternoon: 1,
      night: 2,
      startdate: 3,
    },
    activityLabel: {
      morning: "Morning",
      afternoon: "Afternoon",
      night: "Night",
      startdate: "Startdate",
    },
    label: {
      morning: "Morning Medication",
      afternoon: "Afternnon Medication",
      night: "Evening Medication",
      startdate: "Medication",
    },
    defaultValue: {
      morning: {
        afternoon: null,
        night: null,
        startdate: null,
        date: null,
        time: null,
      },
      afternoon: {
        morning: null,
        night: null,
        startdate: null,
        date: null,
        time: null,
      },
      night: {
        morning: null,
        afternoon: null,
        startdate: null,
        date: null,
        time: null,
      },
      startdate: {
        morning: null,
        afternoon: null,
        night: null,
        time: null,
        date: null,
      },
    },
  },
  Vaccination: {
    icon: Vaccination,
    colors: ["#F8D7E3", "#ACEBE9"],
    idIndex: {
      date: 0,
    },
    activityLabel: {
      date: "Date",
    },
    defaultValue: {
      date: {
        morning: null,
        afternoon: null,
        night: null,
      },
    },
    label: {
      date: "Vaccination",
    },
  },
  Custom: {
    icon: CustomIc,
    colors: ["rgba(254, 208, 252, 0.4)", "rgba(250, 208, 200, 0.4)"],
    defaultValue: {},
    idIndex: {
      time: 0,
    },
    activityLabel: {
      time: "Time",
    },
    label: {
      time: "Custom",
    },
  },
};

export const MedicineQuantityList = [
  {
    label: "1",
    id: "1",
  },
  {
    label: "2",
    id: "2",
  },
  {
    label: "3",
    id: "3",
  },
  {
    label: "4",
    id: "4",
  },
  {
    label: "5",
    id: "5",
  },
  {
    label: "6",
    id: "6",
  },
  {
    label: "7",
    id: "7",
  },
  {
    label: "8",
    id: "8",
  },
  {
    label: "9",
    id: "9",
  },
  {
    label: "10",
    id: "10",
  },
];

export const DurationList = [
  {
    label: "Daily",
    id: "daily",
  },
  {
    label: "Weekly",
    id: "weekly",
  },
  {
    label: "Monthly",
    id: "monthly",
  },
  {
    label: "Yearly",
    id: "yearly",
  },
];

export const ProviderBannerList = [
  {
    url: require("../assets/images/SPBanner.png"),
  }
]

export const ParentBannerList = [
  {
    url: require("../assets/images/PPBanner.png"),
  }
]
