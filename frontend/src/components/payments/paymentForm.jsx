import { useEffect, useState } from "react";

const initialFormData = {
  user_policy_id: "",
  amount: "",
  payment_date: "",
  due_date: "",
  payment_method: "",
  payment_status: "",
};

const PaymentForm = ({
  onSubmit,
  selectedPayment,
  isEditing,
  userPolicies = [],
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
        payment_status: selectedPayment.payment_status || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedPayment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      <h2>{isEditing ? "Update Payment" : "Add Payment"}</h2>

      <select
        name="user_policy_id"
        value={formData.user_policy_id}
        onChange={handleChange}
        required
      >
        <option value="">Select Customer and Policy</option>

        {(userPolicies || []).map((item) => (
          <option key={item.id} value={item.id}>
            {item.customer_name} - {item.policy_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <label>Payment Date</label>

      <input
        type="date"
        name="payment_date"
        value={formData.payment_date}
        onChange={handleChange}
        required
      />

      <label>Due Date</label>

      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        required
      />

      <select
        name="payment_method"
        value={formData.payment_method}
        onChange={handleChange}
        required
      >
        <option value="">Select Payment Method</option>
        <option value="UPI">UPI</option>
        <option value="Card">Card</option>
        <option value="Cash">Cash</option>
        <option value="Net Banking">Net Banking</option>
      </select>

      <select
        name="payment_status"
        value={formData.payment_status}
        onChange={handleChange}
        required
      >
        <option value="">Select Payment Status</option>
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
        <option value="Failed">Failed</option>
      </select>

      <button type="submit">
        {isEditing ? "Update Payment" : "Add Payment"}
      </button>
    </form>
  );
};

export default PaymentForm;