const { 
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
 } = require("../models/customerModel");


// Get all customers
const getCustomers = async (req, res) => {
    try{
        const customers = await getAllCustomers();

        res.status(200).json({
            message: "Customers fetched successfully",
            customers,
        });
    } catch (error){
        console.error(error);

        res.status(500).json({
            message:"Failed to fetch customers",
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
                message: "Customer not found",
            });
        }

        res.status(200).json({
            message: "Customer fetched successfully",
            customer,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer",
        });
    }
};

// Update customer
const updateCustomerDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            full_name,
            email,
            phone,
            date_of_birth,
            address,
        } = req.body;

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
                message: "Customer not found",
            });
        }

        res.status(200).json({
            message: "Customer updated successfully",
            customer,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update customer",
        });
    }
};

// Delete customer
const deleteCustomerDetails = async (req, res) => {
    try{
        const { id } = req.params;

        const customer = await deleteCustomer(id);

        if(!customer){
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully",
            customer,
        });
    } catch(error){
        console.error(error);

        res.status(500).json({
            message:"Failed to delete customer",
        });
    }
};

module.exports = {
    getCustomers,
    getCustomer,
    updateCustomerDetails,
    deleteCustomerDetails,
};
