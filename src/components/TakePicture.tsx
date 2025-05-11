import React, { useState, useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";

import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";

export const TakePhoto: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://10.17.88.110:3000");

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

  const sendPicture = async () => {

    console.log("📸 Enviando foto:", photo);
    if (!photo) {
      Alert.alert("⚠️ No hay foto para enviar");
      
      return;
    };

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
              onPress={() => setPhoto(null)}>
             <MaterialIcons name="replay" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendPicture}
            >
              <MaterialIcons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <CameraView style={styles.camera} ref={cameraRef} />
          <View style={styles.buttonContainer}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  takePictureButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
  },

  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,

    borderWidth: 4,
    borderColor: "#000",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
  },
  preview: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  previewButtons: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  sendButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },

});
