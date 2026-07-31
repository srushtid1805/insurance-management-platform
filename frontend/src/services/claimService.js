import api from "./api";

const CLAIM_URL = "/claims";

// Get all claims
export const getAllClaims = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await api.get(CLAIM_URL, {
      params: {
        search,
        status,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching claims:", error);
    throw error;
  }
};

// Create claim
export const createClaim = async (claimData) => {
  try {
    const response = await api.post(
      CLAIM_URL,
      claimData
    );

    return response.data.claim;
  } catch (error) {
    console.error("Error creating claim:", error);
    throw error;
  }
};

// Update claim
export const updateClaim = async (
  claimId,
  claimData
) => {
  try {
    const response = await api.put(
      `${CLAIM_URL}/${claimId}`,
      claimData
    );

    return response.data.claim;
  } catch (error) {
    console.error("Error updating claim:", error);
    throw error;
  }
};

// Delete claim
export const deleteClaim = async (claimId) => {
  try {
    const response = await api.delete(
      `${CLAIM_URL}/${claimId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting claim:", error);
    throw error;
  }
};