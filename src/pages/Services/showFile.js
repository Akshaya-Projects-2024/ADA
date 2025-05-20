import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import PDFView from "react-native-view-pdf";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Header from "../../components/Header";
import CrossIcon from "../../assets/svg/CrossIcon";
import { moderateScale } from "react-native-size-matters";

const ShowFile = (props) => {
  const { modalVisible, setModalVisible, webUrl } = props;
  const extension = webUrl?.split(".").pop()?.toLowerCase();
  const resourceType = "url";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleWordFile = async (fileUrl) => {
      try {
        const fileName = fileUrl.split("/").pop() || "temp.docx";
        const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        const downloadResult = await RNFS.downloadFile({
          fromUrl: fileUrl,
          toFile: localPath,
        }).promise;

        if (downloadResult.statusCode === 200) {
          await FileViewer.open(localPath);
          setModalVisible(false); // close modal after opening
        } else {
          throw new Error("Failed to download Word file");
        }
      } catch (error) {
        console.error("Error opening Word file:", error);
        Alert.alert("Error", "Could not open Word file.");
      } finally {
        setLoading(false);
      }
    };

    if (modalVisible && (extension === "doc" || extension === "docx")) {
      handleWordFile(webUrl);
    } else {
      setLoading(false);
    }
  }, [modalVisible]);

  return (
    <Modal transparent={true} animationType="fade" visible={modalVisible}>
      {console.log("extension", extension)}
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingVertical: moderateScale(20),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <CrossIcon />
          </TouchableOpacity>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" />
              <Text>Loading...</Text>
            </View>
          ) : extension === "pdf" ? (
            <PDFView
              fadeInDuration={250.0}
              style={{ flex: 1 }}
              resource={webUrl}
              resourceType={resourceType}
              onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
              onError={(error) => console.log("Cannot render PDF", error)}
            />
          ) : extension == "jpg" ||
            extension == "jpeg" ||
            extension == "png" ? (
            <View
              style={{
                flex: 0.8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: webUrl }}
                style={{ width: 300, height: 300, alignSelf: "center" }}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.centerContent}>
              <Text>Unsupported file type</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    margin: 0,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowFile;
