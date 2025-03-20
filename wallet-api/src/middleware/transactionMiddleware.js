const Transaction = require("../models/Transaction");

/**
 * Middleware to prevent duplicate transactions
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware function
 */
async function checkDuplicateTransaction(req, res, next) {
  const { reference_id } = req.body;

  // If no reference ID is provided, skip this check
  if (!reference_id) {
    return next();
  }

  try {
    const existingTransaction = await Transaction.findByReferenceId(
      reference_id
    );

    if (existingTransaction) {
      return res.status(409).json({
        error: "Transaction already processed",
        transaction_id: existingTransaction.id,
        code: "duplicate_transaction",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkDuplicateTransaction,
};
