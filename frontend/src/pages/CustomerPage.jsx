import "./CustomerPage.css";

import { FaSearch, FaUsers, FaEdit, FaTrash } from "react-icons/fa";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomerForm from "../components/customer/CustomerForm";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from "../services/customerService";

function CustomerPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; //newly added

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
      toast.error(
        error.response?.data?.message || "Failed to fetch customers."
      );
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

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchCustomers();
      }

      toast.success("Customer added successfully!");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to add customer.");

      throw error;
    }
  };

  const handleUpdateCustomer = async (customerData) => {
    try {
      await updateCustomer(selectedCustomer.id, customerData);

      await fetchCustomers();

      setSelectedCustomer(null);
      setIsEditing(false);

      toast.success("Customer updated successfully!");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to update customer."
      );

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

      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Something went wrong while deleting the customer.";

      toast.error(message);
    }
  };

  return (
    <div className="customer-page">
      <div className="customer-page-header">
        <div>
          <p className="customer-page-eyebrow">Customer Records</p>

          <h1>Customer Management</h1>

          <p className="customer-page-subtitle">
            Add, update, search and manage registered customers.
          </p>
        </div>

        <div className="customer-count-card">
          <div className="customer-count-icon">
            <FaUsers />
          </div>

          <div>
            <small>Total Customers</small>

            <h3>{pagination.totalRecords}</h3>
          </div>
        </div>
      </div>

      {role === "admin" && (
        <section className="customer-section-card">
          <CustomerForm
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            selectedCustomer={selectedCustomer}
            isEditing={isEditing}
          />
        </section>
      )}

      <section className="customer-section-card customer-list-section">
        <div className="customer-toolbar">
          <div className="customer-search-wrapper">
            <FaSearch className="customer-search-icon" />

            <input
              type="search"
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone..."
              aria-label="Search customers"
            />
          </div>

          <div className="customer-limit-wrapper">
            <label htmlFor="customer-limit">Records per page</label>

            <select
              id="customer-limit"
              className="form-select"
              value={limit}
              onChange={handleLimitChange}
              disabled={loading}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {loading ? (
          <div className="customer-loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading customers...</span>
            </div>

            <p>Loading customers...</p>
          </div>
        ) : (
          <div className="table-responsive mt-4">
            <table className="table customer-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <span className="customer-id">#{customer.id}</span>
                      </td>

                      <td>
                        <div className="customer-name-cell">
                          <div className="customer-avatar">
                            {customer.full_name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{customer.full_name}</span>
                        </div>
                      </td>

                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.address || "-"}</td>

                      <td>
                        {role === "admin" ? (
                          <div className="customer-actions">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(customer)}
                              disabled={loading}
                            >
                              <FaEdit />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(customer.id)}
                              disabled={loading}
                            >
                              <FaTrash />
                              <span>Delete</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">View only</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="customer-empty-state">
                      {search
                        ? "No customers match your search."
                        : "No customers found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.totalRecords > 0 && (
          <div className="customer-pagination">
            <p>
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="customer-pagination-buttons">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Previous
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleNextPage}
                disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default CustomerPage;
