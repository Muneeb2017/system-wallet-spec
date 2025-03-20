const express = require("express");
const bodyParser = require("body-parser");
const accountRoutes = require("./routes/accountRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(bodyParser.json());

// Add request logging in development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use("/api", accountRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Wallet System API",
    version: "1.0.0",
    endpoints: {
      createAccount: "POST /api/accounts",
      getAccount: "GET /api/accounts/:id",
      topUp: "POST /api/accounts/top-up",
      charge: "POST /api/accounts/charge",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    code: "not_found",
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
