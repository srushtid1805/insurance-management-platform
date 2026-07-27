import { useEffect, useState } from "react";
import PolicyForm from "../components/policy/policyForm";

import {
  getPolicies,
  addPolicy,
  updatePolicy,
  deletePolicy
} from "../services/policyService";

function PolicyPage() {
  const [policies, setPolicies] = useState([]);

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Fetch all policies
  const fetchPolicies = async () => {
    try {
      const data = await getPolicies();

      setPolicies(data.policies);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Policy
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this policy?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deletePolicy(id);
      await fetchPolicies();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Edit Policy
  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setIsEditing(true);
  };

  // Add Policy
  const handleAddPolicy = async (policyData) => {
    try {
      await addPolicy(policyData);
      await fetchPolicies();

      alert("Policy Added Successfully!");
      return true;
    } catch (error) {
      console.error(error);
      alert("Failed to add policy.");
      return false;
    }
  };

  // Update Policy
  const handleUpdatePolicy = async (policyData) => {
    try {
      await updatePolicy(selectedPolicy.policy_id, policyData);

      await fetchPolicies();

      setSelectedPolicy(null);
      setIsEditing(false);

      alert("Policy Updated Successfully!");
      return true;
    } catch (error) {
      console.error(error);
      alert("Failed to update policy.");
      return false;
    }
  };

  return (
    <div>
      <h1>Insurance Management System</h1>

      <hr />

      <h2>Policy Management</h2>

      <PolicyForm
        onAddPolicy={handleAddPolicy}
        onUpdatePolicy={handleUpdatePolicy}
        selectedPolicy={selectedPolicy}
        isEditing={isEditing}
      />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Policy Name</th>
            <th>Policy Type</th>
            <th>Premium</th>
            <th>Coverage</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {policies.length === 0 ? (
            <tr>
              <td colSpan="9">No policies found.</td>
            </tr>
          ) : (
            policies.map((policy) => (
              <tr key={policy.policy_id}>
                <td>{policy.policy_id}</td>
                <td>{policy.policy_name}</td>
                <td>{policy.policy_type}</td>
                <td>{policy.premium_amount}</td>
                <td>{policy.coverage_amount}</td>
                <td>{policy.duration_months} Months</td>
                <td>{policy.description}</td>
                <td>{policy.status}</td>
                <td>
                  <button onClick={() => handleEdit(policy)}>Edit</button>

                  <button onClick={() => handleDelete(policy.policy_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PolicyPage;
