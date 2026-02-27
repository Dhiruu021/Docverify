import { useEffect, useState } from "react";
import API from "../services/api";
import exportPDF from "../utils/exportPDF";
import "./AdminHistory.css";

function AdminHistory() {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/docs/history");
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteOne = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    await API.delete(`/docs/delete/${id}`);
    fetchHistory();
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return alert("No documents selected");
    if (!window.confirm("Delete selected documents?")) return;

    await API.post("/docs/delete-multiple", { ids: selected });
    setSelected([]);
    fetchHistory();
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <h1 className="page-title">Verified Documents History</h1>

        <div className="toolbar">
          {docs.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => exportPDF("Verified Documents Report", docs)}
            >
              Download PDF
            </button>
          )}

          {selected.length > 0 && (
            <button className="btn btn-danger" onClick={deleteSelected}>
              Delete Selected ({selected.length})
            </button>
          )}
        </div>

        <div className="documents-list">
          {docs.map((d) => (
            <div key={d._id} className="history-card">
              <div className="card-header">
                <input
                  type="checkbox"
                  checked={selected.includes(d._id)}
                  onChange={() => toggleSelect(d._id)}
                  className="checkbox"
                />
                <span className={`status-badge ${d.status}`}>
                  {d.status === "approved" ? "Approved" : "Rejected"}
                </span>
              </div>

              <div className="card-body">
                <p><span>User:</span> {d.userId?.name}</p>
                <p><span>Document:</span> {d.docType}</p>
              </div>

              <div className="card-actions">
                <a
                  href={`http://localhost:5000/${d.filePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="link-view"
                >
                  View Document
                </a>
                <button
                  className="btn-delete"
                  onClick={() => deleteOne(d._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {docs.length === 0 && (
          <div className="empty-state">
            <p>No documents in history</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHistory;
