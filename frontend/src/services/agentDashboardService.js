import api from "./api";

export const getAgentDashboard = async () => {
  try {
    const response = await api.get("/agent/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching agent dashboard:", error);
    throw error;
  }
};