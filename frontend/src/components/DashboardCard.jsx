import "./DashboardCard.css";

const DashboardCard = ({
  title,
  value,
  icon,
  color,
  className = "",
}) => {
  return (
    <div
      className={`dashboard-card ${className}`}
      style={{ borderLeftColor: color }}
    >
      <div className="dashboard-card-header">
        <div
          className="dashboard-icon"
          style={{
            backgroundColor: `${color}20`,
            color,
          }}
        >
          {icon}
        </div>

        <div className="dashboard-card-content">
          <h3>{title}</h3>
          <h2>{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;