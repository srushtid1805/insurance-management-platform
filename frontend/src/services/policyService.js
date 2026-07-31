import api from "./api";

const POLICY_URL = "/policies";

export const getPolicies = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await api.get(POLICY_URL, {
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
    const response = await api.get(`${POLICY_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching policy:", error);
    throw error;
  }
};

export const addPolicy = async (policyData) => {
  try {
    const response = await api.post(
      POLICY_URL,
      policyData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding policy:", error);
    throw error;
  }
};

export const updatePolicy = async (
  id,
  policyData
) => {
  try {
    const response = await api.put(
      `${POLICY_URL}/${id}`,
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
    const response = await api.delete(
      `${POLICY_URL}/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting policy:", error);
    throw error;
  }
};