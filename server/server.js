const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cron = require("node-cron");

const connectDB = require("./config/db");
const { runCapaScheduler } = require("./services/capaScheduler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// Connect Database
// -----------------------------
connectDB();

// -----------------------------
// CORS Configuration
// -----------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin.includes("localhost")) return callback(null, true);

      // Allow all Vercel deployments
      if (origin.includes("vercel.app")) return callback(null, true);

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Handle preflight requests explicitly
app.options("*", cors());

// -----------------------------
// Middlewares
// -----------------------------
app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(morgan("dev"));

// -----------------------------
// Routes
// -----------------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/capa", require("./routes/capaRoutes"));
app.use("/api/risk", require("./routes/riskRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));

// -----------------------------
// Static Uploads
// -----------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// Root Route
// -----------------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// -----------------------------
// CAPA Scheduler
// -----------------------------
cron.schedule("0 0 * * *", () => {
  runCapaScheduler();
});

// Run once on startup
runCapaScheduler();
