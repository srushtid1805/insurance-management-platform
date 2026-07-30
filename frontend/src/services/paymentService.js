import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

// Get all payments
export const getAllPayments = async (
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

// Create payment
export const createPayment = async (paymentData) => {
  const response = await axios.post(API_URL, paymentData);
  return response.data.payment;
};

// Update payment
export const updatePayment = async (paymentId, paymentData) => {
  const response = await axios.put(
    `${API_URL}/${paymentId}`,
    paymentData
  );

  return response.data.payment;
};

// Delete payment
export const deletePayment = async (paymentId) => {
  const response = await axios.delete(
    `${API_URL}/${paymentId}`
  );

  return response.data;
};