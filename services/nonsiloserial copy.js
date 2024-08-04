// http://silotosidewalks.com/app/REST/v1/purchsed_serial_number.php?serial_number_purchased=

import axios from "axios";
export default async function nonSiloCodeInformation(serialNumberPurchased) {
  return await axios
    .get(
      `http://silotosidewalks.com/app/REST/v1/purchsed_serial_number.php?serial_number_purchased=` +
        serialNumberPurchased,
      {
        params: {
          serial_number_purchased: serialNumberPurchased,
        },
      }
    )
    .then((response) => {
      //   alert(JSON.stringify(response.data));
      // console.log(response.data); // Process the data as needed
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
