const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { v4: uuidv4 } = require("uuid");

/**
 * Create a new account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createAccount(req, res, next) {
  try {
    const { name } = req.body;

    const account = await Account.create(name);

    res.status(201).json({
      success: true,
      data: account,
      message: "Account created successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Top up an account with funds
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function topUp(req, res, next) {
  try {
    const { account_id, amount, reference_id = uuidv4() } = req.body;

    // Check if account exists
    const account = await Account.findById(account_id);
    if (!account) {
      throw new Error("Account not found");
    }

    // Create transaction first (this will check for duplicates)
    const transaction = await Transaction.create(
      account_id,
      "top_up",
      amount,
      reference_id
    );

    // Update account balance
    const updatedAccount = await Account.updateBalance(
      account_id,
      Account.dollarsToCents(amount)
    );

    res.status(200).json({
      success: true,
      data: {
        account_id,
        new_balance: updatedAccount.balance,
        transaction_id: transaction.id,
        transaction_reference: reference_id,
      },
      message: "Account topped up successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Charge an account (deduct funds)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function charge(req, res, next) {
  try {
    const { account_id, amount, reference_id = uuidv4() } = req.body;

    // Check if account exists
    const account = await Account.findById(account_id);
    if (!account) {
      throw new Error("Account not found");
    }

    // Ensure account has sufficient funds
    if (account.balance < amount) {
      throw new Error("Insufficient funds");
    }

    // Create transaction first (this will check for duplicates)
    const transaction = await Transaction.create(
      account_id,
      "charge",
      amount,
      reference_id
    );

    // Update account balance (negative amount for charge)
    const updatedAccount = await Account.updateBalance(
      account_id,
      -Account.dollarsToCents(amount)
    );

    res.status(200).json({
      success: true,
      data: {
        account_id,
        new_balance: updatedAccount.balance,
        transaction_id: transaction.id,
        transaction_reference: reference_id,
      },
      message: "Account charged successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get account details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getAccount(req, res, next) {
  try {
    const { id } = req.params;

    const account = await Account.findById(id);
    if (!account) {
      throw new Error("Account not found");
    }

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAccount,
  topUp,
  charge,
  getAccount,
};
