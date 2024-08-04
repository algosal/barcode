// ProductList.js
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const ProductList = ({ products }) => {
  // Calculate the total price
  const total = products.reduce(
    (sum, product) => sum + parseFloat(product.price.replace("$", "")),
    0
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.price}</Text>
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
    maxHeight: 500,
  },
  itemContainer: {
    backgroundColor: "lightgray",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
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
