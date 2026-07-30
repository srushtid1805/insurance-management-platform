import "./DashboardPage.css";

import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getClaimStatistics,
  getPremiumCollection,
  getCustomerGrowth,
  getMonthlyBusinessOverview
} from "../services/reportService";

import DashboardCard from "../components/DashboardCard";
import ClaimStatisticsChart from "../components/charts/ClaimStatisticsChart";
import PremiumCollectionChart from "../components/charts/PremiumCollectionChart";
import CustomerGrowthChart from "../components/charts/CustomerGrowthChart";
import MonthlyBusinessChart from "../components/charts/MonthlyBusinessChart";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [claimStatistics, setClaimStatistics] = useState([]);
  const [premiumCollection, setPremiumCollection] = useState([]);
  const [monthlyBusiness, setMonthlyBusiness] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardSummary();

      setSummary(response.data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimStatistics = async () => {
    try {
      const response = await getClaimStatistics();
      setClaimStatistics(response.data);
    } catch (error) {
      console.error("Error loading claim statistics:", error);
    }
  };

  const fetchPremiumCollection = async () => {
    try {
      const response = await getPremiumCollection();
      setPremiumCollection(response.data);
    } catch (error) {
      console.error("Error loading premium collection:", error);
    }
  };

  const fetchCustomerGrowth = async () => {
    try {
      const response = await getCustomerGrowth();
      setCustomerGrowth(response.data);
    } catch (error) {
      console.error("Error loading customer growth:", error);
    }
  };

  const fetchMonthlyBusiness = async () => {
    try {
      const response = await getMonthlyBusinessOverview();

      setMonthlyBusiness(response.data);
    } catch (error) {
      console.error("Error loading monthly business overview:", error);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchClaimStatistics();
    fetchPremiumCollection();
    fetchCustomerGrowth();
    fetchMonthlyBusiness();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-page">
      <h1>Insurance Management Dashboard</h1>

      <div className="dashboard-grid">
        <DashboardCard
          title="Total Customers"
          value={summary?.total_customers ?? 0}
          icon="👤"
          color="#2563eb"
        />

        <DashboardCard
          title="Total Policies"
          value={summary?.total_policies ?? 0}
          icon="📄"
          color="#7c3aed"
        />

        <DashboardCard
          title="Active Policies"
          value={summary?.active_policies ?? 0}
          icon="✅"
          color="#16a34a"
        />

        <DashboardCard
          title="Expired Policies"
          value={summary?.expired_policies ?? 0}
          icon="❌"
          color="#dc2626"
        />

        <DashboardCard
          title="Total Claims"
          value={summary?.total_claims ?? 0}
          icon="📋"
          color="#f59e0b"
        />

        <DashboardCard
          title="Total Documents"
          value={summary?.total_documents ?? 0}
          icon="📁"
          color="#0ea5e9"
        />

        <DashboardCard
          title="Premium Collected"
          value={`₹${Number(
            summary?.total_premium_collected ?? 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
          icon="💰"
          color="#10b981"
          className="dashboard-card--wide"
        />
      </div>

      <div className="dashboard-charts">
        <ClaimStatisticsChart statistics={claimStatistics} />

        <PremiumCollectionChart premiumCollection={premiumCollection} />

        <CustomerGrowthChart customerGrowth={customerGrowth} />

        <MonthlyBusinessChart monthlyBusiness={monthlyBusiness} />
      </div>
    </div>
  );
};

export default DashboardPage;
