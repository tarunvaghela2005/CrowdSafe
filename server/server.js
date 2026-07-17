const { initSocket } = require("./socket/socket");
const http = require("http");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const testEmailRoutes = require("./routes/testEmailRoutes");

const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/email", testEmailRoutes);
app.get("/", (req, res) => {
  res.send("CrowdSafe API is Running...");
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


initSocket(server);


server.listen(PORT,()=>{

    console.log(`🚀 Server running on port ${PORT}`); 
});