import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import nonSiloCodeInformation from "./services/nonsiloserial";

let uuid = 0;
export default function BarReader(props) {
  let scanned = props.scanned;
  let setScanned = props.setScanned;
  let setMyList = props.setMyList;
  let myList = props.myList;
  //   let handleBarCodeScanned = props.handleBarCodeScanned;
  const handleBarCodeScanned = ({ type, data }) => {
    uuid = uuid + 1;
    // alert(uuid);
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
      //fetch from the API on the base of s/n of the supplier
      try {
        //get axios here
        nonSiloCodeInformation(data).then((d) => {
          alert(d);
          alert("in the asyync");
          alert(data + " is type: " + type);
        });

        newItem = {
          id: uuid,
          productId: Number(type),
          productName: data,
          price: "1.0",
          serial: Number(data),
        };

        setMyList([...myList, newItem]);
      } catch (e) {
        alert("This was not found in the DBMS Either");
      }

      alert("This is not our QR Code");
    }
    setScanned(true);
  };
  // let newItem = { id: type, name: data.toString(), price: "$10" };

  // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

  return (
    <View style={styles.container}>
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
    // width: 250,
    padding: 0,
    maxHeight: 600,
    // backgroundColor: "blue",
  },
});
