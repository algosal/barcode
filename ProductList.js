// ProductList.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

// let uuid = 0; // bad practice for testing only
const ProductList = (props) => {
  const [productList, setProductList] = [props.products, props.setProductList];
  // uuid += 1; //bad practice for testing only
  // alert(uuid);
  // Calculate the total price
  const total = productList.reduce(
    (sum, product) => sum + parseFloat(product.price.replace("$", "")),
    0
  );

  // Function to delete an item
  const deleteItem = (itemId) => {
    const updatedList = productList.filter((item) => item.id !== itemId);
    setProductList(updatedList);
  };

  // const deleteEmoji = "\u274C"; // Hexadecimal code point for ❌
  // const trashcanEmoji = "\uD83D\uDEAE"; // Hexadecimal code point for 🗑️
  const trashcanEmoji = "🗑️";
  return (
    <View style={styles.container}>
      <FlatList
        data={productList}
        keyExtractor={(item) => item.id.toString()}
        // keyExtractor={(item) => uuid.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.productName}</Text>
            <Text style={styles.itemText}>{item.price}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteItem(item.id)}
            >
              <Text style={styles.deleteButtonText}>{trashcanEmoji}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>${total.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    maxHeight: 450,
  },
  itemContainer: {
    backgroundColor: "lightgray",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    // backgroundColor: "red",
    padding: 0,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductList;
