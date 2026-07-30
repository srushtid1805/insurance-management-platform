import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PremiumCollectionChart = ({ premiumCollection = [] }) => {
  const chartData = {
    labels: premiumCollection.map((payment) => payment.payment_status),

    datasets: [
      {
        label: "Premium Amount",
        data: premiumCollection.map((payment) => Number(payment.total_amount)),
        backgroundColor: "#2563eb",
        borderRadius: 8,
        maxBarThickness: 60
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            return `₹${Number(context.raw).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`
        }
      },

      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="chart-card">
      <h2>Premium Collection</h2>

      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PremiumCollectionChart;
