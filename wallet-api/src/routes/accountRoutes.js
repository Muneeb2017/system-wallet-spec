const express = require("express");
const {
  createAccount,
  topUp,
  charge,
  getAccount,
} = require("../controllers/accountController");
const {
  checkDuplicateTransaction,
} = require("../middleware/transactionMiddleware");
const {
  validateCreateAccount,
  validateTopUp,
  validateCharge,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create a new account
router.post("/accounts", validateCreateAccount, createAccount);

// Get account details
router.get("/accounts/:id", getAccount);

// Top up an account
router.post(
  "/accounts/top-up",
  validateTopUp,
  checkDuplicateTransaction,
  topUp
);

// Charge an account
router.post(
  "/accounts/charge",
  validateCharge,
  checkDuplicateTransaction,
  charge
);

module.exports = router;
