import { useEffect, useState } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";
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
    <div className="page-center">
      <BackButton />

      <div className="status-box">
        {/* Header + PDF Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h2>My Documents Status</h2>

          {docs.length > 0 && (
            <button
              onClick={() => exportPDF("My Document Report", docs)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              📄 Download PDF
            </button>
          )}
        </div>

        {docs.length === 0 && <p>No documents uploaded yet.</p>}

        {docs.map((d) => (
          <div key={d._id} className="status-card">
            <p>
              <b>Type:</b> {d.docType}
            </p>

            <p>
              <b>Status:</b>{" "}
              <span className={`status ${d.status}`}>
                {d.status.toUpperCase()}
              </span>
            </p>

            <a
              href={`http://localhost:5000/${d.filePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View Document
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyStatus;
