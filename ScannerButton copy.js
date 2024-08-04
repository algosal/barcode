import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import BarReader from "./BarReader";
import { FlatList } from "react-native-gesture-handler";
import ProductList from "./ProductList";

export default function ScannerButton(props) {
  const [scanned, setScanned] = useState(false);
  const products = [
    { id: 1, name: "Product 1", price: "$10" },
    { id: 2, name: "Product 2", price: "$20" },
    { id: 3, name: "Product 3", price: "$30" },
  ];
  const [myList, setMyList] = useState(products);

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Silo's Inventory Scanner</Text>

      {scanned && (
        <View style={styles.scanButton}>
          <Pressable style={styles.button} onPress={() => setScanned(false)}>
            <Text style={styles.textColor}> SCAN </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => alert("The Transaction will be recorded")}
          >
            <Text style={styles.textColor}> REC</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => props.setAuth(false)}>
            <Text style={styles.textColor}> Logout </Text>
          </Pressable>
        </View>
      )}

      {!scanned ? (
        <BarReader
          scanned={scanned}
          setScanned={setScanned}
          setMyList={setMyList}
        />
      ) : (
        <ProductList products={products} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "fles-start",
    backgroundColor: "wheat",
  },
  mainHeading: {
    marginTop: 40,
    fontSize: 25,
    // backgroundColor: "blue",
    textAlign: "center",
    fontWeight: "bold",
    fontVariant: "small-caps",
  },
  textColor: {
    color: "white",
  },

  scanButton: {
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    padding: 5,
    width: 350,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "black",
    width: 120,
  },
});
