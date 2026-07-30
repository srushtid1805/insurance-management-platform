import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
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
  customerGrowth = [],
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
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.raw} customer${
              context.raw === 1 ? "" : "s"
            }`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },

        title: {
          display: true,
          text: "Customers",
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
    <div className="chart-card">
      <h2>Customer Growth</h2>

      <div className="chart-wrapper">
        <Line
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default CustomerGrowthChart;