import axios from "axios";

// const saleTransaction = {
//   retailerEmail: "retailer@example.com",
//   locationSold: "Store Location",
//   SalesRevenue: 100.0,
//   FederalTax: 5.0,
//   StateTax: 3.0,
//   Total: 108.0,
//   saleDetails: [
//     { productId: 1, productName: "Product 1", price: 50.0, serial: "ABC123" },
//     { productId: 2, productName: "Product 2", price: 50.0, serial: "DEF456" },
//   ],
// };

export default async function SalesTransaction(saleTransaction) {
  return await axios
    .post("https://silotosidewalks.com/app/REST/v1/sales.php", saleTransaction)
    .then((response) => {
      // console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
}
