import axios from "axios";

const API_URL = "http://localhost:5000/api/user-policies";

// Get all assigned policies
export const getUserPolicies = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Assign policy to user
export const assignUserPolicy = async (userPolicyData) => {
    const response = await axios.post(API_URL, userPolicyData);
    return response.data;
};

// Update assigned policy
export const updateUserPolicy = async (id, userPolicyData) => {
    const response = await axios.put(`${API_URL}/${id}`, userPolicyData);
    return response.data;
};

// Delete assigned policy
export const deleteUserPolicy = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};