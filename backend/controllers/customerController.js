const {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../models/customerModel");

const { getCustomerPolicies } = require("../models/customerDashboardModel");

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const { customers, totalRecords } = await getAllCustomers({
      search,
      page,
      limit,
      role: req.user.role,
      userId: req.user.id
    });

    res.status(200).json({
      message: "Customers fetched successfully",
      data: customers,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message
    });
  }
};

// Get customer by ID
const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await getCustomerById(id, req.user.role, req.user.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json({
      message: "Customer fetched successfully",
      customer
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customer"
    });
  }
};

// Update customer
const updateCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const { full_name, email, phone, date_of_birth, address } = req.body;

    const customer = await updateCustomer(
      id,
      full_name,
      email,
      phone,
      date_of_birth,
      address
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update customer"
    });
  }
};

// Delete customer
const deleteCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await deleteCustomer(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
      customer
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      return res.status(409).json({
        message:
          "Cannot delete this customer because one or more policies are assigned to them."
      });
    }

    res.status(500).json({
      message: "Failed to delete customer"
    });
  }
};

const fetchCustomerPolicies = async (req, res) => {
  try {
    const userId = req.user.id;

    const policies = await getCustomerPolicies(userId);

    res.status(200).json({
      message: "Customer policies fetched successfully",
      data: policies
    });
  } catch (error) {
    console.error("Error fetching customer policies:", error);

    res.status(500).json({
      message: "Failed to fetch customer policies",
      error: error.message
    });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomerDetails,
  deleteCustomerDetails,
  fetchCustomerPolicies
};
