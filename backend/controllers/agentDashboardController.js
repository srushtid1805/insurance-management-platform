const {
  getAgentDashboardSummary,
  getAgentCustomers
} = require("../models/agentDashboardModel");

const fetchAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user.id;

    const summary = await getAgentDashboardSummary(agentId);
    const recentCustomers = await getAgentCustomers(agentId);

    res.status(200).json({
      message: "Agent dashboard fetched successfully",
      data: {
        summary,
        recent_customers: recentCustomers
      }
    });
  } catch (error) {
    console.error("Error fetching agent dashboard:", error);

    res.status(500).json({
      message: "Failed to fetch agent dashboard",
      error: error.message
    });
  }
};

module.exports = {
  fetchAgentDashboard
};