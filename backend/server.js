const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const policyRoutes = require("./routes/policyRoutes");

const userPolicyRoutes = require("./routes/userPolicyRoutes");

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
    
    app.use("/api/auth", authRoutes);
    app.use("/api/customers", customerRoutes);
    app.use("/api/policies", policyRoutes);
    app.use("/api/user-policies", userPolicyRoutes);

    // Start Server
    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    });