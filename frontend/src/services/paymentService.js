import api from "./api";

const PAYMENT_URL = "/payments";

// Get all payments
export const getAllPayments = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await api.get(PAYMENT_URL, {
      params: {
        search,
        status,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Create payment
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post(
      PAYMENT_URL,
      paymentData
    );

    return response.data.payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Update payment
export const updatePayment = async (
  paymentId,
  paymentData
) => {
  try {
    const response = await api.put(
      `${PAYMENT_URL}/${paymentId}`,
      paymentData
    );

    return response.data.payment;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// Delete payment
export const deletePayment = async (paymentId) => {
  try {
    const response = await api.delete(
      `${PAYMENT_URL}/${paymentId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};