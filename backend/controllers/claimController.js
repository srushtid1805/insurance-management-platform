const {
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
  getCustomerClaims,
  checkUserPolicyBelongsToAgent
} = require("../models/claimModel");

// Create Claim
const addClaim = async (req, res) => {
  try {
    const {
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status
    } = req.body;

    if (req.user.role === "agent") {
      const belongsToAgent = await checkUserPolicyBelongsToAgent(
        user_policy_id,
        req.user.id
      );

      if (!belongsToAgent) {
        return res.status(403).json({
          message: "You can create claims only for your own customers"
        });
      }
    }

    const claim = await createClaim(
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status
    );

    res.status(201).json({
      message: "Claim added successfully",
      claim
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add claim"
    });
  }
};

// Get All Claims
const getClaims = async (req, res) => {
  try {
    const { search = "", status = "", page = 1, limit = 5 } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const recordsPerPage = Math.max(Number(limit) || 5, 1);

    const result = await getAllClaims({
      search: search.trim(),
      status: status.trim(),
      page: currentPage,
      limit: recordsPerPage,
      role: req.user.role,
      userId: req.user.id
    });

    const totalPages = Math.ceil(result.totalRecords / recordsPerPage);

    res.status(200).json({
      message: "Claims fetched successfully",
      data: result.claims,
      pagination: {
        currentPage,
        totalPages,
        totalRecords: result.totalRecords,
        limit: recordsPerPage
      }
    });
  } catch (error) {
    console.error("Error fetching claims:", error);

    res.status(500).json({
      message: "Failed to fetch claims"
    });
  }
};

// Get Claim By ID
const getClaim = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await getClaimById(id, req.user.role, req.user.id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found"
      });
    }

    res.status(200).json({
      message: "Claim fetched successfully",
      claim
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch claim"
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
      claim_status
    } = req.body;

    if (req.user.role === "agent") {
      const belongsToAgent = await checkUserPolicyBelongsToAgent(
        user_policy_id,
        req.user.id
      );

      if (!belongsToAgent) {
        return res.status(403).json({
          message: "You can update claims only for your own customers"
        });
      }
    }

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
        message: "Claim not found"
      });
    }

    res.status(200).json({
      message: "Claim updated successfully",
      claim
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update claim"
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
        message: "Claim not found"
      });
    }

    res.status(200).json({
      message: "Claim deleted successfully",
      claim
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete claim"
    });
  }
};

// Get logged-in customer's claims
const getMyClaims = async (req, res) => {
  try {
    const customerId = req.user.id;

    const claims = await getCustomerClaims(customerId);

    return res.status(200).json({
      message: "Customer claims fetched successfully",
      data: claims
    });
  } catch (error) {
    console.error("Error fetching customer claims:", error);

    return res.status(500).json({
      message: "Failed to fetch customer claims",
      error: error.message
    });
  }
};

module.exports = {
  addClaim,
  getClaims,
  getClaim,
  updateClaimDetails,
  deleteClaimDetails,
  getMyClaims
};
