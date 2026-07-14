const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

connectDB();

app.use(express.json());


// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);


app.get("/", (req, res) => {
  res.send("CrowdSafe API is Running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});