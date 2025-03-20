/**
 * Central error handling middleware
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware function
 */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Handle specific error types
  const errorResponses = {
    "Account not found": { status: 404, message: "Account not found" },
    "Insufficient funds": {
      status: 400,
      message: "Insufficient funds for this transaction",
    },
    "Duplicate transaction": {
      status: 409,
      message: "Transaction already processed",
    },
    "Invalid amount": {
      status: 400,
      message: "Invalid amount format or value",
    },
  };

  const errorResponse = errorResponses[err.message];

  if (errorResponse) {
    return res.status(errorResponse.status).json({
      error: errorResponse.message,
      code: err.code || err.message.toLowerCase().replace(/\s+/g, "_"),
    });
  }

  // Handle database errors
  if (err.code && err.code.startsWith("SQLITE_")) {
    return res.status(500).json({
      error: "Database error",
      code: "database_error",
    });
  }

  // Default error handler
  res.status(500).json({
    error: "Internal server error",
    code: "internal_server_error",
  });
}

module.exports = errorHandler;
