const express = require("express");
const router = express.Router();

const {
  addPayment,
  getPayments,
  getPayment,
  updatePaymentDetails,
  deletePaymentDetails,
} = require("../controllers/paymentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Create Payment
router.post(
  "/", 
  protect,
  authorizeRoles("admin"),
  addPayment);

// Get All Payments
router.get(
  "/", 
  protect,
  authorizeRoles("admin", "agent"),
  getPayments);

// Get Payment By ID
router.get(
  "/:id", 
  protect,
  authorizeRoles("admin", "agent"),
  getPayment);

// Update Payment
router.put(
  "/:id", 
  protect,
  authorizeRoles("admin"),
  updatePaymentDetails);

// Delete Payment
router.delete(
  "/:id", 
  protect,
  authorizeRoles("admin"),
  deletePaymentDetails);

module.exports = router;