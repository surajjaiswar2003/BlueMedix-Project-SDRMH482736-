const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { createDefaultAdmin } = require("./controllers/authController");

// Load environment variables
dotenv.config();

// Validate essential environment variables
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable is not set!");
  process.exit(1);
}

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Add these routes as you develop them
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/dieticians", require("./routes/dieticianRoutes"));
// app.use("/api/diet-plans", require("./routes/dietPlanRoutes"));

// Basic route
app.get("/", (req, res) => {
  res.send("MyDietDiary API is running");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );

  // Create default admin user
  createDefaultAdmin();
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
