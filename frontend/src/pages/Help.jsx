import { useNavigate } from "react-router-dom";

function Help() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.back}>
          ⬅ Back
        </button>

        <h2 style={styles.title}>Help & Support</h2>
        <p style={styles.subtitle}>
          Guidance based on your account role
        </p>

        {role === "user" && (
          <Section title="👤 User Help">
            <li>📄 Upload documents</li>
            <li>⏳ Track verification status</li>
            <li>📩 SMS / Email alerts</li>
            <li>❌ Re-upload rejected documents</li>
          </Section>
        )}

        {role === "verifieradmin" && (
          <Section title="🛂 Verifier Admin Help">
            <li>📂 Review pending documents</li>
            <li>✅ Approve / ❌ Reject</li>
            <li>📜 View history</li>
            <li>⚠ No global settings</li>
          </Section>
        )}

        {role === "superadmin" && (
          <Section title="👑 Super Admin Help">
            <li>⚙ Manage AI settings</li>
            <li>📢 Manage ads</li>
            <li>🗑 Delete records</li>
            <li>👥 Full system control</li>
          </Section>
        )}

        <div style={{ ...styles.section, textAlign: "center" }}>
          <h3>📞 Contact Support</h3>
          <p>📧 support@docverify.com</p>
          <p>🕘 10 AM – 6 PM</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <ul style={styles.list}>{children}</ul>
    </div>
  );
}

const styles = {

    body: {
    margin: 0,
    },

  /* 👇 SAME AS .profile-wrapper */
  wrapper: {
    width: "100vw",
    minHeight: "calc(100vh - 60px)", // navbar height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  /* 👇 SAME AS .profile-container */
  container: {
    background: "#f5f7fb",
    padding: "30px 40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "360px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  back: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "10px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "20px",
  },

  section: {
    background: "#ffffff",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "14px",
    border: "1px solid #e5e7eb",
    textAlign: "left",
  },

  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  list: {
    paddingLeft: "18px",
    lineHeight: "1.6",
    fontSize: "13px",
    color: "#334155",
  },
};

export default Help;
