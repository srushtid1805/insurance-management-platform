import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
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
  monthlyBusiness = [],
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
        yAxisID: "premiumAxis",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "bottom",
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw);

            if (context.dataset.label === "Premium") {
              return `Premium: ₹${value.toLocaleString(
                "en-IN"
              )}`;
            }

            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        position: "left",

        ticks: {
          precision: 0,
        },

        title: {
          display: true,
          text: "Customers and Claims",
        },
      },

      premiumAxis: {
        beginAtZero: true,
        position: "right",

        grid: {
          drawOnChartArea: false,
        },

        ticks: {
          callback: (value) =>
            `₹${Number(value).toLocaleString("en-IN")}`,
        },

        title: {
          display: true,
          text: "Premium Amount",
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="chart-card chart-card--wide">
      <h2>Monthly Business Overview</h2>

      <div className="chart-wrapper">
        <Line
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default MonthlyBusinessChart;