import { useEffect, useState } from "react";
import API from "../services/api";
import AdminStatsChart from "../components/AdminStatsChart";
import "./AdminMainDashboard.css";

function AdminMainDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [aiMode, setAiMode] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Stats load failed", err);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await API.get("/settings");
        setAiMode(res.data.aiVerification);
      } catch (err) {
        console.error("Settings load failed", err);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const loadAds = async () => {
      try {
        const res = await API.get("/ads/all");
        setAds(res.data);
      } catch (err) {
        console.error("Ads load failed", err);
      }
    };
    loadAds();
  }, []);

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "Admin";
  const formattedName = `Mr. ${name}`;

  let welcomeMessage = "Admin Dashboard";
  let welcomeSubtext = "Manage system settings and monitor activities";
  
  if (role === "superadmin") {
    welcomeMessage = `Power of DocVerify`;
    welcomeSubtext = formattedName;
  } else if (role === "verifieradmin") {
    welcomeMessage = `Verification Officer Dashboard`;
    welcomeSubtext = formattedName;
  }

  const addAd = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (link) formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      await API.post("/ads", formData);
      setTitle("");
      setLink("");
      setImage(null);
      const res = await API.get("/ads/all");
      setAds(res.data);
      alert("Ad added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add ad");
    }
  };

  const toggleAd = async (id) => {
    try {
      await API.put(`/ads/toggle/${id}`);
      const res = await API.get("/ads/all");
      setAds(res.data);
    } catch (err) {
      console.error("Toggle ad failed", err);
    }
  };

  const deleteAd = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await API.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (err) {
      console.error("Delete ad failed", err);
    }
  };

  const toggleAI = async () => {
    try {
      setLoadingAI(true);
      const res = await API.put("/settings", {
        aiVerification: !aiMode,
      });
      setAiMode(res.data.aiVerification);
    } catch (err) {
      console.error("AI toggle failed", err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>{welcomeMessage}</h1>
            <p>{welcomeSubtext}</p>
          </div>
          <div className="ai-control">
            <div className="ai-status-badge">
              <span className="ai-dot"></span>
              <span className="ai-text">AI {aiMode ? "Active" : "Inactive"}</span>
            </div>
            <button
              className={`btn-ai-toggle ${aiMode ? "active" : ""}`}
              onClick={toggleAI}
              disabled={loadingAI}
            >
              {loadingAI ? (
                <span className="spinner-small"></span>
              ) : aiMode ? (
                <>
                  <svg viewBox="0 0 24 24"><path d="M13 7h-2v4L8.5 9.5 7 11l4.5 4.5L9 17h2v-4l2.5 1.5L15 13l-4.5-4.5L13 7z"/></svg>
                  Disable AI
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  Enable AI
                </>
              )}
            </button>
          </div>
        </header>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon pending">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.approved}</span>
              <span className="stat-label">Approved</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rejected">
              <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.pending + stats.approved + stats.rejected}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <AdminStatsChart stats={stats} />
        </div>

        <div className="card ads-section">
          <h3>Manage Ads</h3>

          <form onSubmit={addAd} className="ads-form">
            <input
              type="text"
              placeholder="Ad Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Ad Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit" className="btn btn-primary">
              Add Ad
            </button>
          </form>

          {ads.length === 0 && (
            <p className="empty-text">No ads available</p>
          )}

          <div className="ads-grid">
            {ads.map((ad) => (
              <div key={ad._id} className="ad-card">
                <h4>{ad.title}</h4>
                <div className="ad-status">
                  <span className="status-label">Status:</span>
                  <span className={ad.active ? "badge badge-on" : "badge badge-off"}>
                    {ad.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {ad.image && (
                  <img
                    src={ad.image.startsWith("http") ? ad.image : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/${ad.image}`}
                    alt={ad.title}
                  />
                )}
                <div className="ad-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => toggleAd(ad._id)}
                  >
                    {ad.active ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteAd(ad._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminMainDashboard;
