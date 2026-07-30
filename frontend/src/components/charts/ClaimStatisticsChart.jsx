import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const ClaimStatisticsChart = ({ statistics = [] }) => {
  const getStatusTotal = (status) => {
    const item = statistics.find(
      (claim) =>
        claim.claim_status?.toLowerCase() ===
        status.toLowerCase()
    );

    return item?.total ?? 0;
  };

  const chartData = {
    labels: ["Pending", "Approved", "Rejected"],

    datasets: [
      {
        label: "Claims",
        data: [
          getStatusTotal("Pending"),
          getStatusTotal("Approved"),
          getStatusTotal("Rejected"),
        ],
        backgroundColor: [
          "#f59e0b",
          "#16a34a",
          "#dc2626",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="chart-card">
      <h2>Claim Statistics</h2>

      <div className="chart-wrapper">
        <Doughnut
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default ClaimStatisticsChart;