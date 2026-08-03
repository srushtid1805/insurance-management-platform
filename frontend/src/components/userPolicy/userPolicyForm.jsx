import { useEffect, useState } from "react";
import { getCustomers } from "../../services/customerService";
import { getPolicies } from "../../services/policyService";
import {
  assignUserPolicy,
  updateUserPolicy
} from "../../services/userPolicyService";
import { toast } from "react-toastify";

function UserPolicyForm({
  fetchUserPolicies,
  selectedUserPolicy,
  setSelectedUserPolicy
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
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
      const data = await getCustomers("", 1, 100);
      setCustomers(data.data || []);
    } catch (error) {
      console.error(error);

      setCustomers([]);

      toast.error(error.response?.data?.message || "Failed to load customers.");
    }
  };

  const fetchPolicies = async () => {
    try {
      const data = await getPolicies("", "", 1, 100);
      setPolicies(data.data || []);
    } catch (error) {
      console.error(error);

      setPolicies([]);

      toast.error(error.response?.data?.message || "Failed to load policies.");
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

    if (!formData.user_id || !formData.policy_id || !formData.purchase_date) {
      toast.error("Customer, policy, and purchase date are required.");
      return;
    }

    // Next Premium Date Validation
    if (
      formData.next_premium_date &&
      formData.next_premium_date < formData.purchase_date
    ) {
      toast.error("Next premium date cannot be before the purchase date.");
      return;
    }

    // Expiry Date Validation
    if (
      formData.expiry_date &&
      formData.expiry_date <= formData.purchase_date
    ) {
      toast.error("Expiry date must be after the purchase date.");
      return;
    }

    try {
      let data;

      if (selectedUserPolicy && role === "admin") {
        data = await updateUserPolicy(selectedUserPolicy.id, formData);
      } else {
        data = await assignUserPolicy(formData);
      }

      await fetchUserPolicies();

      toast.success(
        data.message ||
          (selectedUserPolicy && role === "admin"
            ? "User policy updated successfully."
            : "Policy assigned successfully.")
      );

      resetForm();
    } catch (error) {
      console.error("Error saving user policy:", error);

      toast.error(
        error.response?.data?.message || "Failed to save user policy."
      );
    }
  };

  return (
    <div>
      <div className="policy-form-header">
        <p className="policy-form-eyebrow">POLICY ASSIGNMENT</p>

        <h3>
          {selectedUserPolicy && role === "admin"
            ? "Update Assigned Policy"
            : "Assign Policy"}
        </h3>

        <p>
          Assign insurance policies to customers and manage their policy
          details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label">Customer</label>

            <select
              className="form-select"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Customer</option>

              {customers
                .filter((customer) => customer.full_name)
                .map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Policy</label>

            <select
              className="form-select"
              name="policy_id"
              value={formData.policy_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Policy</option>

              {policies
                .filter((policy) => policy.policy_name)
                .map((policy) => (
                  <option key={policy.policy_id} value={policy.policy_id}>
                    {policy.policy_name}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Nominee Name</label>

            <input
              type="text"
              className="form-control"
              name="nominee_name"
              value={formData.nominee_name}
              onChange={handleChange}
              placeholder="Enter nominee name"
              required
            />
          </div>

          <div className="col-md-6">
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

          <div className="col-md-4">
            <label className="form-label">Purchase Date</label>

            <input
              type="date"
              className="form-control"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Next Premium Date</label>

            <input
              type="date"
              className="form-control"
              name="next_premium_date"
              value={formData.next_premium_date}
              onChange={handleChange}
              min={formData.purchase_date}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Expiry Date</label>

            <input
              type="date"
              className="form-control"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              min={formData.purchase_date}
            />
          </div>
        </div>

        <div className="policy-form-actions">
          <button type="submit" className="btn btn-primary">
            {selectedUserPolicy && role === "admin"
              ? "Update Policy"
              : "Assign Policy"}
          </button>

          {selectedUserPolicy && role === "admin" && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UserPolicyForm;
