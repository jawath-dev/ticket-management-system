import { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut } from "../api/client";

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  function loadCustomers() {
    apiGet("/customers").then((res) => {
      setCustomers(res.data);
      setLoading(false);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    setSubmitting(true);
    setError("");

    const res = await apiPost("/customers", { name, email, phone });

    setSubmitting(false);

    if (res.success) {
      setName("");
      setEmail("");
      setPhone("");
      loadCustomers();
    } else {
      setError(res.message);
    }
  }

  function startEdit(customer) {
    setEditingId(customer.id);
    setEditName(customer.name);
    setEditEmail(customer.email);
    setEditPhone(customer.phone || "");
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function handleUpdate(id) {
    if (!editName.trim() || !editEmail.trim()) {
      setEditError("Name and email are required");
      return;
    }

    const res = await apiPut(`/customers/${id}`, {
      name: editName,
      email: editEmail,
      phone: editPhone,
    });

    if (res.success) {
      setEditingId(null);
      loadCustomers();
    } else {
      setEditError(res.message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      loadCustomers();
    } else {
      alert(data.message);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Customers</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-6 mb-6 flex gap-3 items-end flex-wrap"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Customer"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) =>
              editingId === c.id ? (
                <tr key={c.id} className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleUpdate(c.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="border-b border-gray-200">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
      {editError && <p className="text-red-600 text-sm mt-2">{editError}</p>}
    </div>
  );
}

export default ManageCustomers;
