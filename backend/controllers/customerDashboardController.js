const {
  getCustomerDashboardSummary,
  getCustomerProfile,
  getCustomerRecentPolicies,
  getCustomerNextPremium
} = require("../models/customerDashboardModel");

const fetchCustomerDashboard = async (req, res) => {
  try {
    const customerId = req.user.id;

    const profile = await getCustomerProfile(customerId);

    if (!profile) {
      return res.status(404).json({
        message: "Customer profile not found"
      });
    }

    const summary = await getCustomerDashboardSummary(customerId);
    const recentPolicies = await getCustomerRecentPolicies(customerId);
    const nextPremium = await getCustomerNextPremium(customerId);

    return res.status(200).json({
      message: "Customer dashboard fetched successfully",
      data: {
        profile,
        summary,
        next_premium: nextPremium,
        recent_policies: recentPolicies
      }
    });
  } catch (error) {
    console.error("Error fetching customer dashboard:", error);

    return res.status(500).json({
      message: "Failed to fetch customer dashboard",
      error: error.message
    });
  }
};

module.exports = {
  fetchCustomerDashboard
};