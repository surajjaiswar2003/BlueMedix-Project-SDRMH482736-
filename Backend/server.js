const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require("compression");
const connectDB = require("./config/db");
const { createDefaultAdmin } = require("./controllers/authController");
const Recipe = require("./models/Recipe");
const HealthParameters = require("./models/HealthParameters");

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

// Enable compression for all responses
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/health-parameters", require("./routes/healthParamsRoutes"));

// Add these routes as you develop them
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/dieticians", require("./routes/dieticianRoutes"));
app.use("/api/diet-plans", require("./routes/dietPlanRoutes"));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "MyDietDiary API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

const createIndexes = async () => {
  try {
    // Recipe indexes
    await Recipe.collection.createIndex({ meal_type: 1 });
    await Recipe.collection.createIndex({ diet_type: 1 });
    await Recipe.collection.createIndex({
      vegetarian: 1,
      vegan: 1,
      gluten_free: 1,
    });
    await Recipe.collection.createIndex({ recipe_id: 1 }, { unique: true });
    await Recipe.collection.createIndex({ name: "text", ingredients: "text" });
    console.log("Recipe indexes created successfully");

    // Health Parameters indexes
    try {
      // Try to drop the existing index first
      await HealthParameters.collection.dropIndex("userId_1");
      console.log("Dropped existing userId index");
    } catch (error) {
      // Ignore error if index doesn't exist
      console.log(
        "No existing index to drop or error dropping index:",
        error.message
      );
    }

    // Now create the unique index with a custom name
    await HealthParameters.collection.createIndex(
      { userId: 1 },
      { unique: true, name: "userId_unique_index" }
    );
    await HealthParameters.collection.createIndex({ dietType: 1 });
    await HealthParameters.collection.createIndex({ bmiCategory: 1 });
    await HealthParameters.collection.createIndex({ lastUpdated: -1 });
    console.log("Health Parameters indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
};

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.originalUrl,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );

  // Create default admin user
  await createDefaultAdmin();

  // Create indexes for collections
  await createIndexes();
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

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
