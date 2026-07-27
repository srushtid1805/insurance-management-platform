import { useEffect, useState } from "react";
import CustomerForm from "../components/CustomerForm";

import { 
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
} from "../services/customerService";

function CustomerPage(){
    const[customers, setCustomers] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(()=>{
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
    try {
        const data = await getCustomers();

        setCustomers(data.customers);
    } catch (error) {
        console.error(error);
    }
};
    // const fetchCustomers = async () => {
    //     try {
    //         const data = await getCustomers();
    //         setCustomers(data.customers);
    //     } catch(error){
    //         console.error(error);
    //     }
    // };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if(!confirmDelete){
            return;
        }

        try{
            await deleteCustomer(id);
            fetchCustomers();
        } catch (error){
            console.error(error);
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setIsEditing(true);
    }

    const handleAddCustomer = async (customerData) => {
        try{
            await addCustomer(customerData);

            fetchCustomers();

            alert("Customer Added Successfully!");
        }catch (error){
            console.error(error);
            alert("Failed to add customer.");
        }
    };

    const handleUpdateCustomer = async (customerData) => {
    try {
        const response = await updateCustomer(
            selectedCustomer.id,
            customerData
        );

        await fetchCustomers();

        setSelectedCustomer(null);
        setIsEditing(false);

        alert("Customer updated successfully!");
    } catch (error) {
        console.error(
            "Update failed:",
            error.response?.data || error.message
        );

        alert(
            error.response?.data?.message ||
            "Failed to update customer."
        );
    }
};

    // const handleUpdateCustomer = async(customerData) => {
    //     try{
    //         await updateCustomer(selectedCustomer.id, customerData);

    //         await fetchCustomers();

    //         setSelectedCustomer(null);
    //         setIsEditing(false);

    //         alert("Customer updated successfully!");
    //     } catch(error){
    //         console.error(error);
    //         alert("Failed to update customer.");
    //     }
    // };

    return (
        <div>
            <h1>Insurance Management System</h1>

            <hr />

            <h2>Customer Management</h2>

            <CustomerForm 
                onAddCustomer = {handleAddCustomer} 
                onUpdateCustomer={handleUpdateCustomer}
                selectedCustomer={selectedCustomer}
                isEditing={isEditing}
                
            />

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer)=> (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.full_name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.address}</td>
                            <td>
                                <button onClick={()=> handleEdit(customer)}>       Edit
                                </button>
                                <button onClick={()=> handleDelete(customer.id)}>       Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


    );
}

export default CustomerPage;