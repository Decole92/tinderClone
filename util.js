import { StyleSheet, Text, View } from "react-native";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import * as ImagePicker from "expo-image-picker";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export async function pickImage() {
  let result = ImagePicker.launchCameraAsync();
  return result;
}

export async function askForPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status;
}

export async function openGallery() {
  let result = await ImagePicker.launchImageLibraryAsync();
  return result;
}

export async function askForPermissonLib() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status;
}

export async function uploadImage(uri, path, fName) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileName = fName || nanoid();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);
  const snapshot = await uploadBytes(imageRef, blob, {
    contentType: "image/jpeg",
  });

  blob.close;
  const url = await getDownloadURL(snapshot.ref);
  return { url, fileName };
}
