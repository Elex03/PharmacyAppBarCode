import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { BarcodeScanningResult } from "expo-camera";
import { useAudioPlayer } from "expo-audio";
export const BarcodeScanner: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(true);
  const [scanned, setScanned] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const player = useAudioPlayer(require("../../assets/store-scanner-beep.mp3"));

  useEffect(() => {
    console.log(scanned)
    if (scanned) {
      player.seekTo(0);
      player.play();
    } else {
      player.pause();
    }
    return () => {
      player.pause();
    };
  }, [scanned]);

  useEffect(() => {
    const connectWebSocket = () => {
      socketRef.current = new WebSocket("ws://10.17.82.184:3000"); // Cambia a tu IP local

      socketRef.current.onopen = () => {
        console.log("Conectado al servidor WebSocket");
      };

      socketRef.current.onmessage = (event) => {
        console.log("Mensaje recibido desde el servidor:", event.data);
      };

      socketRef.current.onclose = () => {
        console.log("Desconectado del servidor WebSocket");
        setTimeout(connectWebSocket, 3000); // Reconectar cada 3 segundos
      };

      socketRef.current.onerror = (error) => {
        console.log("Error en WebSocket:", error);
      };
    };

    connectWebSocket(); // Conectar al WebSocket

    return () => {
      if (socketRef.current) {
        socketRef.current.close(); // Cerrar conexión al desmontar
      }
    };
  }, []);

  const handleBarCodeScanned = (
    scanningResult: BarcodeScanningResult
  ): void => {
    const { data, type } = scanningResult;

    if (!scanned) {
      setScanned(true);
      player.pause();
      Alert.alert("Código escaneado", `Tipo: ${type}\nValor: ${data}`);

      // Enviar el código escaneado si la conexión está abierta
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "text",
            data,
          })
        );
      } else {
        console.log("WebSocket no está abierto. Intentando reconectar...");
      }
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
      {/* Cámara de fondo */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["code128", "ean13", "ean8", "qr"],
        }}
      />

      {/* Overlay con recorte central */}
      <View style={styles.overlay}>
        {/* Parte superior */}
        <View style={styles.overlayBlock} />

        {/* Centro con recorte */}
        <View style={styles.middleRow}>
          <View style={styles.overlayBlock} />
          <View style={styles.scanBox} />
          <View style={styles.overlayBlock} />
        </View>

        {/* Parte inferior */}
        <View style={styles.overlayBlock} />
      </View>

      {/* Contenido */}
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Escanea un código de barras o QR
          </Text>
        </View>

        {scanned && (
          <View style={styles.buttonContainer}>
            <Button
              title="Escanear de nuevo"
              onPress={() => setScanned(false)}
            />
          </View>
        )}
      </View>
    </View>
  );
};
const BOX_SIZE = 300;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  overlayBlock: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  middleRow: {
    flexDirection: "row",
  },
  scanBox: {
    width: BOX_SIZE,
    height: BOX_SIZE - 200,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  header: {
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    margin: 50,
    borderRadius: 10,
  },
})
