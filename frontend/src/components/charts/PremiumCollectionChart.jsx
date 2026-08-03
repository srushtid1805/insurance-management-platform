import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const PremiumCollectionChart = ({
  premiumCollection = []
}) => {
  const chartData = {
    labels: premiumCollection.map(
      (payment) => payment.payment_status
    ),

    datasets: [
      {
        label: "Premium Amount",
        data: premiumCollection.map(
          (payment) => Number(payment.total_amount)
        ),
        backgroundColor: "#2563eb",
        borderRadius: 8,
        maxBarThickness: 60
      }
    ]
  };

  const totalPremium =
    chartData.datasets[0].data.reduce(
      (sum, value) => sum + Number(value),
      0
    );

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `₹${Number(context.raw).toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }
            )}`
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: (value) =>
            `₹${Number(value).toLocaleString("en-IN")}`,

          font: {
            size: 11
          }
        },

        grid: {
          color: "rgba(148, 163, 184, 0.18)"
        }
      },

      x: {
        grid: {
          display: false
        },

        ticks: {
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="chart-card">
      <h2>Premium Collection</h2>

      <div className="chart-wrapper">
        {totalPremium === 0 ? (
          <div className="h-100 d-flex align-items-center justify-content-center text-muted">
            No premium collection data available.
          </div>
        ) : (
          <Bar
            data={chartData}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default PremiumCollectionChart;