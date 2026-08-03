const express = require("express");
const router = express.Router();

const {
  addPayment,
  getPayments,
  getPayment,
  updatePaymentDetails,
  deletePaymentDetails,
  getMyPayments
} = require("../controllers/paymentController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Create payment
router.post(
  "/",
  protect,
  authorizeRoles("admin","agent"),
  addPayment
);

// Get all payments for admin and agent
router.get(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  getPayments
);

// Customer: get only their own payments
// Keep this before "/:id"
router.get(
  "/my-payments",
  protect,
  authorizeRoles("customer"),
  getMyPayments
);

// Get payment by ID
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  getPayment
);

// Update payment
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updatePaymentDetails
);

// Delete payment
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePaymentDetails
);

module.exports = router;