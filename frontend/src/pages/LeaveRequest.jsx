import { useEffect, useState } from "react";
import API from "../services/api";
import "./LeaveRequest.css";

function LeaveRequest() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leaves/my");
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/leaves/apply", formData);
      alert("Leave applied successfully");
      setShowModal(false);
      setFormData({
        leaveType: "casual",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="leave-request-page">
      <div className="leave-container">
        <header className="leave-header">
          <div>
            <h1>My Leave Requests</h1>
            <p>Apply and track your leave applications</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Apply Leave
          </button>
        </header>

        <div className="leave-stats">
          <div className="leave-stat-card">
            <span className="stat-label">Total Applied</span>
            <span className="stat-value">{leaves.length}</span>
          </div>
          <div className="leave-stat-card pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{leaves.filter(l => l.status === "pending").length}</span>
          </div>
          <div className="leave-stat-card approved">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{leaves.filter(l => l.status === "approved").length}</span>
          </div>
          <div className="leave-stat-card rejected">
            <span className="stat-label">Rejected</span>
            <span className="stat-value">{leaves.filter(l => l.status === "rejected").length}</span>
          </div>
        </div>

        <div className="leaves-list">
          {leaves.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
              </div>
              <h3>No Leave Requests</h3>
              <p>You haven't applied for any leave yet.</p>
            </div>
          ) : (
            leaves.map((leave) => {
              const badge = getStatusBadge(leave.status);
              return (
                <div key={leave._id} className="leave-card">
                  <div className="leave-info">
                    <div className="leave-type">
                      <span className={`status-badge ${badge.class}`}>{badge.text}</span>
                      <h4>{getLeaveTypeLabel(leave.leaveType)}</h4>
                    </div>
                    <div className="leave-dates">
                      <div className="date-row">
                        <span className="date-label">From:</span>
                        <span className="date-value">{new Date(leave.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="date-row">
                        <span className="date-label">To:</span>
                        <span className="date-value">{new Date(leave.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="leave-reason">{leave.reason}</p>
                    {leave.status === "rejected" && leave.rejectionReason && (
                      <p className="rejection-reason">Reason: {leave.rejectionReason}</p>
                    )}
                  </div>
                  <div className="leave-meta">
                    <span className="applied-on">Applied: {new Date(leave.appliedOn).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for Leave</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  rows="3"
                  placeholder="Enter reason for leave..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequest;
