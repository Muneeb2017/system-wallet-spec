const { check, validationResult } = require("express-validator");
const Decimal = require("decimal.js");

// Common validation rules
const accountIdValidation = check("account_id")
  .notEmpty()
  .withMessage("Account ID is required")
  .isString()
  .withMessage("Account ID must be a string");

const amountValidation = check("amount")
  .notEmpty()
  .withMessage("Amount is required")
  .isFloat({ gt: 0 })
  .withMessage("Amount must be a positive number")
  .custom((value) => {
    // Check for maximum 2 decimal places
    const decimal = new Decimal(value);
    const decimalPlaces = decimal.decimalPlaces();
    if (decimalPlaces > 2) {
      throw new Error("Amount cannot have more than 2 decimal places");
    }
    return true;
  });

const referenceIdValidation = check("reference_id")
  .optional()
  .isString()
  .withMessage("Reference ID must be a string");

const nameValidation = check("name")
  .notEmpty()
  .withMessage("Name is required")
  .isString()
  .withMessage("Name must be a string")
  .isLength({ min: 1, max: 100 })
  .withMessage("Name must be between 1 and 100 characters");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Export validation chains
const validateCreateAccount = [nameValidation, validate];
const validateTopUp = [
  accountIdValidation,
  amountValidation,
  referenceIdValidation,
  validate,
];
const validateCharge = [
  accountIdValidation,
  amountValidation,
  referenceIdValidation,
  validate,
];

module.exports = {
  validateCreateAccount,
  validateTopUp,
  validateCharge,
};
