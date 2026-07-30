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
  // const [formData, setFormData] = useState({
  //     policy_name: "",
  //     policy_type: "",
  //     premium_amount: "",
  //     coverage_amount: "",
  //     duration_months: "",
  //     description: "",
  //     status: "Active",
  // });

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
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? "Edit Policy" : "Add Policy"}</h3>

      <input
        type="text"
        name="policy_name"
        placeholder="e.g. Health, Vehicle, Life"
        value={formData.policy_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="policy_type"
        placeholder="Policy Type"
        value={formData.policy_type}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="premium_amount"
        placeholder="Premium Amount"
        value={formData.premium_amount}
        onChange={handleChange}
        min="0"
        required
      />

      <input
        type="number"
        name="coverage_amount"
        placeholder="Coverage Amount"
        value={formData.coverage_amount}
        onChange={handleChange}
        min="0"
        required
      />

      <input
        type="number"
        name="duration_months"
        placeholder="Duration in Months"
        value={formData.duration_months}
        onChange={handleChange}
        min="1"
        required
      />

      <textarea
        name="description"
        placeholder="Enter policy description..."
        value={formData.description}
        onChange={handleChange}
        rows="3"
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <div>
        <button type="submit">
          {isEditing ? "Update Policy" : "Save Policy"}
        </button>

        {isEditing && (
          <button
            type="button"
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
