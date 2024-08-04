// http://silotosidewalks.com/app/REST/v1/purchsed_serial_number.php?serial_number_purchased=

import axios from "axios";

let url = "http://silotosidewalks.com/app/REST/v1/purchsed_serial_number.php";

export default async function nonSiloCodeInformation(serialNumberPurchased) {
  try {
    const response = await axios.get(url, {
      params: {
        serial_number_purchased: serialNumberPurchased,
      },
    });
    return response.data; // Ensure this returns the data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Ensure the error is thrown to be caught by the calling function
  }
}
