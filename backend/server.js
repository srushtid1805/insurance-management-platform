const express = require("express");
const path = require("path");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const policyRoutes = require("./routes/policyRoutes");

const userPolicyRoutes = require("./routes/userPolicyRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const claimRoutes = require("./routes/claimRoutes");
const documentRoutes = require("./routes/documentRoutes");

const reportRoutes = require("./routes/reportRoutes");

const agentDashboardRoutes = require("./routes/agentDashboardRoutes");
const customerDashboardRoutes = require(
  "./routes/customerDashboardRoutes"
);


const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Test Database Connection
pool.connect()
    .then(()=>{
        console.log("Database Connected Succefully!");
    })
    .catch((err)=>{
        console.error("Database Connection Failed:", err.message);
    });

    // Home Route
    app.get("/",(req, res) => {
        res.send("Welcome to the Insurance Management API");
    });
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    
    app.use("/api/auth", authRoutes);
    app.use("/api/customers", customerRoutes);
    app.use("/api/policies", policyRoutes);
    app.use("/api/user-policies", userPolicyRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/claims", claimRoutes);
    app.use("/api/documents", documentRoutes);

    app.use("/api/reports", reportRoutes);

    app.use("/api/agent", agentDashboardRoutes);
    app.use("/api/customer", customerDashboardRoutes);

    // Start Server
    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    });