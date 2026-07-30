import axios from "axios";

const API_URL = "http://localhost:5000/api/claims";

// Get all claims
export const getAllClaims = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  const response = await axios.get(API_URL, {
    params: {
      search,
      status,
      page,
      limit,
    },
  });

  return response.data;
};

// Create claim
export const createClaim = async (claimData) => {
  const response = await axios.post(API_URL, claimData);
  return response.data.claim;
};

// Update claim
export const updateClaim = async (claimId, claimData) => {
  const response = await axios.put(
    `${API_URL}/${claimId}`,
    claimData
  );

  return response.data.claim;
};

// Delete claim
export const deleteClaim = async (claimId) => {
  const response = await axios.delete(
    `${API_URL}/${claimId}`
  );

  return response.data;
};