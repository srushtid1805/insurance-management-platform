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

        labels: {
          boxWidth: 12,
          padding: 14,

          font: {
            size: 12,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw} claims`,
        },
      },
    },
  };

  const totalClaims =
    chartData.datasets[0].data.reduce(
      (sum, value) => sum + Number(value),
      0
    );

  return (
    <div className="chart-card">
      <h2>Claim Statistics</h2>

      <div className="chart-wrapper">
        {totalClaims === 0 ? (
          <div className="h-100 d-flex align-items-center justify-content-center text-muted">
            No claim statistics available.
          </div>
        ) : (
          <Doughnut
            data={chartData}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default ClaimStatisticsChart;