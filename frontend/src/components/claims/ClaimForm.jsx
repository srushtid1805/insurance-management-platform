import { useEffect, useState } from "react";

const initialFormData = {
  user_policy_id: "",
  claim_amount: "",
  claim_reason: "",
  claim_date: "",
  claim_status: ""
};

const ClaimForm = ({
  onSubmit,
  selectedClaim,
  isEditing,
  userPolicies = []
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
        claim_status: selectedClaim.claim_status || ""
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedClaim]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Number(formData.claim_amount) <= 0) {
      return;
    }

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
    <form className="claim-form" onSubmit={handleSubmit}>
      <div className="claim-form-header">
        <p className="claim-form-eyebrow">
          {isEditing ? "Update Record" : "New Claim"}
        </p>

        <h3>{isEditing ? "Update Claim" : "Add Claim"}</h3>

        <p>
          {isEditing
            ? "Update the selected claim information."
            : "Create a new insurance claim for an assigned policy."}
        </p>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="user_policy_id" className="form-label">
            Customer and Policy
          </label>

          <select
            id="user_policy_id"
            name="user_policy_id"
            className="form-select"
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
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="claim_amount" className="form-label">
            Claim Amount
          </label>

          <input
            id="claim_amount"
            type="number"
            name="claim_amount"
            className="form-control"
            placeholder="Enter claim amount"
            value={formData.claim_amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="claim_date" className="form-label">
            Claim Date
          </label>

          <input
            id="claim_date"
            type="date"
            name="claim_date"
            className="form-control"
            value={formData.claim_date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="claim_status" className="form-label">
            Claim Status
          </label>

          <select
            id="claim_status"
            name="claim_status"
            className="form-select"
            value={formData.claim_status}
            onChange={handleChange}
            required
          >
            <option value="">Select Claim Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="col-12">
          <label htmlFor="claim_reason" className="form-label">
            Claim Reason
          </label>

          <textarea
            id="claim_reason"
            name="claim_reason"
            className="form-control"
            placeholder="Enter claim reason"
            value={formData.claim_reason}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
      </div>

      <div className="claim-form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Claim" : "Add Claim"}
        </button>
      </div>
    </form>
  );
};

export default ClaimForm;
