import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import API from "../services/api";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);

  // Fetch Ads
  useEffect(() => {
    API.get("/ads")
      .then((res) => setAds(res.data.filter(ad => ad.active)))
      .catch((err) => console.error("Ads fetch error 👉", err));
  }, []);

  return (
    <div className="page-center">
      <BackButton />

      <div className="dashboard-container">
        <h2>User Dashboard</h2>
        <p>Welcome to Document Verification System</p>

        {/* ===== ADS SECTION ===== */}
        {ads.length > 0 && (
          <div className="ads-container">
            {ads.map((ad) => (
              <div key={ad._id} className="ad-card">
                <a
                  href={ad.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`http://localhost:5000/${ad.image}`}
                    alt={ad.title}
                  />
                </a>

                <div className="ad-content">
                  <h4>{ad.title}</h4>

                  {ad.link && (
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noreferrer"
                      className="ad-btn"
                    >
                      Visit
                    </a>
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

export default UserDashboard;
