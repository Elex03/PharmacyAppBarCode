import React, { useState, useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker"; // ✅ Importar ImagePicker

export const TakePhoto: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://10.17.84.152:3000");

    socketRef.current.onopen = () => {
      console.log("✅ Conectado al servidor WebSocket");
    };

    socketRef.current.onmessage = (event) => {
      console.log("📨 Mensaje desde servidor:", event.data);
    };

    socketRef.current.onerror = (error) => {
      console.log("❌ Error WebSocket:", error);
    };

    socketRef.current.onclose = () => {
      console.log("🔌 WebSocket cerrado");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setPhoto(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  const sendPicture = async () => {
    console.log("📸 Enviando foto:", photo);
    if (!photo) {
      Alert.alert("⚠️ No hay foto para enviar");
      return;
    }

    try {
      const base64Image = await FileSystem.readAsStringAsync(photo, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "image",
            data: base64Image,
          })
        );
        Alert.alert("✅ Foto enviada por WebSocket");
        setPhoto(null);
      } else {
        Alert.alert("⚠️ WebSocket no está conectado");
      }
    } catch (err) {
      console.error("Error al leer la imagen:", err);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Permiso denegado para usar la cámara.</Text>;
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image
            source={{ uri: photo }}
            style={styles.preview}
            resizeMode="cover"
          />
          <View style={styles.previewButtons}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => setPhoto(null)}
            >
              <MaterialIcons name="replay" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={sendPicture}>
              <MaterialIcons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <CameraView style={styles.camera} ref={cameraRef} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={pickImage}
            >
              <MaterialIcons name="photo-library" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.takePictureButton}
              onPress={takePicture}
            >
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle} />
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  galleryButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 40,
  },
  takePictureButton: {
    alignSelf: "center",
  },
  outerCircle: {
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 50,
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 40,
    width: 40,
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  previewButtons: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendButton: {
    backgroundColor: "#1e88e5",
    padding: 16,
    borderRadius: 50,
  },
});
