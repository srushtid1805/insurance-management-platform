const express = require("express");
const router = express.Router();

const {
  fetchDashboardSummary,
  fetchClaimStatistics,
  fetchPremiumCollection,
  fetchCustomerGrowth,
  fetchMonthlyBusinessOverview,
} = require("../controllers/reportController");

// Dashboard Summary
router.get("/summary", fetchDashboardSummary);

router.get("/claim-statistics", fetchClaimStatistics);

router.get("/premium-collection", fetchPremiumCollection);

router.get("/customer-growth", fetchCustomerGrowth);

router.get(
  "/monthly-business",
  fetchMonthlyBusinessOverview
);

module.exports = router;