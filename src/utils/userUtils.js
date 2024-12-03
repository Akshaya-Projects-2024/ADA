import { SHIFTS } from "../components/TimeTracker";
import { DOCUMENT_TYPES } from "../pages/Account/uploadImagesDocs";
import { IMAGE_TYPE } from "../pages/ParentRegister/petDetail";
import { dispatchLoggedInModule } from "../redux-store/actions/userActions";
import { decryptService, encryptService } from "./storageFunc";
import { validArray } from "./utils";

export const validateParentProfile = (userData) => {
  if (
    !userData?.parentProfie?.parentContact?.name ||
    !userData?.parentProfie?.parentContact?.about ||
    !userData?.parentProfie?.parentContact?.mobile ||
    !userData?.parentProfie?.parentContact?.email ||
    !userData?.parentProfie?.parentContact?.address ||
    !userData?.parentProfie?.parentContact?.pin
  ) {
    return {
      flag: false,
      navigateTo: "parentDetails",
      partiallyCompleted: false,
    };
  }
  if (
    !validArray(userData?.parentProfie?.petDetails) ||
    !userData?.parentProfie?.petDetails[0]?.about ||
    !userData?.parentProfie?.petDetails[0]?.age ||
    !userData?.parentProfie?.petDetails[0]?.gender ||
    !userData?.parentProfie?.petDetails[0]?.name ||
    !userData?.parentProfie?.petDetails[0]?.type
    // TODO
    // || !userData?.parentProfie?.petDetails[0]?.breed ||
    // || !validArray(userData?.parentProfie?.petDetails[0]?.documents) ||
    // !validatePetDocuments(userData?.parentProfie?.petDetails[0]?.documents)
  ) {
    return { flag: false, navigateTo: "petDetail", partiallyCompleted: true };
  }
  return { flag: true, partiallyCompleted: true };
};

export const validateServiceProfile = (userData, excludePayment = false) => {
  if (
    !userData?.providerProfile?.providerBusiness?.name ||
    !validArray(userData?.providerProfile?.providerBusiness?.services) ||
    !userData?.providerProfile?.providerBusiness?.experience ||
    !userData?.providerProfile?.providerBusiness?.description
  ) {
    return {
      flag: false,
      navigateTo: "businessDetail",
      partiallyCompleted: false,
    };
  }
  if (
    !userData?.providerProfile?.providerContact?.address ||
    !userData?.providerProfile?.providerContact?.email ||
    !userData?.providerProfile?.providerContact?.location ||
    !userData?.providerProfile?.providerContact?.mobile ||
    !userData?.providerProfile?.providerContact?.pin
  ) {
    return {
      flag: false,
      navigateTo: "contactDetails",
      partiallyCompleted: true,
    };
  }
  if (
    !validArray(userData?.providerProfile?.providerDocument) ||
    !validateDocuments(userData?.providerProfile?.providerDocument)
  ) {
    return {
      flag: false,
      navigateTo: "uploadImagesDocs",
      partiallyCompleted: true,
    };
  }
  if (
    !validArray(userData?.providerProfile?.ProviderSession?.availableat) ||
    !validMonthSession(
      userData?.providerProfile?.ProviderSession,
      userData?.providerProfile?.sessionRateDetails
    ) ||
    !validPerSession(
      userData?.providerProfile?.ProviderSession,
      userData?.providerProfile?.sessionRateDetails
    )
  ) {
    return {
      flag: false,
      navigateTo: "sessionDetail",
      partiallyCompleted: true,
    };
  }
  if (
    !validArray(userData?.providerProfile?.sessionDetails) ||
    !validateTimeData(userData?.providerProfile?.sessionDetails)
  ) {
    return {
      flag: false,
      navigateTo: "workingHours",
      partiallyCompleted: true,
    };
  }
  if (
    !userData?.providerProfile?.MediaLinks?.facebook ||
    !userData?.providerProfile?.MediaLinks?.instagram ||
    !userData?.providerProfile?.MediaLinks?.onlinelink ||
    !userData?.providerProfile?.MediaLinks?.website
  ) {
    return { flag: false, navigateTo: "mediaLink", partiallyCompleted: true };
  }
  if (
    !excludePayment &&
    (!userData?.providerProfile?.subscription?.status ||
      userData?.providerProfile?.subscription?.status === "inactive")
  ) {
    return {
      flag: false,
      navigateTo: "paymentsSubscription",
      partiallyCompleted: true,
    };
  }
  return { flag: true, partiallyCompleted: true };
};

