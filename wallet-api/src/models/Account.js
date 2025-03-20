const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const Decimal = require("decimal.js");

class Account {
  /**
   * Create a new account
   * @param {string} name - The account holder's name
   * @returns {Promise<Object>} - The created account object
   */
  static async create(name) {
    const id = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    const [account] = await db("accounts")
      .insert({
        id,
        name,
        balance: 0,
        created_at: now,
        updated_at: now,
      })
      .returning(["id", "name", "balance", "created_at", "updated_at"]);

    // Convert balance to dollars for API response
    return {
      ...account,
      balance: this.centsToDollars(account.balance),
    };
  }

  /**
   * Find an account by ID
   * @param {string} id - The account ID
   * @returns {Promise<Object|null>} - The account object or null if not found
   */
  static async findById(id) {
    const account = await db("accounts").where({ id }).first();

    if (!account) return null;

    // Convert balance to dollars for API response
    return {
      ...account,
      balance: this.centsToDollars(account.balance),
    };
  }

  /**
   * Update account balance
   * @param {string} id - The account ID
   * @param {number} amountInCents - Amount to add (positive) or subtract (negative) in cents
   * @returns {Promise<Object>} - Updated account balance
   */
  static async updateBalance(id, amountInCents) {
    // Start a transaction to ensure data consistency
    return db.transaction(async (trx) => {
      // Lock the row for update to prevent race conditions
      const account = await trx("accounts")
        .where({ id })
        .select("*")
        .forUpdate()
        .first();

      if (!account) {
        throw new Error("Account not found");
      }

      const newBalance = account.balance + amountInCents;

      // Ensure balance never becomes negative
      if (newBalance < 0) {
        throw new Error("Insufficient funds");
      }

      // Update the account balance
      await trx("accounts")
        .where({ id })
        .update({
          balance: newBalance,
          updated_at: Math.floor(Date.now() / 1000),
        });

      return {
        id,
        balance: this.centsToDollars(newBalance),
      };
    });
  }

  /**
   * Convert cents to dollars with proper precision
   * @param {number} cents - Amount in cents
   * @returns {number} - Amount in dollars with 2 decimal places
   */
  static centsToDollars(cents) {
    return new Decimal(cents).dividedBy(100).toNumber();
  }

  /**
   * Convert dollars to cents with proper precision
   * @param {number} dollars - Amount in dollars
   * @returns {number} - Amount in cents as integer
   */
  static dollarsToCents(dollars) {
    return new Decimal(dollars).times(100).toInteger();
  }
}

module.exports = Account;
