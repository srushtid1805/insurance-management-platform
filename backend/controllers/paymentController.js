const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../models/paymentModel");

// Create Payment
const addPayment = async (req, res) => {
  try {
    const {
      user_policy_id,
      amount,
      payment_date,
      due_date,
      payment_method,
      payment_status,
    } = req.body;

    const payment = await createPayment(
      user_policy_id,
      amount,
      payment_date,
      due_date,
      payment_method,
      payment_status
    );

    res.status(201).json({
      message: "Payment added successfully",
      payment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add payment",
    });
  }
};

// Get All Payments
const getPayments = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 5,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const recordsPerPage = Math.max(Number(limit) || 5, 1);

    const result = await getAllPayments({
      search: search.trim(),
      status: status.trim(),
      page: currentPage,
      limit: recordsPerPage,
    });

    const totalPages = Math.ceil(
      result.totalRecords / recordsPerPage
    );

    res.status(200).json({
      message: "Payments fetched successfully",
      data: result.payments,
      pagination: {
        currentPage,
        totalPages,
        totalRecords: result.totalRecords,
        limit: recordsPerPage,
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);

    res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
};

// Get Payment By ID
const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await getPaymentById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment fetched successfully",
      payment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch payment",
    });
  }
};

// Update Payment
const updatePaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user_policy_id,
      amount,
      payment_date,
      due_date,
      payment_method,
      payment_status,
    } = req.body;

    const payment = await updatePayment(
      id,
      user_policy_id,
      amount,
      payment_date,
      due_date,
      payment_method,
      payment_status
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update payment",
    });
  }
};

// Delete Payment
const deletePaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await deletePayment(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment deleted successfully",
      payment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addPayment,
  getPayments,
  getPayment,
  updatePaymentDetails,
  deletePaymentDetails,
};