import axios from "axios";

const API_URL = "http://localhost:5000/api/customers";

export const getCustomers = async (
  search = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        search,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) =>{
    try{
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting customer:", error);
        throw error;
    }
};

export const addCustomer = async (customerData) =>{
    try{
        const response = await axios.post(
            "http://localhost:5000/api/auth/register",
            customerData
        );

        return response.data;
    } catch (error){
        console.error("Error adding customer:", error);
        throw error;
    }
};

export const updateCustomer = async (id, customerData) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}`,
            customerData
        );

        return response.data;
    } catch (error) {
        console.error("Error updating customer:", error);
        throw error;
    }
};