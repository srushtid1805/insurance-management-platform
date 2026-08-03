import { useState, useEffect } from "react";

const initialFormData = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  date_of_birth: "",
  address: ""
};

function CustomerForm({
  onAddCustomer,
  onUpdateCustomer,
  selectedCustomer,
  isEditing
}) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        full_name: selectedCustomer.full_name || "",
        email: selectedCustomer.email || "",
        phone: selectedCustomer.phone || "",
        password: "",
        date_of_birth: selectedCustomer.date_of_birth
          ? selectedCustomer.date_of_birth.split("T")[0]
          : "",
        address: selectedCustomer.address || ""
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedCustomer]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isEditing) {
        await onUpdateCustomer(formData);
      } else {
        await onAddCustomer(formData);
      }

      setFormData(initialFormData);
    } catch (error) {
      console.error("Customer form submission failed:", error);
    }
  };
 return (
  <form className="customer-form" onSubmit={handleSubmit}>
    <div className="customer-form-header">
      <div>
        <p className="customer-form-eyebrow">
          {isEditing ? "Update Record" : "New Customer"}
        </p>

        <h3>
          {isEditing ? "Edit Customer" : "Add Customer"}
        </h3>

        <p>
          {isEditing
            ? "Update the selected customer details."
            : "Enter the customer details below to create a new record."}
        </p>
      </div>
    </div>

    <div className="row g-3">
      <div className="col-12 col-md-6">
        <label
          htmlFor="full_name"
          className="form-label"
        >
          Full Name
        </label>

        <input
          id="full_name"
          type="text"
          name="full_name"
          className="form-control"
          placeholder="Enter full name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="email"
          className="form-label"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="phone"
          className="form-label"
        >
          Phone Number
        </label>

        <input
          id="phone"
          type="tel"
          name="phone"
          className="form-control"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="password"
          className="form-label"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          className="form-control"
          placeholder={
            isEditing
              ? "Password cannot be changed here"
              : "Enter password"
          }
          value={isEditing ? "" : formData.password}
          onChange={handleChange}
          required={!isEditing}
          disabled={isEditing}
          autoComplete="new-password"
        />

        {isEditing && (
          <small className="text-muted">
            Password updates are disabled in this form.
          </small>
        )}
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="date_of_birth"
          className="form-label"
        >
          Date of Birth
        </label>

        <input
          id="date_of_birth"
          type="date"
          name="date_of_birth"
          className="form-control"
          value={formData.date_of_birth}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="address"
          className="form-label"
        >
          Address
        </label>

        <input
          id="address"
          type="text"
          name="address"
          className="form-control"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="customer-form-actions">
      <button
        type="submit"
        className="btn btn-primary"
      >
        {isEditing ? "Update Customer" : "Save Customer"}
      </button>
    </div>
  </form>
);
}

export default CustomerForm;
