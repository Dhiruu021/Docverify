import "./AdminStatsChart.css";

function AdminStatsChart({ stats }) {
  const total = stats.pending + stats.approved + stats.rejected || 1;

  const getWidth = (value) => `${(value / total) * 100}%`;
  const getPercentage = (value) => Math.round((value / total) * 100);

  const statItems = [
    { label: "Pending", value: stats.pending, color: "#f59e0b", className: "pending" },
    { label: "Approved", value: stats.approved, color: "#22c55e", className: "approved" },
    { label: "Rejected", value: stats.rejected, color: "#ef4444", className: "rejected" },
  ];

  return (
    <div className="stats-chart">
      <h3 className="stats-title">Document Verification Statistics</h3>
      <div className="stats-grid">
        {statItems.map((item) => (
          <div key={item.label} className="stat-item">
            <div className="stat-header">
              <span className="stat-label">{item.label}</span>
              <span className="stat-value">
                {item.value} <span className="stat-percent">({getPercentage(item.value)}%)</span>
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${item.className}`}
                style={{ width: getWidth(item.value) }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="stats-total">
        <span>Total Documents:</span>
        <span className="total-value">{total}</span>
      </div>
    </div>
  );
}

export default AdminStatsChart;
