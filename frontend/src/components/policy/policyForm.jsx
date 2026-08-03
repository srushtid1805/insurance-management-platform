import { useEffect, useState } from "react";

function PolicyForm({
  onAddPolicy,
  onUpdatePolicy,
  selectedPolicy,
  isEditing,
  onCancelEdit
}) {
  const initialFormData = {
    policy_name: "",
    policy_type: "",
    premium_amount: "",
    coverage_amount: "",
    duration_months: "",
    description: "",
    status: "Active"
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedPolicy) {
      setFormData({
        policy_name: selectedPolicy.policy_name || "",
        policy_type: selectedPolicy.policy_type || "",
        premium_amount: selectedPolicy.premium_amount || "",
        coverage_amount: selectedPolicy.coverage_amount || "",
        duration_months: selectedPolicy.duration_months || "",
        description: selectedPolicy.description || "",
        status: selectedPolicy.status || "Active"
      });
    }
  }, [selectedPolicy]);

  useEffect(() => {
    if (!isEditing) {
      setFormData(initialFormData);
    }
  }, [isEditing]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isSuccessful;

    if (isEditing) {
      isSuccessful = await onUpdatePolicy(formData);
    } else {
      isSuccessful = await onAddPolicy(formData);
    }

    if (isSuccessful) {
      resetForm();
    }
  };

return (
  <form className="policy-form" onSubmit={handleSubmit}>
    <div className="policy-form-header">
      <div>
        <p className="policy-form-eyebrow">
          {isEditing ? "Update Record" : "New Policy"}
        </p>

        <h3>
          {isEditing ? "Edit Policy" : "Add Policy"}
        </h3>

        <p>
          {isEditing
            ? "Update the selected policy details."
            : "Enter the policy information below to create a new record."}
        </p>
      </div>
    </div>

    <div className="row g-3">
      <div className="col-12 col-md-6">
        <label
          htmlFor="policy_name"
          className="form-label"
        >
          Policy Name
        </label>

        <input
          id="policy_name"
          type="text"
          name="policy_name"
          className="form-control"
          placeholder="Enter policy name"
          value={formData.policy_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="policy_type"
          className="form-label"
        >
          Policy Type
        </label>

        <input
          id="policy_type"
          type="text"
          name="policy_type"
          className="form-control"
          placeholder="e.g. Health, Vehicle, Life"
          value={formData.policy_type}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="premium_amount"
          className="form-label"
        >
          Premium Amount
        </label>

        <input
          id="premium_amount"
          type="number"
          name="premium_amount"
          className="form-control"
          placeholder="Enter premium amount"
          value={formData.premium_amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="coverage_amount"
          className="form-label"
        >
          Coverage Amount
        </label>

        <input
          id="coverage_amount"
          type="number"
          name="coverage_amount"
          className="form-control"
          placeholder="Enter coverage amount"
          value={formData.coverage_amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="duration_months"
          className="form-label"
        >
          Duration
        </label>

        <input
          id="duration_months"
          type="number"
          name="duration_months"
          className="form-control"
          placeholder="Duration in months"
          value={formData.duration_months}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="status"
          className="form-label"
        >
          Status
        </label>

        <select
          id="status"
          name="status"
          className="form-select"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="col-12">
        <label
          htmlFor="description"
          className="form-label"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          className="form-control"
          placeholder="Enter policy description..."
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>
    </div>

    <div className="policy-form-actions">
      <button
        type="submit"
        className="btn btn-primary"
      >
        {isEditing ? "Update Policy" : "Save Policy"}
      </button>

      {isEditing && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            resetForm();
            onCancelEdit();
          }}
        >
          Cancel
        </button>
      )}
    </div>
  </form>
);
}

export default PolicyForm;
