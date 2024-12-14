import RNFS from "react-native-fs";

const getBase64Data = async (documentPath) => {
  try {
    const base64 = await RNFS.readFile(documentPath, "base64");
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

const getBase64Obj = (url) => {
  if (url) {
    return {
      uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
    };
  }
};
export { getBase64Data, getBase64Obj };
