import { Platform } from "react-native";
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";

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

export const downloadFile = (fileName, url, type,callback) => {
  const name = fileName.replace(":","_")
  const {config, fs} = RNFetchBlob;
  const fileType = type ? type : 'pdf';
  const fileDirectory =
    Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
  const path = fileDirectory + '/ADA' + `/${name}.${fileType}`;
  let options = {
    fileCache: true,
    path: path,
    addAndroidDownloads: {
      path: path,
      notification: true,
      useDownloadManager: true,
      mediaScannable: true,
      description: 'Downloading...',
    },
  };
  config(options)
    .fetch('GET', url)
    .then(res => {
      callback && callback()
    });
};
