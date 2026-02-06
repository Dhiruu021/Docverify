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

  // ADS STATE
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);

  /* ================= LOAD STATS ================= */
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

  /* ================= LOAD AI SETTINGS ================= */
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

  /* ================= LOAD ADS ================= */
  useEffect(() => {
    const loadAds = async () => {
      try {
        const res = await API.get("/ads");
        setAds(res.data);
      } catch (err) {
        console.error("Ads load failed", err);
      }
    };
    loadAds();
  }, []);

  /* ================= ADD AD ================= */
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
      const res = await API.get("/ads");
      setAds(res.data);
      alert("Ad added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add ad");
    }
  };

  /* ================= TOGGLE AD ================= */
  const toggleAd = async (id) => {
    try {
      await API.put(`/ads/toggle/${id}`);
      const res = await API.get("/ads");
      setAds(res.data);
    } catch (err) {
      console.error("Toggle ad failed", err);
    }
  };

  /* ================= DELETE AD ================= */
  const deleteAd = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await API.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (err) {
      console.error("Delete ad failed", err);
    }
  };

  /* ================= TOGGLE AI ================= */
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
    <div className="page-center">
      <div className="dashboard-container">
        <h2>Dashboard</h2>

        {/* ================= AI TOGGLE ================= */}
        <div className="ai-toggle" style={{ marginBottom: "20px" }}>
          <span>
            AI Verification :
            <b style={{ marginLeft: "8px", color: aiMode ? "green" : "red" }}>
              {aiMode ? "ON" : "OFF"}
            </b>
          </span>

          <button
            onClick={toggleAI}
            disabled={loadingAI}
            style={{ marginLeft: "15px" }}
          >
            {loadingAI
              ? "Updating..."
              : aiMode
              ? "Disable AI"
              : "Enable AI"}
          </button>
        </div>

        {/* ================= STATS CHART ================= */}
        <div style={{ marginBottom: "40px" }}>
          <AdminStatsChart stats={stats} />
        </div>

        {/* ================= MANAGE ADS ================= */}
        <div className="ads-wrapper">
          <h3>Manage Ads</h3>

          {/* Add Ad Form */}
          <form onSubmit={addAd} style={{ marginBottom: "20px" }}>
            <input
              placeholder="Ad Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <input
              placeholder="Ad Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ marginBottom: "10px" }}
            />

            <button type="submit">➕ Add Ad</button>
          </form>

          {ads.length === 0 && <p>No ads available</p>}

          <div className="ads-grid">
            {ads.map((ad) => (
              <div key={ad._id} className="ad-card">
                <b>{ad.title}</b>
                <p>Status: {ad.active ? "ACTIVE" : "INACTIVE"}</p>

                {ad.image && (
                  <img
                    src={`http://localhost:5000/${ad.image}`}
                    alt="ad"
                  />
                )}

                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => toggleAd(ad._id)}>
                    {ad.active ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => deleteAd(ad._id)}
                    style={{ marginLeft: "10px", color: "red" }}
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
