const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://qmics-olenwo8t6-kamble-navyasris-projects.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/capa", require("./routes/capaRoutes"));
app.use("/api/risk", require("./routes/riskRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));

// Serve Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Schedule CAPA Escalation Check (Every day at midnight)
const cron = require("node-cron");
const { runCapaScheduler } = require("./services/capaScheduler");

cron.schedule("0 0 * * *", () => {
  runCapaScheduler();
});

// Run on startup
runCapaScheduler();
