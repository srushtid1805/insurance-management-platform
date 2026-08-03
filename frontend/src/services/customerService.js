import api from "./api";

const CUSTOMER_URL = "/customers";

export const getCustomers = async (
  search = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await api.get(CUSTOMER_URL, {
      params: {
        search,
        page,
        limit
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(
      `${CUSTOMER_URL}/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await api.post(
      "/auth/register",
      customerData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const updateCustomer = async (
  id,
  customerData
) => {
  try {
    const response = await api.put(
      `${CUSTOMER_URL}/${id}`,
      customerData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};