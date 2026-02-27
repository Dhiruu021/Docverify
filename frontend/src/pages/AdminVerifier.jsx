import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminVerifier.css";

function AdminPending() {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await API.get("/docs/pending");
      setDocs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load pending documents");
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/docs/status/${id}`, { status });
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="verifier-page">
      <div className="verifier-container">
        <header className="verifier-header">
          <div className="header-content">
            <h1>Document Verification</h1>
            <p>Review and approve pending document submissions</p>
          </div>
          <button className="btn-refresh" onClick={fetchDocs}>
            <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            Refresh
          </button>
        </header>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon pending">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{docs.length}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon status">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{docs.length === 0 ? "Clear" : "Action"}</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>

        {docs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <h3>All Documents Verified!</h3>
            <p>No pending verification requests at the moment.</p>
          </div>
        )}

        <div className="documents-list">
          {docs.map((d) => (
            <div key={d._id} className="document-card">
              <div className="document-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {d.userId?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="user-details">
                    <h4>{d.userId?.name}</h4>
                    <span className="user-email">{d.userId?.email}</span>
                  </div>
                </div>
                <span className="doc-badge">{d.docType}</span>
              </div>

              <div className="document-preview">
                <a
                  href={d.cloudinaryUrl || d.filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="view-link"
                >
                  <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  View Document
                </a>
              </div>

              <div className="action-buttons">
                <button
                  className="btn-approve"
                  onClick={() => updateStatus(d._id, "approved")}
                >
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => updateStatus(d._id, "rejected")}
                >
                  <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPending;
