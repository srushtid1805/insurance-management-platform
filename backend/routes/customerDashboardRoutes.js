const express = require("express");

const router = express.Router();

const {
  fetchCustomerDashboard
} = require("../controllers/customerDashboardController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
  "/dashboard",
  protect,
  authorizeRoles("customer"),
  fetchCustomerDashboard
);

module.exports = router;