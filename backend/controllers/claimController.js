const {
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
} = require("../models/claimModel");

// Create Claim
const addClaim = async (req, res) => {
  try {
    const {
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status,
    } = req.body;

    const claim = await createClaim(
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status
    );

    res.status(201).json({
      message: "Claim added successfully",
      claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add claim",
    });
  }
};

// Get All Claims
const getClaims = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 5,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const recordsPerPage = Math.max(Number(limit) || 5, 1);

    const result = await getAllClaims({
      search: search.trim(),
      status: status.trim(),
      page: currentPage,
      limit: recordsPerPage,
    });

    const totalPages = Math.ceil(
      result.totalRecords / recordsPerPage
    );

    res.status(200).json({
      message: "Claims fetched successfully",
      data: result.claims,
      pagination: {
        currentPage,
        totalPages,
        totalRecords: result.totalRecords,
        limit: recordsPerPage,
      },
    });
  } catch (error) {
    console.error("Error fetching claims:", error);

    res.status(500).json({
      message: "Failed to fetch claims",
    });
  }
};

// Get Claim By ID
const getClaim = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await getClaimById(id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    res.status(200).json({
      message: "Claim fetched successfully",
      claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch claim",
    });
  }
};

// Update Claim
const updateClaimDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status,
    } = req.body;

    const claim = await updateClaim(
      id,
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status
    );

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    res.status(200).json({
      message: "Claim updated successfully",
      claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update claim",
    });
  }
};

// Delete Claim
const deleteClaimDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await deleteClaim(id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    res.status(200).json({
      message: "Claim deleted successfully",
      claim,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete claim",
    });
  }
};

module.exports = {
  addClaim,
  getClaims,
  getClaim,
  updateClaimDetails,
  deleteClaimDetails,
};