export const validateCompleteServiceProfile = (userData) => {
  const output = { flag: true, modules: [], partiallyCompleted: true };
  if (
    !userData?.providerProfile?.providerBusiness?.name ||
    !validArray(userData?.providerProfile?.providerBusiness?.services) ||
    !userData?.providerProfile?.providerBusiness?.experience ||
    !userData?.providerProfile?.providerBusiness?.description
  ) {
    output.flag = false;
    output.partiallyCompleted = false;
    output.modules.push("businessDetail");
  }
  if (
    !userData?.providerProfile?.providerContact?.address ||
    !userData?.providerProfile?.providerContact?.email ||
    !userData?.providerProfile?.providerContact?.location ||
    !userData?.providerProfile?.providerContact?.mobile ||
    !userData?.providerProfile?.providerContact?.pin
  ) {
    output.flag = false;
    output.partiallyCompleted = true;
    output.modules.push("contactDetails");
  }
  if (
    !validArray(userData?.providerProfile?.providerDocument) ||
    !validateDocuments(userData?.providerProfile?.providerDocument)
  ) {
    output.flag = false;
    output.partiallyCompleted = true;
    output.modules.push("uploadImagesDocs");
  }
  if (
    !validArray(userData?.providerProfile?.ProviderSession?.availableat) ||
    !validMonthSession(
      userData?.providerProfile?.ProviderSession,
      userData?.providerProfile?.sessionRateDetails
    ) ||
    !validPerSession(
      userData?.providerProfile?.ProviderSession,
      userData?.providerProfile?.sessionRateDetails
    )
  ) {
    output.flag = false;
    output.partiallyCompleted = true;
    output.modules.push("sessionDetail");
  }
  if (
    !validArray(userData?.providerProfile?.sessionDetails) ||
    !validateTimeData(userData?.providerProfile?.sessionDetails)
  ) {
    output.flag = false;
    output.partiallyCompleted = true;
    output.modules.push("workingHours");
  }
  if (
    !userData?.providerProfile?.MediaLinks?.facebook ||
    !userData?.providerProfile?.MediaLinks?.instagram ||
    !userData?.providerProfile?.MediaLinks?.onlinelink ||
    !userData?.providerProfile?.MediaLinks?.website
  ) {
    output.flag = false;
    output.partiallyCompleted = true;
    output.modules.push("mediaLink");
  }
  if (
    !userData?.providerProfile?.subscription?.status ||
    userData?.providerProfile?.subscription?.status === "inactive"
  ) {
    output.flag = false;
    output.partiallyCompleted = true;
    output.modules.push("paymentsSubscription");
  }
  return output;
};

const validateDocuments = (docs) => {
  const doc = docs?.some((it) => it?.documenttype === DOCUMENT_TYPES.document);
  const image = docs?.some((it) => it?.documenttype === DOCUMENT_TYPES.image);
  const logo = docs?.some((it) => it?.documenttype === DOCUMENT_TYPES.logo);
  return doc && image && logo;
};

const validateTimeData = (times) => {
  for (let index = 0; index < times.length; index++) {
    const element = times[index];
    if (
      element?.selected &&
      element?.isfullday === SHIFTS.full &&
      (!element?.shift1?.start || !element?.shift1?.end)
    ) {
      return false;
    }
    if (
      element?.selected &&
      element?.isfullday === SHIFTS.shifts &&
      (!element?.shift1?.start ||
        !element?.shift1?.end ||
        !element?.shift2?.start ||
        !element?.shift2?.end)
    ) {
      return false;
    }
  }
  return true;
};

const validMonthSession = (ProviderSession, sessionRateDetails) => {
  const isChargesAvailable = sessionRateDetails?.some(
    (rateDetail) =>
      rateDetail.monthcharges && rateDetail.monthcharges !== "0.00"
  );
  if (
    ProviderSession?.ispermonth &&
    (!ProviderSession?.monthtime || !isChargesAvailable)
  ) {
    return false;
  }
  return true;
};

const validPerSession = (ProviderSession, sessionRateDetails) => {
  const isChargesAvailable = sessionRateDetails?.some(
    (rateDetail) =>
      rateDetail.sessioncharges && rateDetail.sessioncharges !== "0.00"
  );
  if (
    ProviderSession?.ispermonth &&
    (!ProviderSession?.sessiontime || !isChargesAvailable)
  ) {
    return false;
  }
  return true;
};

const validatePetDocuments = (docs) => {
  const certificate = docs?.some(
    (it) => it?.documenttype === IMAGE_TYPE.certificate
  );
  const photo = docs?.some((it) => it?.documenttype === IMAGE_TYPE.photo);
  return photo && certificate;
};

export const setLoggedInMoodule = (loggedInModule) => {
  return async (dispatch) => {
    dispatch(dispatchLoggedInModule(loggedInModule));
    await encryptService("loggedInModule", loggedInModule);
  };
};

export const getLoggedInMoodule = async () => {
  return await decryptService("loggedInModule");
};
