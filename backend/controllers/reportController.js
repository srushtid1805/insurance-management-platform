const {
  getDashboardSummary,
  getClaimStatistics,
  getPremiumCollection,
  getCustomerGrowth,
  getMonthlyBusinessOverview,
} = require("../models/reportModel");

const fetchDashboardSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummary();

    res.status(200).json({
      message: "Dashboard summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

const fetchClaimStatistics = async (req, res) => {
  try {
    const statistics = await getClaimStatistics();

    res.status(200).json({
      message: "Claim statistics fetched successfully",
      data: statistics,
    });
  } catch (error) {
    console.error("Error fetching claim statistics:", error);

    res.status(500).json({
      message: "Failed to fetch claim statistics",
      error: error.message,
    });
  }
};

const fetchPremiumCollection = async (req, res) => {
  try {
    const premiumCollection = await getPremiumCollection();

    res.status(200).json({
      message: "Premium collection fetched successfully",
      data: premiumCollection,
    });
  } catch (error) {
    console.error("Error fetching premium collection:", error);

    res.status(500).json({
      message: "Failed to fetch premium collection",
      error: error.message,
    });
  }
};

const fetchCustomerGrowth = async (req, res) => {
  try {
    const customerGrowth = await getCustomerGrowth();

    res.status(200).json({
      message: "Customer growth fetched successfully",
      data: customerGrowth,
    });
  } catch (error) {
    console.error("Error fetching customer growth:", error);

    res.status(500).json({
      message: "Failed to fetch customer growth",
      error: error.message,
    });
  }
};

const fetchMonthlyBusinessOverview = async (req, res) => {
  try {
    const monthlyBusiness =
      await getMonthlyBusinessOverview();

    res.status(200).json({
      message:
        "Monthly business overview fetched successfully",
      data: monthlyBusiness,
    });
  } catch (error) {
    console.error(
      "Error fetching monthly business overview:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch monthly business overview",
      error: error.message,
    });
  }
};


module.exports = {
  fetchDashboardSummary,
  fetchClaimStatistics,
  fetchPremiumCollection,
  fetchCustomerGrowth,
  fetchMonthlyBusinessOverview,
};