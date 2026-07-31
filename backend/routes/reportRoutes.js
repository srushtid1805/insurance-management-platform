const express = require("express");
const router = express.Router();

const {
  fetchDashboardSummary,
  fetchClaimStatistics,
  fetchPremiumCollection,
  fetchCustomerGrowth,
  fetchMonthlyBusinessOverview,
} = require("../controllers/reportController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Dashboard Summary
router.get(
  "/summary", 
  protect,
  authorizeRoles("admin"),
  fetchDashboardSummary);

router.get(
  "/claim-statistics",
  protect,
  authorizeRoles("admin"),
  fetchClaimStatistics);

router.get(
  "/premium-collection", 
  protect,
  authorizeRoles("admin"),
  fetchPremiumCollection);

router.get(
  "/customer-growth", 
  protect,
  authorizeRoles("admin"),
  fetchCustomerGrowth);

router.get(
  "/monthly-business",
  protect,
  authorizeRoles("admin"),
  fetchMonthlyBusinessOverview
);

module.exports = router;