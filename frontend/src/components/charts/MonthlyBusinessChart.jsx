import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const MonthlyBusinessChart = ({
  monthlyBusiness = []
}) => {
  const chartData = {
    labels: monthlyBusiness.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "Customers",
        data: monthlyBusiness.map(
          (item) => Number(item.customers)
        ),
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2
      },

      {
        label: "Claims",
        data: monthlyBusiness.map(
          (item) => Number(item.claims)
        ),
        borderColor: "#dc2626",
        backgroundColor: "#dc2626",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#dc2626",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2
      },

      {
        label: "Premium",
        data: monthlyBusiness.map(
          (item) => Number(item.premium)
        ),
        borderColor: "#16a34a",
        backgroundColor: "#16a34a",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#16a34a",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        yAxisID: "premiumAxis"
      }
    ]
  };

  const totalBusinessValues =
    chartData.datasets.reduce(
      (total, dataset) =>
        total +
        dataset.data.reduce(
          (sum, value) => sum + Number(value),
          0
        ),
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
        position: "bottom",

        labels: {
          boxWidth: 12,
          padding: 14,

          font: {
            size: 12
          }
        }
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw);

            if (context.dataset.label === "Premium") {
              return `Premium: ₹${value.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
              )}`;
            }

            return `${context.dataset.label}: ${value}`;
          }
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,
        position: "left",

        ticks: {
          precision: 0,

          font: {
            size: 11
          }
        },

        title: {
          display: true,
          text: "Customers and Claims",

          font: {
            size: 12,
            weight: "600"
          }
        },

        grid: {
          color: "rgba(148, 163, 184, 0.18)"
        }
      },

      premiumAxis: {
        beginAtZero: true,
        position: "right",

        grid: {
          drawOnChartArea: false
        },

        ticks: {
          callback: (value) =>
            `₹${Number(value).toLocaleString("en-IN")}`,

          font: {
            size: 11
          }
        },

        title: {
          display: true,
          text: "Premium Amount",

          font: {
            size: 12,
            weight: "600"
          }
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
    <div className="chart-card chart-card--wide">
      <h2>Monthly Business Overview</h2>

      <div className="chart-wrapper">
        {totalBusinessValues === 0 ? (
          <div className="h-100 d-flex align-items-center justify-content-center text-muted">
            No monthly business data available.
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

export default MonthlyBusinessChart;