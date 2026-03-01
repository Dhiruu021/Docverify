import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./UserDashboard.css";

function UserDashboard() {
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) setUserName(`Mr. ${name}`);
  }, []);

  useEffect(() => {
    API.get("/ads")
      .then((res) => {
        const activeAds = res.data.filter((ad) => ad.active === true);
        setAds(activeAds);
      })
      .catch((err) => console.error("Ads fetch error:", err));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    
    API.get(`/docs/my/${userId}`)
      .then((res) => {
        const docs = res.data;
        setStats({
          total: docs.length,
          pending: docs.filter((d) => d.status === "pending").length,
          approved: docs.filter((d) => d.status === "approved").length,
          rejected: docs.filter((d) => d.status === "rejected").length,
        });
      })
      .catch((err) => console.error("Docs fetch error:", err));
  }, []);

  const quickActions = [
    {
      icon: "📤",
      title: "Upload Document",
      desc: "Submit new document for verification",
      action: () => navigate("/upload"),
      color: "blue",
    },
    {
      icon: "📋",
      title: "My Documents",
      desc: "View all your submitted documents",
      action: () => navigate("/status"),
      color: "green",
    },

    {
      icon: "👤",
      title: "Profile",
      desc: "Manage your account settings",
      action: () => navigate("/profile"),
      color: "purple",
    },
  ];

  const total = stats.pending + stats.approved + stats.rejected || 1;
  const getWidth = (value) => `${(value / total) * 100}%`;
  const getPercentage = (value) => Math.round((value / total) * 100);

  const chartData = [
    { label: "Pending", value: stats.pending, color: "#f59e0b", bgClass: "pending" },
    { label: "Approved", value: stats.approved, color: "#22c55e", bgClass: "approved" },
    { label: "Rejected", value: stats.rejected, color: "#ef4444", bgClass: "rejected" },
  ];

  return (
    <div className="user-dashboard">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome Back!</h1>
            <p className="user-name">{userName || "User"}</p>
            <p>Manage your documents and track verification status</p>
          </div>
        </header>

        <section className="stats-chart-section">
          <div className="chart-card">
            <h2>Document Status Overview</h2>
            <div className="chart-bars">
              {chartData.map((item) => (
                <div key={item.label} className="chart-item">
                  <div className="chart-header">
                    <span className="chart-label">{item.label}</span>
                    <span className="chart-value">
                      {item.value} <span className="chart-percent">({getPercentage(item.value)}%)</span>
                    </span>
                  </div>
                  <div className="chart-bar-bg">
                    <div
                      className={`chart-bar-fill ${item.bgClass}`}
                      style={{ width: getWidth(item.value) }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-total">
              <span>Total Documents:</span>
              <span className="total-number">{total}</span>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot pending"></span>
                <span>Pending - Documents awaiting verification</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot approved"></span>
                <span>Approved - Documents successfully verified</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot rejected"></span>
                <span>Rejected - Documents that failed verification</span>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`action-card ${action.color}`}
                onClick={action.action}
              >
                <span className="action-icon">{action.icon}</span>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.desc}</p>
                </div>
                <svg className="action-arrow" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            ))}
          </div>
        </section>

        {ads.length > 0 && (
          <section className="ads-section">
            <h2>Featured</h2>
            <div className="ads-grid">
              {ads.map((ad) => (
                <article
                  key={ad._id}
                  className="ad-card"
                  onClick={() => ad.link && window.open(ad.link, "_blank")}
                  style={{ cursor: ad.link ? "pointer" : "default" }}
                >
                  <div className="ad-image">
                    <img
                      src={ad.image.startsWith("http") ? ad.image : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/${ad.image}`}
                      alt={ad.title}
                    />
                    {ad.link && (
                      <div className="ad-overlay">
                        <span>Click to Visit</span>
                      </div>
                    )}
                  </div>
                  <div className="ad-content">
                    <h3>{ad.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
