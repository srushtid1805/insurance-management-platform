const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getCustomer,
  updateCustomerDetails,
  deleteCustomerDetails,
  fetchCustomerPolicies
} = require("../controllers/customerController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Get all customers
router.get(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  getCustomers
);

// Customer: get their own policies
// This must remain before "/:id"
router.get(
  "/my-policies",
  protect,
  authorizeRoles("customer"),
  fetchCustomerPolicies
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