import { useEffect, useState } from "react";
import CustomerForm from "../components/customer/CustomerForm";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from "../services/customerService";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Search states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 5
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getCustomers(debouncedSearch, page, limit);

      setCustomers(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch customers:", error);

      setCustomers([]);
      setError(error.response?.data?.message || "Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch, page, limit]);

  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value);

    setLimit(newLimit);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((previousPage) => previousPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage((previousPage) => previousPage + 1);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsEditing(true);
  };

  const handleAddCustomer = async (customerData) => {
    try {
      await addCustomer(customerData);

      setPage(1);
      await fetchCustomers();

      alert("Customer added successfully!");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to add customer.");

      throw error;
    }
  };

  const handleUpdateCustomer = async (customerData) => {
    try {
      await updateCustomer(selectedCustomer.id, customerData);

      await fetchCustomers();

      setSelectedCustomer(null);
      setIsEditing(false);

      alert("Customer updated successfully!");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to update customer.");

      throw error;
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCustomer(id);

      /*
       If the final record on the current page is deleted,
       move to the previous page.
      */
      if (customers.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchCustomers();
      }

      alert("Customer deleted successfully!");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Something went wrong while deleting the customer.";

      window.alert(message);
    }
  };

  return (
    <div>
      <h1>Insurance Management System</h1>

      <hr />

      <h2>Customer Management</h2>

      <CustomerForm
        onAddCustomer={handleAddCustomer}
        onUpdateCustomer={handleUpdateCustomer}
        selectedCustomer={selectedCustomer}
        isEditing={isEditing}
      />

      <hr />

      {/* Search section */}
      <div className="customer-search">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or phone..."
          aria-label="Search customers"
        />
      </div>

      <br />

      {/* Records-per-page selection */}
      <div>
        <label htmlFor="customer-limit">Records per page: </label>

        <select id="customer-limit" value={limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <p>Total customers: {pagination.totalRecords}</p>

      {error && <p>{error}</p>}

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.full_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>

                  <td>
                    <button onClick={() => handleEdit(customer)}>Edit</button>

                    <button onClick={() => handleDelete(customer.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {!loading && pagination.totalRecords > 0 && (
        <div>
          <button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </button>

          <span>
            {" "}
            Page {pagination.currentPage} of {pagination.totalPages}{" "}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomerPage;
