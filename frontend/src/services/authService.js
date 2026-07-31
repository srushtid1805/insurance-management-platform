import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to connect to the server",
      }
    );
  }
};