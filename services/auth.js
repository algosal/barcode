import axios from "axios";

const API_URL = "https://silotosidewalks.com/app/REST/v1/userAuth.php"; // Replace with your backend API URL

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};
