const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getCustomer,
  updateCustomerDetails,
  deleteCustomerDetails,
} = require("../controllers/customerController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Get all customers
router.get(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  getCustomers
);

// Get customer by ID
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  getCustomer
);

// Update customer
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCustomerDetails
);

// Delete customer
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCustomerDetails
);

module.exports = router;
