import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BarcodeScanner } from "./src/components/BarCodeScanner";
import { TakePhoto } from "./src/components/TakePicture";
import { MaterialIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
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
      <View style={{ top: 50, gap: 10}}>
        <Text style={{ fontWeight: "bold", fontSize: 24 , color: 'white'}}>FarmaNova App</Text>
        <View style={{width: 300, height: 3, backgroundColor: 'gray'}}/>
      </View>
      <View style={{ display: "flex", flexDirection: "row", padding: 20, justifyContent: 'space-evenly', margin: 50}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ScanQRCode")}
        >
          <MaterialIcons name="barcode-reader" size={40} color="#26A0FC" />
          <Text style={styles.buttonText}>Escanear QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("TakePhoto")}
        >
          <MaterialIcons name="photo-camera-back" size={30} color="#26A0FC" />
          <Text style={styles.buttonText}>Tomar foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    backgroundColor: 'black', 
  },
  button: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 30,
    height: 200,
    justifyContent: "center",
    alignItems: 'center',
    width: 150
  },
  buttonText: {
    fontWeight: 'bold',
    color: "#fff",
    textAlign: "center",
  },
});
