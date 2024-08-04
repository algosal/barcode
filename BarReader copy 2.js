import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import nonSiloCodeInformation from "./services/nonsiloserial"; // Ensure the path is correct

let uuid = 0;
let uuid2 = 1000; // Initialize uuid2

export default function BarReader(props) {
  let scanned = props.scanned;
  let setScanned = props.setScanned;
  let setMyList = props.setMyList;
  let myList = props.myList;

  const handleBarCodeScanned = async ({ type, data }) => {
    uuid += 1;
    uuid2 += 1000;

    let SiloScannedProduct;
    let newItem = {};

    try {
      SiloScannedProduct = JSON.parse(data);
      newItem = {
        id: uuid,
        productId: SiloScannedProduct.productId,
        productName: SiloScannedProduct.productName,
        price: SiloScannedProduct.price.toString(),
        serial: SiloScannedProduct.serial,
      };
      setMyList([...myList, newItem]);
    } catch (e) {
      try {
        const response = await nonSiloCodeInformation(data);
        alert(JSON.stringify(response));
        alert("in the async");
        alert(data + " is type: " + type);

        newItem = {
          id: uuid2,
          productId: response.VariationID, // Use actual response data
          productName: response.Name, // Use actual response data
          price: response.Price.toString(), // Use actual response data
          serial: response.Serial_Number, // Use actual response data
        };
        setMyList([...myList, newItem]);
      } catch (apiError) {
        alert("This was not found in the DBMS Either");
        console.error(apiError); // Log the error to see more details
      }

      alert("This is not our QR Code");
    }

    setScanned(true);
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10, // This will start the component right below the SafeAreaView
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 0,
    maxHeight: 600,
  },
});
