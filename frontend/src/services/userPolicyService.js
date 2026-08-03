import api from "./api";

const USER_POLICY_URL = "/user-policies";

// Get all assigned policies
export const getUserPolicies = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await api.get(USER_POLICY_URL, {
      params: {
        search,
        status,
        page,
        limit
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user policies:", error);
    throw error;
  }
};

// Assign policy to user
export const assignUserPolicy = async (userPolicyData) => {
  try {
    const response = await api.post(
      USER_POLICY_URL,
      userPolicyData
    );

    return response.data;
  } catch (error) {
    console.error("Error assigning user policy:", error);
    throw error;
  }
};

// Update assigned policy
export const updateUserPolicy = async (
  id,
  userPolicyData
) => {
  try {
    const response = await api.put(
      `${USER_POLICY_URL}/${id}`,
      userPolicyData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user policy:", error);
    throw error;
  }
};

// Delete assigned policy
export const deleteUserPolicy = async (id) => {
  try {
    const response = await api.delete(
      `${USER_POLICY_URL}/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting user policy:", error);
    throw error;
  }
};
