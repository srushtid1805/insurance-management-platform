const express = require("express");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
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

    // Start Server
    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    });