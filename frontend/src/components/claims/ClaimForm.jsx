import { useEffect, useState } from "react";

const initialFormData = {
  user_policy_id: "",
  claim_amount: "",
  claim_reason: "",
  claim_date: "",
  claim_status: "",
};

const ClaimForm = ({
  onSubmit,
  selectedClaim,
  isEditing,
  userPolicies = [],
}) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedClaim) {
      setFormData({
        user_policy_id: selectedClaim.user_policy_id || "",
        claim_amount: selectedClaim.claim_amount || "",
        claim_reason: selectedClaim.claim_reason || "",
        claim_date: selectedClaim.claim_date
          ? selectedClaim.claim_date.split("T")[0]
          : "",
        claim_status: selectedClaim.claim_status || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedClaim]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await onSubmit(formData);

      if (!isEditing) {
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Update Claim" : "Add Claim"}</h2>

      <select
        name="user_policy_id"
        value={formData.user_policy_id}
        onChange={handleChange}
        required
      >
        <option value="">Select Customer and Policy</option>

        {userPolicies.map((item) => (
          <option key={item.id} value={item.id}>
            {item.customer_name} - {item.policy_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="claim_amount"
        placeholder="Claim Amount"
        value={formData.claim_amount}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
      />

      <textarea
        name="claim_reason"
        placeholder="Claim Reason"
        value={formData.claim_reason}
        onChange={handleChange}
        required
      />

      <label>Claim Date</label>

      <input
        type="date"
        name="claim_date"
        value={formData.claim_date}
        onChange={handleChange}
        required
      />

      <select
        name="claim_status"
        value={formData.claim_status}
        onChange={handleChange}
        required
      >
        <option value="">Select Claim Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      <button type="submit">
        {isEditing ? "Update Claim" : "Add Claim"}
      </button>
    </form>
  );
};

export default ClaimForm;