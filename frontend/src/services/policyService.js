import axios from "axios";

const API_URL = "http://localhost:5000/api/policies";

export const getPolicies = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        search,
        status,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    throw error;
  }
};

export const getPolicyById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching policy:", error);
        throw error;
    }
};

export const addPolicy = async (policyData) => {
    try {
        const response = await axios.post(API_URL, policyData);
        return response.data;
    } catch (error) {
        console.error("Error adding policy:", error);
        throw error;
    }
};

export const updatePolicy = async (id, policyData) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}`,
            policyData
        );

        return response.data;
    } catch (error) {
        console.error("Error updating policy:", error);
        throw error;
    }
};

export const deletePolicy = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting policy:", error);
        throw error;
    }
};