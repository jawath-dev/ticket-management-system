import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../api/client";

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiGet("/customers").then((res) => setCustomers(res.data));
    apiGet("/categories").then((res) => setCategories(res.data));

    apiGet(`/tickets/${id}`).then((res) => {
      const ticket = res.data;
      setSubject(ticket.subject);
      setDescription(ticket.description);
      setCustomerId(ticket.customer_id);
      setCategoryId(ticket.category_id);
      setPriority(ticket.priority);
      setLoading(false);
    });
  }, [id]);

  function validate() {
    const newErrors = {};
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!customerId) newErrors.customerId = "Customer is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const res = await apiPut(`/tickets/${id}`, {
      subject,
      description,
      customerId: Number(customerId),
      categoryId: Number(categoryId),
      priority,
    });

    setSubmitting(false);

    if (res.success) {
      navigate(`/tickets/${id}`);
    } else {
      setErrors({ form: res.message });
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Ticket #{id}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-6 space-y-4"
      >
        {errors.form && <p className="text-red-600 text-sm">{errors.form}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 w-full"
          />
          {errors.subject && (
            <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 w-full"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 w-full"
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-600 text-sm mt-1">{errors.customerId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 w-full"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 w-full"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/tickets/${id}`)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTicket;
