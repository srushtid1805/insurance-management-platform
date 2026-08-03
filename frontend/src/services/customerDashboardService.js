import api from "./api";

// Customer dashboard
export const getCustomerDashboard = async () => {
  try {
    const response = await api.get("/customer/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching customer dashboard:", error);
    throw error;
  }
};

// Customer's own policies
export const getCustomerPolicies = async () => {
  try {
    const response = await api.get("/customers/my-policies");
    return response.data;
  } catch (error) {
    console.error("Error fetching customer policies:", error);
    throw error;
  }
};

// Customer's own payments
export const getCustomerPayments = async () => {
  try {
    const response = await api.get("/payments/my-payments");
    return response.data;
  } catch (error) {
    console.error("Error fetching customer payments:", error);
    throw error;
  }
};

// Customer's own claims
export const getCustomerClaims = async () => {
  try {
    const response = await api.get("/claims/my-claims");
    return response.data;
  } catch (error) {
    console.error("Error fetching customer claims:", error);
    throw error;
  }
};

// Customer's own documents
export const getCustomerDocuments = async () => {
  try {
    const response = await api.get("/documents/my-documents");
    return response.data;
  } catch (error) {
    console.error("Error fetching customer documents:", error);
    throw error;
  }
};