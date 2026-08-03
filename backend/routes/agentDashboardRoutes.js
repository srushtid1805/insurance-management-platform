const express = require("express");

const router = express.Router();

const {
  fetchAgentDashboard
} = require("../controllers/agentDashboardController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
  "/dashboard",
  protect,
  authorizeRoles("agent"),
  fetchAgentDashboard
);

module.exports = router;