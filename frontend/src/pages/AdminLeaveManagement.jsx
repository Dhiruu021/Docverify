import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminLeaveManagement.css";

function AdminLeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leaves/all");
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/leaves/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchStats();
  }, []);

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await API.put(`/leaves/status/${id}`, { status: "approved" });
      fetchLeaves();
      fetchStats();
    } catch (err) {
      alert("Failed to approve leave");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLeave) return;
    setLoading(true);
    try {
      await API.put(`/leaves/status/${selectedLeave._id}`, {
        status: "rejected",
        rejectionReason,
      });
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedLeave(null);
      fetchLeaves();
      fetchStats();
    } catch (err) {
      alert("Failed to reject leave");
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (leave) => {
    setSelectedLeave(leave);
    setShowRejectModal(true);
  };

  const filteredLeaves = leaves.filter((l) =>
    filter === "all" ? true : l.status === filter
  );

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "pending", text: "Pending" },
      approved: { class: "approved", text: "Approved" },
      rejected: { class: "rejected", text: "Rejected" },
    };
    return badges[status] || badges.pending;
  };

  const getLeaveTypeLabel = (type) => {
    const types = {
      sick: "Sick Leave",
      casual: "Casual Leave",
      emergency: "Emergency Leave",
      other: "Other",
    };
    return types[type] || type;
  };

  return (
    <div className="admin-leave-page">
      <div className="admin-leave-container">
        <header className="admin-leave-header">
          <div>
            <h1>Leave Management</h1>
            <p>Review and manage employee leave requests</p>
          </div>
        </header>

        <div className="leave-stats-row">
          <div className="leave-stat-card pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
          <div className="leave-stat-card approved">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{stats.approved}</span>
          </div>
          <div className="leave-stat-card rejected">
            <span className="stat-label">Rejected</span>
            <span className="stat-value">{stats.rejected}</span>
          </div>
          <div className="leave-stat-card total">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.pending + stats.approved + stats.rejected}</span>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={filter === "approved" ? "active" : ""}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={filter === "rejected" ? "active" : ""}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>

        <div className="leaves-table-container">
          {filteredLeaves.length === 0 ? (
            <div className="empty-state">
              <p>No {filter !== "all" ? filter : ""} leave requests found</p>
            </div>
          ) : (
            <table className="leaves-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => {
                  const badge = getStatusBadge(leave.status);
                  return (
                    <tr key={leave._id}>
                      <td>
                        <div className="employee-info">
                          <div className="employee-avatar">
                            {leave.userName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="employee-name">{leave.userName}</div>
                            <div className="employee-email">{leave.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>{getLeaveTypeLabel(leave.leaveType)}</td>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td className="reason-cell">{leave.reason}</td>
                      <td>
                        <span className={`status-badge ${badge.class}`}>{badge.text}</span>
                      </td>
                      <td>
                        {leave.status === "pending" && (
                          <div className="action-btns">
                            <button
                              className="btn-approve"
                              onClick={() => handleApprove(leave._id)}
                              disabled={loading}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => openRejectModal(leave)}
                              disabled={loading}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Leave Request</h2>
              <button className="btn-close" onClick={() => setShowRejectModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Please provide a reason for rejecting this leave request:</p>
              <textarea
                rows="3"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
              <button
                className="btn-reject"
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
              >
                Reject Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLeaveManagement;
