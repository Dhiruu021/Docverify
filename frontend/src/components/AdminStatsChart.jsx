function AdminStatsChart({ stats }) {
  const total =
    stats.pending + stats.approved + stats.rejected || 1;

  const getWidth = (value) => `${(value / total) * 100}%`;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Verification Stats</h3>

      <div style={{ marginBottom: "10px" }}>
        Pending ({stats.pending})
        <div style={barOuter}>
          <div style={{ ...barInner, width: getWidth(stats.pending), background: "#facc15" }} />
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        Approved ({stats.approved})
        <div style={barOuter}>
          <div style={{ ...barInner, width: getWidth(stats.approved), background: "#22c55e" }} />
        </div>
      </div>

      <div>
        Rejected ({stats.rejected})
        <div style={barOuter}>
          <div style={{ ...barInner, width: getWidth(stats.rejected), background: "#ef4444" }} />
        </div>
      </div>
    </div>
  );
}

const barOuter = {
  width: "100%",
  height: "14px",
  background: "#e5e7eb",
  borderRadius: "10px",
  overflow: "hidden",
};

const barInner = {
  height: "100%",
  borderRadius: "10px",
};

export default AdminStatsChart;
