import { useEffect, useState } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";
import exportPDF from "../utils/exportPDF";

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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <BackButton />

        <h2 style={styles.title}>Verified Documents History</h2>

        {/* 📄 PDF */}
        {docs.length > 0 && (
          <button
            onClick={() => exportPDF("Verified Documents Report", docs)}
            style={styles.pdfBtn}
          >
            📄 Download PDF
          </button>
        )}

        {/* 🗑 Bulk Delete */}
        {selected.length > 0 && (
          <button onClick={deleteSelected} style={styles.bulkDelete}>
            🗑 Delete Selected ({selected.length})
          </button>
        )}

        {docs.map((d) => (
          <div key={d._id} style={styles.section}>
            <input
              type="checkbox"
              checked={selected.includes(d._id)}
              onChange={() => toggleSelect(d._id)}
              style={{ marginRight: "8px" }}
            />

            <p><b>User:</b> {d.userId?.name}</p>
            <p><b>Doc:</b> {d.docType}</p>
            <p>
              <b>Status:</b>{" "}
              {d.status === "approved" ? "Approved" : "Rejected"}
            </p>

            <div style={{ marginTop: "6px" }}>
              <a
                href={`http://localhost:5000/${d.filePath}`}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>

              <button
                onClick={() => deleteOne(d._id)}
                style={styles.deleteBtn}
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔥 SAME CSS AS Help.jsx */
const styles = {
  wrapper: {
    width: "100vw",
    minHeight: "calc(100vh - 60px)", // navbar height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    background: "#f5f7fb",
    padding: "30px 40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "360px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  section: {
    background: "#ffffff",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "14px",
    border: "1px solid #e5e7eb",
    textAlign: "left",
    fontSize: "13px",
  },

  pdfBtn: {
    display: "block",
    marginLeft: "auto",
    marginBottom: "12px",
    padding: "6px 12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  bulkDelete: {
    marginBottom: "14px",
    padding: "6px 12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    marginLeft: "10px",
    padding: "4px 10px",
    background: "#1f2933",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default AdminHistory;
