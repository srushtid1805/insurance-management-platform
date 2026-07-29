import { useEffect, useState } from "react";
import UserPolicyForm from "../components/userPolicy/userPolicyForm";
import {
  getUserPolicies,
  deleteUserPolicy
} from "../services/userPolicyService";

function UserPolicyPage() {
  const [userPolicies, setUserPolicies] = useState([]);
  const [selectedUserPolicy, setSelectedUserPolicy] = useState(null);

  useEffect(() => {
    fetchUserPolicies();
  }, []);

  const fetchUserPolicies = async () => {
    try {
      const data = await getUserPolicies();
      setUserPolicies(data.userPolicies);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assigned policy?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteUserPolicy(id);
      await fetchUserPolicies();
    } catch (error) {
      console.error("Error deleting user policy:", error);
    }
  };

  return (
    <div className="container mt-4">
      <UserPolicyForm
        fetchUserPolicies={fetchUserPolicies}
        selectedUserPolicy={selectedUserPolicy}
        setSelectedUserPolicy={setSelectedUserPolicy}
      />

      <hr />

      <h2>Assigned Policies</h2>

      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Policy</th>
            <th>Nominee</th>
            <th>Status</th>
            <th>Purchase Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userPolicies.map((policy) => (
            <tr key={policy.id}>
              <td>{policy.customer_name}</td>
              <td>{policy.policy_name}</td>
              <td>{policy.nominee_name}</td>
              <td>{policy.policy_status}</td>
              <td>{new Date(policy.purchase_date).toLocaleDateString()}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setSelectedUserPolicy(policy)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(policy.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserPolicyPage;
