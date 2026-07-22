const express = require("express");
const router = express.Router();

const{
    getCustomers,
    getCustomer,
    updateCustomerDetails,
    deleteCustomerDetails,
} = require("../controllers/customerController");

// Get all customers
router.get("/", getCustomers);

// Get customer by ID
router.get("/:id", getCustomer);

// Update customer
router.put("/:id", updateCustomerDetails);

// Delete customer
router.delete("/:id", deleteCustomerDetails);

module.exports = router;
