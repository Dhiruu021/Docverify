import { useEffect, useState } from "react";
import API from "../services/api";
import "./Notices.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    targetAudience: "all",
    pinned: false,
  });
  const role = localStorage.getItem("role");
  const isAdmin = role === "superadmin" || role === "verifieradmin";

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await API.get("/notices");
      setNotices(res.data);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await API.put(`/notices/${editingNotice._id}`, formData);
      } else {
        await API.post("/notices", formData);
      }
      setShowForm(false);
      setEditingNotice(null);
      setFormData({
        title: "",
        content: "",
        category: "general",
        targetAudience: "all",
        pinned: false,
      });
      fetchNotices();
    } catch (err) {
      alert("Failed to save notice");
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      targetAudience: notice.targetAudience,
      pinned: notice.pinned,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await API.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      alert("Failed to delete notice");
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "#3b82f6",
      academic: "#8b5cf6",
      exam: "#f59e0b",
      event: "#10b981",
      urgent: "#ef4444",
    };
    return colors[category] || "#3b82f6";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <div className="notices-page"><p>Loading...</p></div>;

  return (
    <div className="notices-page">
      <div className="notices-container">
        <header className="notices-header">
          <div>
            <h1>📢 Notice Board</h1>
            <p>Stay updated with latest announcements</p>
          </div>
          {isAdmin && (
            <button className="btn-create" onClick={() => setShowForm(true)}>
              ➕ New Notice
            </button>
          )}
        </header>

        {showForm && (
          <div className="notice-modal">
            <div className="notice-form">
              <h3>{editingNotice ? "Edit Notice" : "Create Notice"}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Content"
                  rows="4"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
                <div className="form-row">
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="exam">Exam</option>
                    <option value="event">Event</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAudience: e.target.value })
                    }
                  >
                    <option value="all">All</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teachers Only</option>
                  </select>
                </div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.pinned}
                    onChange={(e) =>
                      setFormData({ ...formData, pinned: e.target.checked })
                    }
                  />
                  📌 Pin this notice
                </label>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    {editingNotice ? "Update" : "Post"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowForm(false);
                      setEditingNotice(null);
                      setFormData({
                        title: "",
                        content: "",
                        category: "general",
                        targetAudience: "all",
                        pinned: false,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {notices.length === 0 ? (
          <div className="no-notices">
            <p>No notices available</p>
          </div>
        ) : (
          <div className="notices-list">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className={`notice-card ${notice.pinned ? "pinned" : ""}`}
              >
                {notice.pinned && <span className="pin-badge">📌 Pinned</span>}
                <div className="notice-header">
                  <span
                    className="notice-category"
                    style={{ backgroundColor: getCategoryColor(notice.category) }}
                  >
                    {notice.category.toUpperCase()}
                  </span>
                  <span className="notice-date">{formatDate(notice.createdAt)}</span>
                </div>
                <h3 className="notice-title">{notice.title}</h3>
                <p className="notice-content">{notice.content}</p>
                <div className="notice-footer">
                  <span className="notice-author">Posted by: {notice.postedByName}</span>
                  {isAdmin && (
                    <div className="notice-actions">
                      <button className="btn-edit" onClick={() => handleEdit(notice)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(notice._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notices;
