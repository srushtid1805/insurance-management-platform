import { useState, useEffect } from "react";

function CustomerForm({ 
    onAddCustomer,
    onUpdateCustomer,
    selectedCustomer,
    isEditing,
}){
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        date_of_birth: "",
        address: "",
    });

    useEffect(() => {
        if(selectedCustomer){
            setFormData({
                full_name: selectedCustomer.full_name,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
                password: "",
                date_of_birth: selectedCustomer.date_of_birth ? selectedCustomer.date_of_birth.split("T")[0]:"",
                address: selectedCustomer.address,
            });
        }
    }, [selectedCustomer]);


    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (isEditing){
            onUpdateCustomer(formData);
        } else {
            onAddCustomer(formData);
        }
    };

    return(
        <form action="" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit Customer" : "Add Customer"}</h3>

            <input 
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
            />

            <input 
                type="email" 
                name="email" 
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <input 
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
            />

        <input 
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required = {!isEditing}
            />

        <input 
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
            />

        <input 
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
            />

            <button type="submit">
                {isEditing ? "Update Customer" : "Save Customer"}
            </button>
        </form>
    )
}

export default CustomerForm