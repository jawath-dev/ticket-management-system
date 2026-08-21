import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../api/client";

const allowedTransitions = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_CUSTOMER", "RESOLVED"],
  WAITING_FOR_CUSTOMER: ["IN_PROGRESS"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
};

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentUser, setCommentUser] = useState("");
  const [loading, setLoading] = useState(true);

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    loadTicket();
    loadComments();
    loadHistory();
    apiGet("/users").then((res) => setAgents(res.data));
  }, [id]);

  function loadTicket() {
    apiGet(`/tickets/${id}`).then((res) => {
      setTicket(res.data);
      setSelectedAgent(res.data.agent_id || "");
      setSelectedStatus("");
      setLoading(false);
    });
  }

  function loadComments() {
    apiGet(`/tickets/${id}/comments`).then((res) => {
      setComments(res.data);
    });
  }

  function loadHistory() {
    apiGet(`/tickets/${id}/history`).then((res) => {
      setStatusHistory(res.data);
    });
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !commentUser) return;

    await apiPost(`/tickets/${id}/comments`, {
      userId: Number(commentUser),
      comment: newComment,
    });
    setNewComment("");
    loadComments();
  }

  async function handleAssign() {
    setAssigning(true);
    await apiPut(`/tickets/${id}/assignment`, {
      agentId: selectedAgent ? Number(selectedAgent) : null,
    });
    await loadTicket();
    setAssigning(false);
  }

  async function handleStatusUpdate() {
    if (!selectedStatus) return;

    setUpdatingStatus(true);
    setStatusError("");

    const res = await apiPut(`/tickets/${id}/status`, {
      status: selectedStatus,
    });

    if (!res.success) {
      setStatusError(res.message);
    } else {
      await loadTicket();
      loadHistory();
    }

    setUpdatingStatus(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/api/tickets/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      navigate("/tickets");
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!ticket) {
    return <div className="p-6">Ticket not found</div>;
  }

  const isOverdue =
    new Date(ticket.due_date) < new Date() &&
    ticket.status !== "RESOLVED" &&
    ticket.status !== "CLOSED";

  const isClosingSoon =
    !isOverdue &&
    ticket.status !== "RESOLVED" &&
    ticket.status !== "CLOSED" &&
    new Date(ticket.due_date) - new Date() < 2 * 60 * 60 * 1000;

  const nextStatuses = allowedTransitions[ticket.status] || [];

  return (
    <div className="p-6">
      <Link to="/tickets" className="text-blue-600">
        &larr; Back to Tickets
      </Link>

      <div className="bg-white rounded shadow p-6 mt-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">
            #{ticket.id} - {ticket.subject}
          </h1>
          <div className="flex gap-2">
            {ticket.status === "CLOSED" ? (
              <span
                className="bg-gray-100 text-gray-400 px-3 py-1 rounded cursor-not-allowed"
                title="Closed tickets cannot be edited"
              >
                Edit
              </span>
            ) : (
              <Link
                to={`/tickets/${ticket.id}/edit`}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
              >
                Edit
              </Link>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {isOverdue && (
          <p className="text-red-600 font-semibold mt-2">⚠ Overdue</p>
        )}
        {isClosingSoon && (
          <p className="text-amber-600 font-semibold mt-2">
            ⏰ SLA closing soon
          </p>
        )}

        <p className="mt-3 text-gray-700">{ticket.description}</p>

        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <p className="text-gray-500">Customer</p>
            <p>{ticket.customer_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Agent</p>
            {ticket.status === "CLOSED" ? (
              <p className="mt-1">{ticket.agent_name || "Unassigned"}</p>
            ) : (
              <div className="flex gap-2 items-center mt-1">
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-2 py-1 text-sm"
                >
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={assigning}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm transition-colors disabled:opacity-50"
                >
                  {assigning ? "..." : "Assign"}
                </button>
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-500">Category</p>
            <p>{ticket.category_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Priority</p>
            <p>{ticket.priority}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="mb-1">{ticket.status}</p>
            {nextStatuses.length > 0 ? (
              <div className="flex gap-2 items-center">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-2 py-1 text-sm"
                >
                  <option value="">Change to...</option>
                  {nextStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || !selectedStatus}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? "..." : "Update"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                No further changes allowed
              </p>
            )}
            {statusError && (
              <p className="text-red-600 text-xs mt-1">{statusError}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Created Date</p>
            <p>{new Date(ticket.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Due Date</p>
            <p>{new Date(ticket.due_date).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Updated Date</p>
            <p>{new Date(ticket.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6 mt-4">
        <h2 className="font-semibold mb-3">Comments</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="border-b border-gray-200 pb-2">
                <p className="text-sm font-semibold">{c.user_name}</p>
                <p className="text-sm">{c.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
          <select
            value={commentUser}
            onChange={(e) => setCommentUser(e.target.value)}
            className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-2 py-2 text-sm"
          >
            <option value="">Post as...</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 px-3 py-2 flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Post
          </button>
        </form>
      </div>

      <div className="bg-white rounded shadow p-6 mt-4">
        <h2 className="font-semibold mb-3">Status History</h2>

        {statusHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No status changes yet</p>
        ) : (
          <div className="space-y-2">
            {statusHistory.map((h) => (
              <div key={h.id} className="text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">
                  {h.old_status || "Created"}
                </span>
                {" → "}
                <span className="font-medium">{h.new_status}</span>
                <span className="text-gray-400 text-xs ml-2">
                  {new Date(h.changed_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetails;
