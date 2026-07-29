import { useEffect, useState } from "react";
import { getCustomers } from "../../services/customerService";
import { getPolicies } from "../../services/policyService";
import {
  assignUserPolicy,
  updateUserPolicy
} from "../../services/userPolicyService";

function UserPolicyForm({
  fetchUserPolicies,
  selectedUserPolicy,
  setSelectedUserPolicy
}) {
  const [formData, setFormData] = useState({
    user_id: "",
    policy_id: "",
    nominee_name: "",
    purchase_date: "",
    next_premium_date: "",
    expiry_date: "",
    policy_status: "Active"
  });

  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (selectedUserPolicy) {
      setFormData({
        user_id: selectedUserPolicy.user_id,
        policy_id: selectedUserPolicy.policy_id,
        nominee_name: selectedUserPolicy.nominee_name || "",
        purchase_date: selectedUserPolicy.purchase_date
          ? selectedUserPolicy.purchase_date.split("T")[0]
          : "",
        next_premium_date: selectedUserPolicy.next_premium_date
          ? selectedUserPolicy.next_premium_date.split("T")[0]
          : "",
        expiry_date: selectedUserPolicy.expiry_date
          ? selectedUserPolicy.expiry_date.split("T")[0]
          : "",
        policy_status: selectedUserPolicy.policy_status || "Active"
      });
    }
  }, [selectedUserPolicy]);

  const resetForm = () => {
    setFormData({
      user_id: "",
      policy_id: "",
      nominee_name: "",
      purchase_date: "",
      next_premium_date: "",
      expiry_date: "",
      policy_status: "Active"
    });

    setSelectedUserPolicy(null);
  };

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();

      console.log("Customers response:", data);

      setCustomers(data.customers || data.users || []);
    } catch (error) {
      console.error(error);
      setCustomers([]);
    }
  };

  const fetchPolicies = async () => {
    try {
      const data = await getPolicies();

      console.log("Policies response:", data);

      setPolicies(data.policies || []);
    } catch (error) {
      console.error(error);
      setPolicies([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.user_id || !formData.policy_id || !formData.purchase_date) {
      setErrorMessage("Customer, policy, and purchase date are required.");
      return;
    }

    try {
      let data;

      if (selectedUserPolicy) {
        data = await updateUserPolicy(selectedUserPolicy.id, formData);
      } else {
        data = await assignUserPolicy(formData);
      }

      await fetchUserPolicies();

      setSuccessMessage(
        data.message ||
          (selectedUserPolicy
            ? "User policy updated successfully."
            : "Policy assigned successfully.")
      );

      resetForm();
    } catch (error) {
      console.error("Error saving user policy:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to save user policy."
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>{selectedUserPolicy ? "Update Assigned Policy" : "Assign Policy"}</h2>
      {successMessage && <p className="text-success">{successMessage}</p>}

      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Customer</label>

          <select
            className="form-select"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Policy</label>

          <select
            className="form-select"
            name="policy_id"
            value={formData.policy_id}
            onChange={handleChange}
          >
            <option value="">Select Policy</option>

            {policies.map((policy) => (
              <option key={policy.policy_id} value={policy.policy_id}>
                {policy.policy_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Nominee Name</label>

          <input
            type="text"
            className="form-control"
            name="nominee_name"
            value={formData.nominee_name}
            onChange={handleChange}
            placeholder="Enter nominee name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Purchase Date</label>

          <input
            type="date"
            className="form-control"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Next Premium Date</label>

          <input
            type="date"
            className="form-control"
            name="next_premium_date"
            value={formData.next_premium_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Expiry Date</label>

          <input
            type="date"
            className="form-control"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Policy Status</label>

          <select
            className="form-select"
            name="policy_status"
            value={formData.policy_status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {selectedUserPolicy ? "Update Policy" : "Assign Policy"}
        </button>

        {selectedUserPolicy && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default UserPolicyForm;
