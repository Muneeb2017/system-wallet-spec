const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const Account = require("./Account");
const Decimal = require("decimal.js");

class Transaction {
  /**
   * Create a new transaction
   * @param {string} accountId - The account ID
   * @param {string} type - Transaction type ('top_up' or 'charge')
   * @param {number} amount - Amount in dollars
   * @param {string} referenceId - Unique reference ID to prevent duplicates
   * @returns {Promise<Object>} - The created transaction object
   */
  static async create(accountId, type, amount, referenceId) {
    try {
      const id = uuidv4();

      // Convert amount to cents for storage
      const amountInCents = Account.dollarsToCents(amount);

      const [transaction] = await db("transactions")
        .insert({
          id,
          account_id: accountId,
          type,
          amount: amountInCents,
          reference_id: referenceId,
          created_at: Math.floor(Date.now() / 1000),
        })
        .returning([
          "id",
          "account_id",
          "type",
          "amount",
          "reference_id",
          "created_at",
        ]);

      // Convert amount back to dollars for API response
      return {
        ...transaction,
        amount: Account.centsToDollars(transaction.amount),
      };
    } catch (error) {
      // Handle unique constraint violation for reference_id
      if (
        error.code === "SQLITE_CONSTRAINT" ||
        (error.message && error.message.includes("UNIQUE constraint failed"))
      ) {
        throw new Error("Duplicate transaction");
      }
      throw error;
    }
  }

  /**
   * Find a transaction by reference ID
   * @param {string} referenceId - The transaction reference ID
   * @returns {Promise<Object|null>} - The transaction or null if not found
   */
  static async findByReferenceId(referenceId) {
    const transaction = await db("transactions")
      .where({ reference_id: referenceId })
      .first();

    if (!transaction) return null;

    // Convert amount to dollars for API response
    return {
      ...transaction,
      amount: Account.centsToDollars(transaction.amount),
    };
  }
}

module.exports = Transaction;
