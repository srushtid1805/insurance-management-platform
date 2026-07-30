import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

export const getDashboardSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const getClaimStatistics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/claim-statistics`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching claim statistics:", error);
    throw error;
  }
};

export const getPremiumCollection = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/premium-collection`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching premium collection:", error);
    throw error;
  }
};

export const getCustomerGrowth = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/customer-growth`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching customer growth:", error);
    throw error;
  }
};

export const getMonthlyBusinessOverview = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/monthly-business`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching monthly business overview:",
      error
    );

    throw error;
  }
};