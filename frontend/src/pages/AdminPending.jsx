import { useEffect, useState } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";
import "./AdminPending.css";

function AdminPending() {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      // Only pending documents
      const res = await API.get("/docs/pending");
      setDocs(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load pending documents");
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/docs/status/${id}`, { status });
      fetchDocs(); // auto remove from pending
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <div className="page-center">
      <BackButton />

      <div className="admin-container">
        <h2>Pending Document Verification</h2>

        {docs.length === 0 && (
          <p style={{ marginTop: 20 }}>🎉 No pending documents</p>
        )}

        {docs.map((d) => (
          <div key={d._id} className="doc-card">
            <p>
              <b>User:</b> {d.userId?.name} ({d.userId?.email})
            </p>

            <p>
              <b>Document:</b> {d.docType}
            </p>

            <a
              href={`http://localhost:5000/${d.filePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View Document
            </a>

            <div className="btn-group">
              <button
                className="approve"
                onClick={() => updateStatus(d._id, "approved")}
              >
                ✅ Approve
              </button>

              <button
                className="reject"
                onClick={() => updateStatus(d._id, "rejected")}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPending;
