import api from "./api";

export const getDashboardSummary = async () => {
  try {
    const response = await api.get("/reports/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const getClaimStatistics = async () => {
  try {
    const response = await api.get(
      "/reports/claim-statistics"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching claim statistics:", error);
    throw error;
  }
};

export const getPremiumCollection = async () => {
  try {
    const response = await api.get(
      "/reports/premium-collection"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching premium collection:", error);
    throw error;
  }
};

export const getCustomerGrowth = async () => {
  try {
    const response = await api.get(
      "/reports/customer-growth"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching customer growth:", error);
    throw error;
  }
};

export const getMonthlyBusinessOverview = async () => {
  try {
    const response = await api.get(
      "/reports/monthly-business"
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