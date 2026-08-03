import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CustomerGrowthChart = ({
  customerGrowth = []
}) => {
  const chartData = {
    labels: customerGrowth.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "New Customers",
        data: customerGrowth.map(
          (item) => Number(item.total_customers)
        ),
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.15)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#7c3aed",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2
      }
    ]
  };

  const totalCustomers =
    chartData.datasets[0].data.reduce(
      (sum, value) => sum + Number(value),
      0
    );

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false
    },

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw);

            return `${value} customer${
              value === 1 ? "" : "s"
            }`;
          }
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          font: {
            size: 11
          }
        },

        title: {
          display: true,
          text: "Customers",
          font: {
            size: 12,
            weight: "600"
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
      <h2>Customer Growth</h2>

      <div className="chart-wrapper">
        {totalCustomers === 0 ? (
          <div className="h-100 d-flex align-items-center justify-content-center text-muted">
            No customer growth data available.
          </div>
        ) : (
          <Line
            data={chartData}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerGrowthChart;