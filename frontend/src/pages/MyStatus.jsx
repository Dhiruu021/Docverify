import { useEffect, useState } from "react";
import API from "../services/api";
import exportPDF from "../utils/exportPDF";
import "./MyStatus.css";

function MyStatus() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await API.get(`/docs/my/${userId}`);
        setDocs(res.data);
      } catch (err) {
        alert("Failed to load documents");
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="status-page">
      <div className="status-container">
        <header className="status-header">
          <h1>My Documents Status</h1>
          {docs.length > 0 && (
            <button
              className="btn-download"
              onClick={() => exportPDF("My Document Report", docs)}
            >
              Download PDF
            </button>
          )}
        </header>

        {docs.length === 0 && (
          <div className="empty-state">
            <p>No documents uploaded yet.</p>
          </div>
        )}

        <div className="documents-grid">
          {docs.map((d) => (
            <div key={d._id} className="doc-status-card">
              <div className="doc-info">
                <p className="doc-type">
                  <span>Type:</span> {d.docType}
                </p>
                <p className="doc-status">
                  <span>Status:</span>
                  <span className={`status-badge ${d.status}`}>
                    {d.status}
                  </span>
                </p>
              </div>
              <a
                href={`http://localhost:5000/${d.filePath}`}
                target="_blank"
                rel="noreferrer"
                className="view-link"
              >
                View Document
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyStatus;
