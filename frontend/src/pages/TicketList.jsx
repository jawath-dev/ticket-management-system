import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [agent, setAgent] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [categories, setCategories] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    apiGet("/categories").then((res) => setCategories(res.data));
    apiGet("/users").then((res) => setAgents(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", 10);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);
    if (category) params.append("category", category);
    if (agent) params.append("agent", agent);
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    apiGet(`/tickets?${params.toString()}`).then((res) => {
      setTickets(res.data);
      setPagination(res.pagination);
      setLoading(false);
    });
  }, [page, search, status, priority, category, agent, sortBy, sortOrder]);

  function handleSearchChange(e) {
    setPage(1);
    setSearch(e.target.value);
  }

  function handleStatusChange(e) {
    setPage(1);
    setStatus(e.target.value);
  }

  function handlePriorityChange(e) {
    setPage(1);
    setPriority(e.target.value);
  }

  function handleCategoryChange(e) {
    setPage(1);
    setCategory(e.target.value);
  }

  function handleAgentChange(e) {
    setPage(1);
    setAgent(e.target.value);
  }

  const fieldStyle =
    "border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Link
          to="/tickets/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + New Ticket
        </Link>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={handleSearchChange}
          className={`${fieldStyle} flex-1`}
        />

        <select
          value={status}
          onChange={handleStatusChange}
          className={fieldStyle}
        >
          <option value="">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select
          value={priority}
          onChange={handlePriorityChange}
          className={fieldStyle}
        >
          <option value="">All Priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>

        <select
          value={category}
          onChange={handleCategoryChange}
          className={fieldStyle}
        >
          <option value="">All Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={agent}
          onChange={handleAgentChange}
          className={fieldStyle}
        >
          <option value="">All Agent</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={fieldStyle}
        >
          <option value="createdAt">Sort: Created Date</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={fieldStyle}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Agent</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const isOverdue =
                new Date(ticket.due_date) < new Date() &&
                ticket.status !== "RESOLVED" &&
                ticket.status !== "CLOSED";

              return (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">
                    {ticket.id}
                    {isOverdue && (
                      <span className="text-red-600 ml-1" title="Overdue">
                        ⚠
                      </span>
                    )}
                  </td>
                  <td className="p-3">{ticket.subject}</td>
                  <td className="p-3">{ticket.priority}</td>
                  <td className="p-3">{ticket.status}</td>
                  <td className="p-3">{ticket.agent_name || "Unassigned"}</td>
                  <td className="p-3">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {pagination && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TicketList;
