import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BarcodeScanner } from "./src/components/BarCodeScanner";
import { TakePhoto } from "./src/components/TakePicture";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: "#178BF7",
            },
            headerTintColor: "#fff",
            title: "FarmaNova",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="ScanQRCode"
          component={BarcodeScanner}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            title: "FarmaNova",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="TakePhoto"
          component={TakePhoto}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            title: "FarmaNova",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ScanQRCode")}
      >
        <Text style={styles.buttonText}>Escanear QR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TakePhoto")}
      >
        <Text style={styles.buttonText}>Tomar foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#fff",
  },
  button: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#178BF7",
    backgroundColor: "#fff",
    borderRadius: 5,
    width: 200,
  },
  buttonText: {
    color: "#2E2E2E",
    textAlign: "center",
  },
});
