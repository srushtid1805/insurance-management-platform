import { useEffect, useState } from "react";

const initialFormData = {
  user_policy_id: "",
  amount: "",
  payment_date: "",
  due_date: "",
  payment_method: "",
  payment_status: ""
};

const PaymentForm = ({
  onSubmit,
  selectedPayment,
  isEditing,
  userPolicies = []
}) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedPayment) {
      setFormData({
        user_policy_id: selectedPayment.user_policy_id || "",
        amount: selectedPayment.amount || "",
        payment_date: selectedPayment.payment_date
          ? selectedPayment.payment_date.split("T")[0]
          : "",
        due_date: selectedPayment.due_date
          ? selectedPayment.due_date.split("T")[0]
          : "",
        payment_method: selectedPayment.payment_method || "",
        payment_status: selectedPayment.payment_status || ""
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedPayment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.amount) <= 0) {
      return;
    }

    if (
      formData.payment_date &&
      formData.due_date &&
      formData.due_date < formData.payment_date
    ) {
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
  <form className="payment-form" onSubmit={handleSubmit}>
    <div className="payment-form-header">
      <p className="payment-form-eyebrow">
        {isEditing ? "Update Record" : "New Payment"}
      </p>

      <h3>
        {isEditing ? "Update Payment" : "Add Payment"}
      </h3>

      <p>
        {isEditing
          ? "Update the selected payment information."
          : "Record a payment for an assigned customer policy."}
      </p>
    </div>

    <div className="row g-3">
      <div className="col-12">
        <label
          htmlFor="user_policy_id"
          className="form-label"
        >
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
          <option value="">
            Select Customer and Policy
          </option>

          {userPolicies.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.customer_name} - {item.policy_name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="amount"
          className="form-label"
        >
          Amount
        </label>

        <input
          id="amount"
          type="number"
          name="amount"
          className="form-control"
          placeholder="Enter payment amount"
          value={formData.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="payment_method"
          className="form-label"
        >
          Payment Method
        </label>

        <select
          id="payment_method"
          name="payment_method"
          className="form-select"
          value={formData.payment_method}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Payment Method
          </option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
          <option value="Net Banking">
            Net Banking
          </option>
        </select>
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="payment_date"
          className="form-label"
        >
          Payment Date
        </label>

        <input
          id="payment_date"
          type="date"
          name="payment_date"
          className="form-control"
          value={formData.payment_date}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="due_date"
          className="form-label"
        >
          Due Date
        </label>

        <input
          id="due_date"
          type="date"
          name="due_date"
          className="form-control"
          value={formData.due_date}
          onChange={handleChange}
          min={formData.payment_date}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label
          htmlFor="payment_status"
          className="form-label"
        >
          Payment Status
        </label>

        <select
          id="payment_status"
          name="payment_status"
          className="form-select"
          value={formData.payment_status}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Payment Status
          </option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
    </div>

    <div className="payment-form-actions">
      <button
        type="submit"
        className="btn btn-primary"
      >
        {isEditing ? "Update Payment" : "Add Payment"}
      </button>
    </div>
  </form>
);
};

export default PaymentForm;
