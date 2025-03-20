require("dotenv").config();
const app = require("./app");
const db = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Check database connection
    await db.raw("SELECT 1");
    console.log("Database connection established");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Handle shutdown gracefully
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  try {
    await db.destroy();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});
