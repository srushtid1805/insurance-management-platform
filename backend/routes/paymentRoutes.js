const express = require("express");
const router = express.Router();

const {
  addPayment,
  getPayments,
  getPayment,
  updatePaymentDetails,
  deletePaymentDetails,
} = require("../controllers/paymentController");

// Create Payment
router.post("/", addPayment);

// Get All Payments
router.get("/", getPayments);

// Get Payment By ID
router.get("/:id", getPayment);

// Update Payment
router.put("/:id", updatePaymentDetails);

// Delete Payment
router.delete("/:id", deletePaymentDetails);

module.exports = router;