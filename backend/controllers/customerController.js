const {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../models/customerModel");

// Get all customers
const getCustomers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const { customers, totalRecords } =
            await getAllCustomers({
                search,
                page,
                limit,
            });

        res.status(200).json({
            message: "Customers fetched successfully",
            data: customers,

            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalRecords / limit),
                totalRecords,
                limit,
            },
        });
    } catch (error) {
        console.error("Error fetching customers:", error);

        res.status(500).json({
            message: "Failed to fetch customers",
            error: error.message,
        });
    }
};

// Get customer by ID
const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await getCustomerById(id);

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

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomerDetails,
  deleteCustomerDetails
};
