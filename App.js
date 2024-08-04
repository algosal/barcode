import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";
// import { SafeAreaView } from "react-native-safe-area-context";
import ScannerButton from "./ScannerButton";
import Login from "./Login";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  // const byeEmoji = String.fromCodePoint(0x1f44b);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  /////////////////////////////////////////////////

  return (
    <>
      <StatusBar
        barStyle="dark-content" // or "light-content"
        backgroundColor="green" // Change this to your desired color
      />

      <View style={styles.container}>
        {!auth ? (
          <Login setAuth={setAuth} setEmail={setEmail} />
        ) : (
          <ScannerButton setAuth={setAuth} email={email} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "fles-start",
    backgroundColor: "green",
    padding: 16,
    paddingTop: 50,
  },
  headingDiv: {
    paddingVertical: 10,
    paddingTop: 200,
  },
  mainHeading: {
    marginTop: 0,
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    fontVariant: "small-caps",
    margin: 0,
    padding: 0,
  },
  textColor: {
    color: "white",
  },

  scanButton: {
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    borderRadius: 25,
    padding: 5,
    width: 390,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },

  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  spacing: {
    height: 10,
  },
});
